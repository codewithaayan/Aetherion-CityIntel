import math
from typing import Annotated

from geojson_pydantic.geometries import Geometry
from pydantic import BeforeValidator


def check_coordinates(coordinates):
    if not isinstance(coordinates, (list, tuple)) or not coordinates:
        raise ValueError("Supply nonempty coordinate arrays.")
    if isinstance(coordinates[0], (list, tuple)):
        for item in coordinates:
            check_coordinates(item)
        return
    if len(coordinates) != 2:
        raise ValueError("The current database geometry contract is two-dimensional.")
    if any(isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value)
           for value in coordinates):
        raise ValueError("Coordinates must be finite numbers.")
    longitude, latitude = coordinates
    if not -180 <= longitude <= 180 or not -90 <= latitude <= 90:
        raise ValueError("Supply WGS84 longitude/latitude; coordinate alignment belongs to the data owner.")


def check_geometry(value):
    if hasattr(value, "model_dump"):
        value = value.model_dump(mode="json")
    if not isinstance(value, dict):
        raise ValueError("Supply a GeoJSON geometry object.")
    if "crs" in value:
        raise ValueError("Legacy CRS declarations are unsupported; supply WGS84 GeoJSON.")
    if value.get("type") == "GeometryCollection":
        for geometry in value.get("geometries", []):
            check_geometry(geometry)
    else:
        check_coordinates(value.get("coordinates"))
    return value


StoredGeometry = Annotated[Geometry, BeforeValidator(check_geometry)]
