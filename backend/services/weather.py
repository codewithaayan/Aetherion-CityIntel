from backend.services import select_measurements

# IMERG/SRTM catalog connections live in earthdata.py. Their files need an agreed
# product/version and access method before Abd adds downloads. ERA5 is optional.
# Do not substitute Open-Meteo's general weather API: only its air API is listed.


def weather_data(records):
    """Arjun's processed weather/terrain inputs; no source requests or formulas."""
    return select_measurements(records, ("temperature", "rainfall", "elevation", "slope"))
