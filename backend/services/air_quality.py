from backend.services import select_measurements
from backend.services.source_requests import AirQualityRequest


def air_quality_data(records):
    """Pass through Arjun's PM values. Source, units and regional limits stay his contract."""
    return select_measurements(records, ("pm25", "pm10"))


async def fetch_air_quality(http, selection: AirQualityRequest):
    """Fetch selected CAMS/Open-Meteo values unchanged for Arjun's pipeline."""
    selection = AirQualityRequest.model_validate(selection)
    params = selection.model_dump(mode="json")
    params["hourly"] = ",".join(selection.hourly)
    params["timezone"] = "GMT"

    def validate(payload):
        hourly = payload.get("hourly")
        units = payload.get("hourly_units")
        if not isinstance(hourly, dict) or not isinstance(units, dict):
            raise ValueError("Missing hourly data or units")
        times = hourly.get("time")
        if not isinstance(times, list) or not all(isinstance(time, str) for time in times):
            raise ValueError("Missing hourly times")
        for variable in selection.hourly:
            values = hourly.get(variable)
            if not isinstance(values, list) or len(values) != len(times) or variable not in units:
                raise ValueError("Incomplete hourly variable")
            if any(value is not None and (isinstance(value, bool) or not isinstance(value, (int, float)))
                   for value in values):
                raise ValueError("Unexpected measurement type")

    return await http.request("open_meteo_air_quality", kind="data", params=params, validate=validate)
