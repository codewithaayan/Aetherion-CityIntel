from backend.services.source_requests import EarthdataCollectionSearch, EarthdataGranuleSearch


def validate_cmr(payload):
    feed = payload.get("feed")
    if not isinstance(feed, dict) or not isinstance(feed.get("entry"), list):
        raise ValueError("Expected CMR catalog entries")


async def fetch_earthdata_collections(http, selection: EarthdataCollectionSearch):
    """Public CMR metadata for an owner-selected IMERG/SRTM short name."""
    selection = EarthdataCollectionSearch.model_validate(selection)
    return await http.request("earthdata_collections", kind="catalog",
                              params=selection.model_dump(), validate=validate_cmr)


async def fetch_earthdata_granules(http, selection: EarthdataGranuleSearch):
    """One granule metadata page. Files and authenticated downloads remain separate."""
    selection = EarthdataGranuleSearch.model_validate(selection)
    params = {
        "short_name": selection.short_name,
        "version": selection.version,
        "bounding_box": ",".join(str(value) for value in selection.bbox),
        "temporal": f"{selection.start.isoformat()},{selection.end.isoformat()}",
        "page_size": selection.limit,
        "page_num": selection.page_num,
    }
    return await http.request("earthdata_granules", kind="catalog", params=params, validate=validate_cmr)
