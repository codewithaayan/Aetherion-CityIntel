"""Synthetic transport fixtures only; these are not UrbanPulse measurements."""

import asyncio
import gzip
import inspect
import json
from datetime import date, datetime, timezone
from unittest.mock import AsyncMock

import httpx
import pytest
from pydantic import ValidationError

from backend.errors import APIError
from backend.services.air_quality import fetch_air_quality
from backend.services.earthdata import fetch_earthdata_collections, fetch_earthdata_granules
from backend.services.external import SourceError, SourceHTTP, fetch_for_pipeline, retry_delay
from backend.services.osm import fetch_overpass
from backend.services.population import fetch_worldpop_catalog, fetch_worldpop_datasets
from backend.services.satellite import fetch_landsat_catalog, fetch_sentinel_catalog
from backend.services.source_requests import (
    AirQualityRequest, EarthdataCollectionSearch, EarthdataGranuleSearch,
    LandsatSearch, OverpassRequest, SentinelSearch, WorldPopSearch,
)

TIME = datetime(2026, 1, 1, tzinfo=timezone.utc)
SPATIAL = dict(bbox=(0.0, 0.0, 1.0, 1.0), start=TIME, end=TIME, limit=1)
AIR = dict(latitude=0.0, longitude=0.0, hourly=["pm2_5", "pm10"],
           start_date=date(2026, 1, 1), end_date=date(2026, 1, 1), domains="cams_global")
AIR_PAYLOAD = {"hourly": {"time": ["2026-01-01T00:00"], "pm2_5": [None], "pm10": [0]},
               "hourly_units": {"pm2_5": "synthetic-unit", "pm10": "synthetic-unit"},
               "fixture_extra": {"untouched": True}}
STAC = {"type": "FeatureCollection", "features": [], "links": [{"rel": "next", "href": "https://invalid.invalid/never-follow"}]}


class WireBody(httpx.AsyncByteStream):
    def __init__(self, content):
        self.content = content

    async def __aiter__(self):
        yield self.content


def wire_transport(handler):
    """Make buffered JSON fixtures arrive as a fresh raw HTTP stream each time."""
    async def respond(request):
        response = handler(request)
        if inspect.isawaitable(response):
            response = await response
        if response.is_stream_consumed:
            return httpx.Response(response.status_code, headers=response.headers,
                                  stream=WireBody(response.content))
        return response
    return httpx.MockTransport(respond)


def test_air_parameters_and_raw_response_are_preserved(settings):
    async def check():
        requests = []
        original = json.dumps(AIR_PAYLOAD, indent=2).encode()
        def handler(request):
            requests.append(request)
            return httpx.Response(200, content=original, headers={"Content-Type": "application/json", "ETag": "synthetic-tag"})
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            result = await fetch_air_quality(http, AirQualityRequest(**AIR))
            assert result.body == original
            assert result.payload == AIR_PAYLOAD
            assert result.kind == "data"
            assert result.headers["etag"] == "synthetic-tag"
            assert result.fetched_at.tzinfo is not None
            params = requests[0].url.params
            assert params["hourly"] == "pm2_5,pm10"
            assert params["timezone"] == "GMT"
            assert params["domains"] == "cams_global"
            assert "apikey" not in params
            assert requests[0].headers["accept-encoding"] == "identity"
    asyncio.run(check())


def test_identical_fetches_are_cached_and_copies_are_independent(settings):
    async def check():
        handler = AsyncMock(return_value=httpx.Response(200, json=AIR_PAYLOAD))
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            first, second = await asyncio.gather(*[
                fetch_air_quality(http, AirQualityRequest(**AIR)) for _ in range(2)
            ])
            assert handler.await_count == 1
            assert first.from_cache is False
            assert second.from_cache is True
            assert first.fetched_at == second.fetched_at
            first.payload["hourly"]["pm10"][0] = 999
            third = await fetch_air_quality(http, AirQualityRequest(**AIR))
            assert third.payload == AIR_PAYLOAD
            http.cache.clear()
            changed = AirQualityRequest(**{**AIR, "domains": "cams_europe"})
            await fetch_air_quality(http, changed)
            assert handler.await_count == 2
    asyncio.run(check())


