import pytest
from pydantic import ValidationError

from backend.models.area import Area


@pytest.mark.parametrize("coordinates", [[181, 0], [0, 91], [float("nan"), 0], [True, 0], ["0", 0], [0, 0, 0], []])
def test_stored_geometry_rejects_unusable_coordinates(coordinates):
    with pytest.raises(ValidationError):
        Area(id="test", city_id="test", name="synthetic", geometry={"type": "Point", "coordinates": coordinates})


def test_legacy_crs_is_not_silently_relabelled():
    with pytest.raises(ValidationError):
        Area(id="test", city_id="test", name="synthetic",
             geometry={"type": "Point", "coordinates": [0, 0], "crs": {"type": "name", "properties": {"name": "EPSG:3857"}}})
