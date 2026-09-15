import re

from backend.services.source_requests import OverpassRequest


async def fetch_overpass(http, selection: OverpassRequest):
    """Send Arjun's Overpass QL statements; return OSM JSON without deriving features."""
    selection = OverpassRequest.model_validate(selection)
    statements = selection.statements
    if "{{" in statements or re.search(r"\[\s*(out|timeout|maxsize)\s*:", statements, re.I):
        raise ValueError("Supply plain Overpass QL statements; transport settings are added by Abd's client.")
    # These limit server work, not spatial resolution or scientific interpretation.
    seconds = min(20, max(1, int(http.settings.external_timeout_seconds) - 1))
    query = f"[out:json][timeout:{seconds}][maxsize:16777216];\n{statements}"

    def validate(payload):
        # Overpass can return HTTP 200 with partial elements and a runtime remark.
        if "remark" in payload or not isinstance(payload.get("elements"), list):
            raise ValueError("Incomplete Overpass response")

    return await http.request("overpass", kind="data", form={"data": query}, validate=validate)