def test_cache_expiry_makes_a_new_request_without_changing_old_fetch_time(settings):
    async def check():
        handler = AsyncMock(return_value=httpx.Response(200, json=AIR_PAYLOAD))
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            clock = [0]
            http.cache.clock = lambda: clock[0]
            first = await fetch_air_quality(http, AirQualityRequest(**AIR))
            clock[0] = settings.external_cache_ttl_seconds
            second = await fetch_air_quality(http, AirQualityRequest(**AIR))
            assert handler.await_count == 2
            assert second.from_cache is False
            assert second.fetched_at >= first.fetched_at
    asyncio.run(check())


def test_source_queries_are_separate_cache_keys(settings):
    async def check():
        handler = AsyncMock(return_value=httpx.Response(200, json=AIR_PAYLOAD))
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            await fetch_air_quality(http, AirQualityRequest(**AIR))
            await fetch_air_quality(http, AirQualityRequest(**{**AIR, "longitude": 1.0}))
            assert handler.await_count == 2
    asyncio.run(check())


@pytest.mark.parametrize("status,code", [(400, "source_http_error"), (401, "source_access_unavailable"),
    (403, "source_access_unavailable"), (404, "source_http_error"), (500, "source_http_error"),
    (302, "source_http_error")])
def test_http_errors_are_not_retried_followed_or_leaked(settings, status, code):
    async def check():
        handler = AsyncMock(return_value=httpx.Response(status, text="secret response",
                          headers={"Location": "http://127.0.0.1/private"}))
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            with pytest.raises(SourceError) as error:
                await fetch_air_quality(http, AirQualityRequest(**AIR))
            assert error.value.code == code
            assert "secret" not in error.value.message
            assert handler.await_count == 1
            assert not http.cache.entries
    asyncio.run(check())


@pytest.mark.parametrize("status", [429, 503])
def test_rate_limit_respects_retry_after_and_prevents_repeat_requests(settings, status):
    async def check():
        handler = AsyncMock(return_value=httpx.Response(status, headers={"Retry-After": "120"}))
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            for _ in range(2):
                with pytest.raises(SourceError) as error:
                    await fetch_air_quality(http, AirQualityRequest(**AIR))
                assert error.value.code == "source_rate_limited"
                assert error.value.retry_after_seconds >= 119
            assert handler.await_count == 1
    asyncio.run(check())


def test_retry_after_dates_and_invalid_headers():
    assert retry_delay("invalid") == 60
    assert retry_delay("Wed, 21 Oct 2015 07:28:00 GMT") == 1
    assert retry_delay("0") == 1


@pytest.mark.parametrize("body,content_type", [
    (b"<html>secret</html>", "text/html"), (b"{", "application/json"),
    (b'{"x":NaN}', "application/json"), (b'{"x":1e999}', "application/json"),
    (b'{"error":true,"reason":"secret"}', "application/json"),
    (b"[]", "application/json"), (b"{}", "application/json"),
])
def test_invalid_payload_is_not_cached_or_forwarded(settings, body, content_type):
    async def check():
        handler = AsyncMock(return_value=httpx.Response(200, content=body, headers={"Content-Type": content_type}))
        receiver = AsyncMock()
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            with pytest.raises(SourceError):
                await fetch_for_pipeline(lambda: fetch_air_quality(http, AirQualityRequest(**AIR)), receiver)
            receiver.assert_not_called()
            assert not http.cache.entries
    asyncio.run(check())


def test_body_size_is_bounded_without_content_length(settings):
    class Chunks(httpx.AsyncByteStream):
        async def __aiter__(self):
            yield b" " * 700
            yield b" " * 700

    async def check():
        small = settings.model_copy(update={"external_max_response_bytes": 1024})
        handler = lambda request: httpx.Response(200, stream=Chunks(), headers={"Content-Type": "application/json"})
        async with SourceHTTP(small, transport=wire_transport(handler)) as http:
            with pytest.raises(SourceError) as error:
                await fetch_air_quality(http, AirQualityRequest(**AIR))
            assert error.value.code == "source_response_too_large"
    asyncio.run(check())


def test_content_length_limit(settings):
    async def check():
        handler = lambda request: httpx.Response(200, content=b"{}", headers={
            "Content-Type": "application/json", "Content-Length": str(settings.external_max_response_bytes + 1)})
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            with pytest.raises(SourceError) as error:
                await fetch_air_quality(http, AirQualityRequest(**AIR))
            assert error.value.code == "source_response_too_large"
    asyncio.run(check())


