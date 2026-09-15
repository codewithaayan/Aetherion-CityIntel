from backend.models.common import Identifier, Number, Record
from backend.models.geometry import StoredGeometry


class City(Record):
    id: Identifier
    name: str
    country: str
    geometry: StoredGeometry | None = None


class Area(Record):
    id: Identifier
    city_id: Identifier
    name: str
    geometry: StoredGeometry | None = None
    population: Number | None = None


class AreaReference(Record):
    id: Identifier
    name: str
    city: str
