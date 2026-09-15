import json

from pydantic import Field

from backend.models.area import Area, City
from backend.models.common import Record
from backend.models.grid import EnvironmentalData, GridCell
from backend.models.risk import GridRisk


class ProcessedBatch(Record):
    """Arjun supplies processed records; this interface does no data preparation."""

    cities: list[City] = Field(default_factory=list)
    areas: list[Area] = Field(default_factory=list)
    grid_cells: list[GridCell] = Field(default_factory=list)
    environmental_data: list[EnvironmentalData] = Field(default_factory=list)
    risk_scores: list[GridRisk] = Field(default_factory=list)


# Identifiers in generated SQL come only from these backend-owned model fields.
TABLE_MODELS = {
    "cities": City,
    "areas": Area,
    "grid_cells": GridCell,
    "environmental_data": EnvironmentalData,
    "risk_scores": GridRisk,
}


async def import_processed(database, batch: ProcessedBatch | dict, cache=None):
    """Upsert a whole validated batch atomically. IDs must be stable between runs."""
    batch = ProcessedBatch.model_validate(batch)
    async with database.connection() as conn:
        async with conn.transaction():
            for table, model in TABLE_MODELS.items():
                columns = list(model.model_fields)
                parameters = [
                    f"ST_SetSRID(ST_GeomFromGeoJSON(${i}), 4326)"
                    if name == "geometry" else f"${i}"
                    for i, name in enumerate(columns, start=1)
                ]
                updates = ", ".join(
                    f"{name} = EXCLUDED.{name}" for name in columns if name != "id"
                )
                sql = (
                    f"INSERT INTO {table} ({', '.join(columns)}) "
                    f"VALUES ({', '.join(parameters)}) "
                    f"ON CONFLICT (id) DO UPDATE SET {updates}"
                )
                values = []
                for record in getattr(batch, table):
                    row = record.model_dump()
                    if row.get("geometry") is not None:
                        row["geometry"] = json.dumps(row["geometry"], allow_nan=False)
                    values.append([row[name] for name in columns])
                if values:
                    await conn.executemany(sql, values)
    if cache is not None:
        cache.clear()
