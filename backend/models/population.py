from pydantic import AwareDatetime

from backend.models.area import Area
from backend.models.common import Identifier, Metadata, Number, Record
from backend.models.risk import Exposure


class GridPopulation(Record):
    grid_cell_id: Identifier
    timestamp: AwareDatetime
    population: Number | None = None


class PopulationResponse(Record):
    area: Area
    exposure: Exposure
    grid_population: list[GridPopulation]
    metadata: Metadata
