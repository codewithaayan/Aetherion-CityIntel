"""Raw access to the two team-approved Karachi EO4SD-Urban datasets."""

from datetime import datetime, timezone
from pathlib import Path
from zipfile import is_zipfile

from backend.services.external import FILE_ENDPOINTS, RawFile
from backend.services.source_requests import KarachiCatalogRequest, KarachiFileRequest


DATASET_IDS = {
    "land_use_land_cover": "karachi-pakistan-land-use-land-cover-esa-eo4sd-urban",
    "informal_settlements": "karachi-pakistan-informal-settlements-esa-eo4sd-urban",
}

FILE_SOURCES = {
    "lulc_peri_2005": "karachi_lulc_peri_2005",
    "lulc_peri_2017": "karachi_lulc_peri_2017",
    "lulc_core_2005": "karachi_lulc_core_2005",
    "lulc_core_2017": "karachi_lulc_core_2017",
    "informal_2005": "karachi_informal_2005",
    "informal_2017": "karachi_informal_2017",
}


def _validate_catalog(payload):
    result = payload.get("result")
    if payload.get("success") is not True or not isinstance(result, dict):
        raise ValueError("Expected a successful CKAN package response")
    if not isinstance(result.get("resources"), list):
        raise ValueError("Expected CKAN dataset resources")


def _validate_zip(path):
    if not is_zipfile(path):
        raise ValueError("Expected a ZIP archive")


async def fetch_karachi_catalog(http, selection: KarachiCatalogRequest):
    """Return current EnergyData metadata and resource links unchanged."""
    selection = KarachiCatalogRequest.model_validate(selection)
    dataset_id = DATASET_IDS[selection.dataset]

    def validate(payload):
        _validate_catalog(payload)
        if payload["result"].get("name") != dataset_id:
            raise ValueError("EnergyData returned a different dataset")

    return await http.request(
        "karachi_eo4sd_catalog",
        kind="catalog",
        params={"id": dataset_id},
        validate=validate,
    )


async def download_karachi_file(http, selection: KarachiFileRequest, directory):
    """Download one published ZIP to a caller-supplied directory without extracting it."""
    selection = KarachiFileRequest.model_validate(selection)
    source = FILE_SOURCES[selection.resource]
    filename = Path(FILE_ENDPOINTS[source]).name
    return await http.download(source, Path(directory) / filename, validate=_validate_zip)


def load_karachi_file(selection: KarachiFileRequest, path, *, max_bytes: int):
    """Validate a local published ZIP and expose its path to the processing pipeline."""
    selection = KarachiFileRequest.model_validate(selection)
    source = FILE_SOURCES[selection.resource]
    expected_name = Path(FILE_ENDPOINTS[source]).name
    path = Path(path).resolve(strict=True)
    if not path.is_file():
        raise ValueError("The Karachi dataset path must be a regular file.")
    if path.name != expected_name:
        raise ValueError(f"Expected the published filename {expected_name}.")
    byte_length = path.stat().st_size
    if byte_length == 0 or byte_length > max_bytes:
        raise ValueError("The Karachi dataset file is empty or exceeds the configured byte limit.")
    _validate_zip(path)
    return RawFile(
        source=source,
        kind="file",
        endpoint=FILE_ENDPOINTS[source],
        path=path,
        byte_length=byte_length,
        observed_at=datetime.now(timezone.utc),
        headers={},
        origin="local",
    )
