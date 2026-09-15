from typing import Literal

from geojson_pydantic import Feature
from pydantic import Field

from backend.models.common import Metadata, Record


class MapLayer(Record):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: list[Feature]
    metadata: Metadata = Field(default_factory=Metadata)
    incomplete_grid_cell_ids: list[str] = Field(default_factory=list)
