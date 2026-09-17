"""Raw Karachi source transport tests; fixtures contain no project data."""

import asyncio
import inspect
import io
import zipfile
from unittest.mock import AsyncMock

import httpx
import pytest
from pydantic import ValidationError

from backend.services.external import SourceError, SourceHTTP
from backend.services.karachi import (
    download_karachi_file, fetch_karachi_catalog, load_karachi_file,
)
from backend.services.source_requests import KarachiCatalogRequest, KarachiFileRequest


class WireBody(httpx.AsyncByteStream):
    def __init__(self, content):
        self.content = content

    async def __aiter__(self):
        yield self.content


def wire_transport(handler):
    async def respond(request):
        response = handler(request)
        if inspect.isawaitable(response):
            response = await response
        if response.is_stream_consumed:
            return httpx.Response(
                response.status_code,
                headers=response.headers,
                stream=WireBody(response.content),
            )
        return response

    return httpx.MockTransport(respond)


def zip_bytes():
    body = io.BytesIO()
    with zipfile.ZipFile(body, "w") as archive:
        archive.writestr("synthetic/readme.txt", "transport fixture")
    return body.getvalue()


def test_karachi_catalog_uses_fixed_ckan_dataset_and_cache(settings):
    async def check():
        handler = AsyncMock(return_value=httpx.Response(200, json={
            "success": True,
            "result": {
                "name": "karachi-pakistan-informal-settlements-esa-eo4sd-urban",
                "resources": [{"id": "synthetic-resource", "url": "https://invalid.invalid"}],
            },
        }))
        selection = KarachiCatalogRequest(dataset="informal_settlements")
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            first = await fetch_karachi_catalog(http, selection)
            second = await fetch_karachi_catalog(http, selection)

        assert handler.await_count == 1
        request = handler.await_args.args[0]
        assert request.url.host == "energydata.info"
        assert request.url.path == "/api/3/action/package_show"
        assert request.url.params["id"] == (
            "karachi-pakistan-informal-settlements-esa-eo4sd-urban"
        )
        assert first.kind == "catalog"
        assert first.from_cache is False
        assert second.from_cache is True
        assert first.payload["result"]["resources"][0]["id"] == "synthetic-resource"

    asyncio.run(check())


def test_karachi_catalog_rejects_a_different_dataset(settings):
    async def check():
        handler = lambda request: httpx.Response(200, json={
            "success": True,
            "result": {"name": "different-dataset", "resources": []},
        })
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            with pytest.raises(SourceError) as error:
                await fetch_karachi_catalog(
                    http, KarachiCatalogRequest(dataset="land_use_land_cover"),
                )
            assert not http.cache.entries
        assert error.value.code == "invalid_source_response"

    asyncio.run(check())


def test_karachi_download_streams_fixed_zip_and_local_loader_reuses_it(settings, tmp_path):
    async def check():
        body = zip_bytes()
        requests = []

        def handler(request):
            requests.append(request)
            return httpx.Response(
                200,
                stream=WireBody(body),
                headers={
                    "Content-Type": "application/octet-stream",
                    "Content-Length": str(len(body)),
                    "ETag": "synthetic-etag",
                },
            )

        selection = KarachiFileRequest(resource="informal_2017")
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            downloaded = await download_karachi_file(http, selection, tmp_path)
            with pytest.raises(FileExistsError):
                await download_karachi_file(http, selection, tmp_path)

        expected = tmp_path / "eo4sd_karachi_informal_2017.zip"
        assert expected.read_bytes() == body
        assert downloaded.path == expected
        assert downloaded.byte_length == len(body)
        assert downloaded.origin == "download"
        assert downloaded.headers["etag"] == "synthetic-etag"
        assert len(requests) == 1
        assert requests[0].url.host == "datacatalogfiles.worldbank.org"
        assert requests[0].headers["accept"] == "application/zip, application/octet-stream"

        local = load_karachi_file(selection, expected, max_bytes=settings.external_max_file_bytes)
        assert local.path == expected.resolve()
        assert local.byte_length == len(body)
        assert local.origin == "local"

    asyncio.run(check())


@pytest.mark.parametrize(
    "content_type", ["text/html", "application/json", "application/octet-stream"],
)
def test_karachi_download_rejects_non_zip_responses(settings, tmp_path, content_type):
    async def check():
        handler = lambda request: httpx.Response(
            200,
            stream=WireBody(b"not a zip"),
            headers={"Content-Type": content_type},
        )
        selection = KarachiFileRequest(resource="informal_2005")
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            with pytest.raises(SourceError) as error:
                await download_karachi_file(http, selection, tmp_path)
        assert error.value.code == "invalid_source_response"
        assert not list(tmp_path.iterdir())

    asyncio.run(check())


def test_karachi_download_enforces_file_limit_and_removes_partial_file(settings, tmp_path):
    async def check():
        body = zip_bytes()
        small = settings.model_copy(update={"external_max_file_bytes": len(body) - 1})
        handler = lambda request: httpx.Response(
            200,
            stream=WireBody(body),
            headers={"Content-Type": "application/octet-stream"},
        )
        async with SourceHTTP(small, transport=wire_transport(handler)) as http:
            with pytest.raises(SourceError) as error:
                await download_karachi_file(
                    http, KarachiFileRequest(resource="lulc_core_2017"), tmp_path,
                )
        assert error.value.code == "source_response_too_large"
        assert not list(tmp_path.iterdir())

    asyncio.run(check())


def test_local_karachi_loader_requires_published_name_valid_zip_and_bound(tmp_path):
    selection = KarachiFileRequest(resource="lulc_peri_2005")
    wrong_name = tmp_path / "renamed.zip"
    wrong_name.write_bytes(zip_bytes())
    with pytest.raises(ValueError, match="published filename"):
        load_karachi_file(selection, wrong_name, max_bytes=1024)

    expected = tmp_path / "eo4sd_karachi_lulchr_2005.zip"
    expected.write_bytes(b"not a zip")
    with pytest.raises(ValueError, match="ZIP archive"):
        load_karachi_file(selection, expected, max_bytes=1024)
    expected.write_bytes(zip_bytes())
    with pytest.raises(ValueError, match="byte limit"):
        load_karachi_file(selection, expected, max_bytes=1)


@pytest.mark.parametrize("model,fields", [
    (KarachiCatalogRequest, {"dataset": "all_karachi_data"}),
    (KarachiFileRequest, {"resource": "../private.zip"}),
    (KarachiFileRequest, {"resource": "maptiler"}),
])
def test_unknown_karachi_selections_are_rejected(model, fields):
    with pytest.raises(ValidationError):
        model.model_validate(fields)


def test_unknown_static_file_source_cannot_be_requested(settings, tmp_path):
    async def check():
        handler = AsyncMock()
        async with SourceHTTP(settings, transport=wire_transport(handler)) as http:
            with pytest.raises(ValueError):
                await http.download("https://127.0.0.1/private", tmp_path / "private.zip",
                                    validate=lambda path: None)
        handler.assert_not_called()

    asyncio.run(check())
