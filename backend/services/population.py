from backend.services import select_measurements
from backend.services.source_requests import WorldPopSearch


def population_data(records):
    """Population values are passed through; exposure calculations belong to Chip."""
    return select_measurements(records, ("population",))


def validate_worldpop(payload):
    if not isinstance(payload.get("data"), list):
        raise ValueError("Expected WorldPop catalog data")


async def fetch_worldpop_datasets(http):
    """List population dataset aliases without choosing an estimation method/year."""
    return await http.request("worldpop_catalog", kind="catalog", validate=validate_worldpop)


async def fetch_worldpop_catalog(http, selection: WorldPopSearch):
    """Return dataset metadata and supplied file links, not calculated population."""
    selection = WorldPopSearch.model_validate(selection)
    params = {"iso3": selection.iso3} if selection.iso3 else {}
    return await http.request("worldpop_catalog", kind="catalog", path_suffix=selection.dataset,
                              params=params, validate=validate_worldpop)
