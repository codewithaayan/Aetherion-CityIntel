from backend.services import select_measurements
from backend.services.source_requests import LandsatSearch, SentinelSearch


def satellite_data(records):
    """Serve prepared satellite values without discovery, conversion or processing."""
    return select_measurements(records, ("temperature", "ndvi", "green_percentage"))


async def _search_stac(http, source, selection):
    params = {
        "collections": selection.collection,
        "bbox": ",".join(str(value) for value in selection.bbox),
        "datetime": f"{selection.start.isoformat()}/{selection.end.isoformat()}",
        "limit": selection.limit,
    }

    def validate(payload):
        if payload.get("type") != "FeatureCollection" or not isinstance(payload.get("features"), list):
            raise ValueError("Expected STAC search results")
        if not isinstance(payload.get("links"), list):
            raise ValueError("Missing STAC navigation links")

    return await http.request(source, kind="catalog", params=params, validate=validate)


async def fetch_landsat_catalog(http, selection: LandsatSearch):
    """One page of USGS Collection 2 ST/SR metadata. Does not download or process bands."""
    return await _search_stac(http, "landsat_catalog", LandsatSearch.model_validate(selection))


async def fetch_sentinel_catalog(http, selection: SentinelSearch):
    """One page of Sentinel-2 metadata. Product level and extent come from Arjun."""
    return await _search_stac(http, "sentinel_catalog", SentinelSearch.model_validate(selection))