def test_gzip_preserves_raw_json_bytes(settings):
    async def check():
        body = json.dumps(AIR_PAYLOAD, indent=2).encode()
        def handler(request):
            return httpx.Response(200, stream=WireBody(gzip.compress(body)),
                headers={"Content-Type": "application/json", "Content-Encoding": "gzip"})
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            result = await fetch_air_quality(http, AirQualityRequest(**AIR))
            assert result.body == body
            assert result.payload == AIR_PAYLOAD
    asyncio.run(check())


def test_worldpop_none_content_encoding_means_uncompressed(settings):
    async def check():
        handler = lambda request: httpx.Response(200, json={"data": []}, headers={"Content-Encoding": "none"})
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            result = await fetch_worldpop_datasets(http)
            assert result.payload == {"data": []}
            assert result.headers["content-encoding"] == "none"
    asyncio.run(check())


def test_gzip_expansion_is_bounded(settings):
    async def check():
        small = settings.model_copy(update={"external_max_response_bytes": 1024})
        compressed = gzip.compress(b" " * 100000)
        assert len(compressed) < 1024
        def handler(request):
            return httpx.Response(200, stream=WireBody(compressed),
                headers={"Content-Type": "application/json", "Content-Encoding": "gzip"})
        async with SourceHTTP(small, transport=wire_transport(handler)) as http:
            with pytest.raises(SourceError) as error:
                await fetch_air_quality(http, AirQualityRequest(**AIR))
            assert error.value.code == "source_response_too_large"
    asyncio.run(check())


@pytest.mark.parametrize("content", [b"not gzip", gzip.compress(b"{}")[0:-4]])
def test_invalid_or_truncated_gzip_is_rejected(settings, content):
    async def check():
        def handler(request):
            return httpx.Response(200, stream=WireBody(content),
                headers={"Content-Type": "application/json", "Content-Encoding": "gzip"})
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            with pytest.raises(SourceError) as error:
                await fetch_air_quality(http, AirQualityRequest(**AIR))
            assert error.value.code == "invalid_source_response"
    asyncio.run(check())


def test_connection_errors_are_sanitized(settings):
    async def check():
        async def handler(request):
            raise httpx.ConnectError("secret network details")
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            with pytest.raises(SourceError) as error:
                await fetch_air_quality(http, AirQualityRequest(**AIR))
            assert error.value.code == "source_connection_failed"
            assert "secret" not in error.value.message
    asyncio.run(check())


def test_total_deadline_includes_a_slow_response(settings):
    async def check():
        async def handler(request):
            await asyncio.sleep(10)
        short = settings.model_copy(update={"external_timeout_seconds": 0.02})
        async with SourceHTTP(short, transport=wire_transport(handler)) as http:
            with pytest.raises(SourceError) as error:
                await fetch_air_quality(http, AirQualityRequest(**AIR))
            assert error.value.status == 504
    asyncio.run(check())


def test_overpass_query_is_encoded_and_transport_settings_are_bounded(settings):
    async def check():
        observed = []
        def handler(request):
            observed.append(request)
            return httpx.Response(200, json={"elements": [], "osm3s": {"fixture": "synthetic"}})
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            query = 'node["name"="Synthetic A&B"];out;'
            result = await fetch_overpass(http, OverpassRequest(statements=query))
            assert observed[0].method == "POST"
            from urllib.parse import parse_qs
            sent = parse_qs(observed[0].content.decode())["data"][0]
            assert sent.startswith("[out:json][timeout:20][maxsize:16777216];\n")
            assert sent.endswith(query)
            assert result.payload["elements"] == []
            assert result.kind == "data"
    asyncio.run(check())


@pytest.mark.parametrize("statements", ['[out:xml];out;', '[timeout:999];out;', '[maxsize:999];out;', '{{geocodeArea:city}};out;'])
def test_overpass_cannot_override_limits_or_use_browser_macros(settings, statements):
    async def check():
        handler = AsyncMock()
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            with pytest.raises(ValueError):
                await fetch_overpass(http, OverpassRequest(statements=statements))
            handler.assert_not_called()
    asyncio.run(check())


def test_overpass_partial_success_is_rejected(settings):
    async def check():
        handler = lambda request: httpx.Response(200, json={"elements": [], "remark": "runtime error: secret"})
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            with pytest.raises(SourceError) as error:
                await fetch_overpass(http, OverpassRequest(statements="out;"))
            assert "secret" not in error.value.message
            assert not http.cache.entries
    asyncio.run(check())


