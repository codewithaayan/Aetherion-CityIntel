import json

from backend.cache import ReadCache
from backend.database.connection import Database
from backend.errors import APIError
from backend.models.area import Area, City
from backend.models.grid import EnvironmentalData, GridCell
from backend.models.risk import GridRisk
from backend.models.scenario import Scenario


class Queries:
    def __init__(self, database: Database, cache: ReadCache):
        self.database = database
        self.cache = cache

    async def rows(self, sql, *values):
        async def load():
            async with self.database.connection() as conn:
                records = [dict(row) for row in await conn.fetch(sql, *values)]
            for row in records:
                if isinstance(row.get("geometry"), str):
                    row["geometry"] = json.loads(row["geometry"])
            return records

        return await self.cache.read((sql, values), load)

    async def cities(self):
        rows = await self.rows(
            "SELECT id, name, country, ST_AsGeoJSON(geometry)::json AS geometry "
            "FROM cities ORDER BY id"
        )
        return [City.model_validate(row).model_dump(mode="json") for row in rows]

    async def city(self, city_id):
        rows = await self.rows(
            "SELECT id, name, country, ST_AsGeoJSON(geometry)::json AS geometry "
            "FROM cities WHERE id = $1", city_id
        )
        if not rows:
            raise APIError(404, "city_not_found", "That city is not in the database.")
        return City.model_validate(rows[0]).model_dump(mode="json")

    async def areas(self, city_id):
        await self.city(city_id)
        rows = await self.rows(
            "SELECT id, city_id, name, population, ST_AsGeoJSON(geometry)::json AS geometry "
            "FROM areas WHERE city_id = $1 ORDER BY id", city_id
        )
        return [Area.model_validate(row).model_dump(mode="json") for row in rows]

    async def area(self, area_id):
        rows = await self.rows(
            "SELECT id, city_id, name, population, ST_AsGeoJSON(geometry)::json AS geometry "
            "FROM areas WHERE id = $1", area_id
        )
        if not rows:
            raise APIError(404, "area_not_found", "That area is not in the database.")
        return Area.model_validate(rows[0]).model_dump(mode="json")

    async def grids(self, area_id):
        rows = await self.rows(
            "SELECT id, area_id, centroid_lat, centroid_lon, "
            "ST_AsGeoJSON(geometry)::json AS geometry "
            "FROM grid_cells WHERE area_id = $1 ORDER BY id", area_id
        )
        return [GridCell.model_validate(row).model_dump(mode="json") for row in rows]

    async def environmental(self, area_id):
        rows = await self.rows(
            "SELECT DISTINCT ON (e.grid_cell_id) e.* FROM environmental_data e "
            "JOIN grid_cells g ON g.id = e.grid_cell_id WHERE g.area_id = $1 "
            "ORDER BY e.grid_cell_id, e.timestamp DESC, e.id", area_id
        )
        return [EnvironmentalData.model_validate(row).model_dump(mode="json") for row in rows]

    async def risks(self, area_id):
        rows = await self.rows(
            "SELECT DISTINCT ON (r.grid_cell_id) r.* FROM risk_scores r "
            "JOIN grid_cells g ON g.id = r.grid_cell_id WHERE g.area_id = $1 "
            "ORDER BY r.grid_cell_id, r.timestamp DESC, r.id", area_id
        )
        return [GridRisk.model_validate(row).model_dump(mode="json") for row in rows]

    async def save_scenario(self, scenario: Scenario):
        async with self.database.connection() as conn:
            await conn.execute(
                "INSERT INTO scenarios (id, area_id, created_at, tree_change, "
                "drainage_change, cool_roof_change, traffic_change, projected_heat, "
                "projected_flood, projected_green, projected_overall) "
                "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
                scenario.id, scenario.area_id, scenario.created_at,
                scenario.tree_change, scenario.drainage_change,
                scenario.cool_roof_change, scenario.traffic_change,
                scenario.projected_heat, scenario.projected_flood,
                scenario.projected_green, scenario.projected_overall,
            )