@pytest.mark.parametrize("fetch,selection,host", [
    (fetch_landsat_catalog, LandsatSearch(**SPATIAL, collection="landsat-c2l2-st"), "landsatlook.usgs.gov"),
    (fetch_sentinel_catalog, SentinelSearch(**SPATIAL, collection="sentinel-2-l2a"), "stac.dataspace.copernicus.eu"),
])
def test_stac_is_catalog_only_and_does_not_follow_links(settings, fetch, selection, host):
    async def check():
        requests = []
        def handler(request):
            requests.append(request)
            return httpx.Response(200, json=STAC)
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            result = await fetch(http, selection)
            assert result.kind == "catalog"
            assert result.payload == STAC
            assert len(requests) == 1
            assert requests[0].url.host == host
            assert requests[0].url.params["collections"] == selection.collection
            assert requests[0].url.params["bbox"] == "0.0,0.0,1.0,1.0"
    asyncio.run(check())


def test_earthdata_query_preserves_selection_and_pagination(settings):
    async def check():
        requests = []
        def handler(request):
            requests.append(request)
            return httpx.Response(200, json={"feed": {"entry": []}}, headers={"CMR-Hits": "0"})
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            await fetch_earthdata_collections(http, EarthdataCollectionSearch(short_name="GPM_3IMERGHH"))
            result = await fetch_earthdata_granules(http, EarthdataGranuleSearch(
                **SPATIAL, short_name="GPM_3IMERGHH", version="synthetic-version", page_num=2))
            assert requests[0].url.path == "/search/collections.json"
            assert requests[1].url.params["version"] == "synthetic-version"
            assert requests[1].url.params["page_num"] == "2"
            assert result.headers["cmr-hits"] == "0"
            assert result.kind == "catalog"
    asyncio.run(check())


def test_worldpop_catalog_uses_verified_hub_without_calculating_population(settings):
    async def check():
        requests = []
        def handler(request):
            requests.append(request)
            return httpx.Response(200, json={"data": [{"alias": "synthetic_dataset"}]})
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            await fetch_worldpop_datasets(http)
            result = await fetch_worldpop_catalog(http, WorldPopSearch(dataset="synthetic_dataset", iso3="AAA"))
            assert requests[0].url.host == "hub.worldpop.org"
            assert requests[1].url.path == "/rest/data/pop/synthetic_dataset"
            assert requests[1].url.params["iso3"] == "AAA"
            assert result.kind == "catalog"
    asyncio.run(check())


def test_unconfigured_pipeline_does_not_fetch():
    fetch = AsyncMock()
    with pytest.raises(APIError) as error:
        asyncio.run(fetch_for_pipeline(fetch, None))
    assert error.value.code == "data_pipeline_not_configured"
    fetch.assert_not_called()


def test_raw_result_reaches_pipeline_without_normalization(settings):
    async def check():
        receiver = AsyncMock()
        handler = lambda request: httpx.Response(200, json=AIR_PAYLOAD)
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            result = await fetch_for_pipeline(lambda: fetch_air_quality(http, AirQualityRequest(**AIR)), receiver)
            receiver.assert_awaited_once_with(result)
            assert result.payload == AIR_PAYLOAD
    asyncio.run(check())


@pytest.mark.parametrize("model,fields", [
    (AirQualityRequest, {**AIR, "latitude": 91}),
    (AirQualityRequest, {**AIR, "longitude": float("nan")}),
    (AirQualityRequest, {**AIR, "hourly": ["temperature_2m"]}),
    (AirQualityRequest, {**AIR, "start_date": "2026-01-02"}),
    (AirQualityRequest, {**AIR, "domains": "made_up"}),
    (LandsatSearch, {**SPATIAL, "collection": "unlisted-satellite"}),
    (SentinelSearch, {**SPATIAL, "collection": "sentinel-1"}),
    (WorldPopSearch, {"dataset": "../private"}),
    (WorldPopSearch, {"dataset": "https://unapproved.invalid"}),
    (EarthdataCollectionSearch, {"short_name": "unlisted_dataset"}),
])
def test_invalid_source_selections_are_rejected(model, fields):
    with pytest.raises(ValidationError):
        model.model_validate(fields)


def test_unknown_hosts_and_paths_cannot_be_requested(settings):
    async def check():
        handler = AsyncMock()
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            with pytest.raises(ValueError):
                await http.request("http://127.0.0.1", kind="data", validate=lambda data: None)
            with pytest.raises(ValueError):
                await http.request("worldpop_catalog", kind="catalog", path_suffix="../private", validate=lambda data: None)
            handler.assert_not_called()
    asyncio.run(check())
