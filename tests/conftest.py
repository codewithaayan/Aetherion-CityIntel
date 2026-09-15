"""All records in this test suite are synthetic and are never loaded by the app."""

from copy import deepcopy
from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient

from backend.api.dependencies import get_queries
from backend.config.settings import Settings
from backend.errors import APIError
from backend.integrations import Components
from backend.main import create_app
from backend.models.grid import EnvironmentalData
from backend.models.risk import GridRisk

SYNTHETIC_TIME = datetime(2026, 1, 1, tzinfo=timezone.utc)
SYNTHETIC_GEOMETRY = {"type": "Polygon", "coordinates": [[[0, 0], [1, 0], [1, 1], [0, 0]]]}


class SyntheticQueries:
    def __init__(self):
        self.city_rows = [{"id": "test-city", "name": "Synthetic city", "country": "Synthetic", "geometry": None}]
        self.area_rows = [{"id": "test-area", "city_id": "test-city", "name": "Synthetic area",
                           "geometry": SYNTHETIC_GEOMETRY, "population": 10.0}]
        self.grid_rows = [{"id": "test-grid", "area_id": "test-area", "geometry": SYNTHETIC_GEOMETRY,
                           "centroid_lat": None, "centroid_lon": None}]
        self.environment_rows = [EnvironmentalData(
            id="test-environment", grid_cell_id="test-grid", timestamp=SYNTHETIC_TIME,
            temperature=0.0, ndvi=0.0, green_percentage=0.0, rainfall=0.0,
            elevation=0.0, slope=0.0, population=0.0,
        ).model_dump(mode="json")]
        self.risk_rows = [GridRisk(
            id="test-risk", grid_cell_id="test-grid", timestamp=SYNTHETIC_TIME,
            heat_score=0.0, green_score=0.0, flood_score=0.0,
        ).model_dump(mode="json")]
        self.saved = []

    async def cities(self):
        return deepcopy(self.city_rows)

    async def city(self, city_id):
        for row in self.city_rows:
            if row["id"] == city_id:
                return deepcopy(row)
        raise APIError(404, "city_not_found", "Synthetic city missing.")

    async def areas(self, city_id):
        await self.city(city_id)
        return deepcopy([row for row in self.area_rows if row["city_id"] == city_id])

    async def area(self, area_id):
        for row in self.area_rows:
            if row["id"] == area_id:
                return deepcopy(row)
        raise APIError(404, "area_not_found", "Synthetic area missing.")

    async def grids(self, area_id):
        return deepcopy(self.grid_rows)

    async def environmental(self, area_id):
        return deepcopy(self.environment_rows)

    async def risks(self, area_id):
        return deepcopy(self.risk_rows)

    async def save_scenario(self, scenario):
        self.saved.append(scenario)


@pytest.fixture
def queries():
    return SyntheticQueries()


@pytest.fixture
def components():
    return Components()


@pytest.fixture
def settings():
    return Settings(_env_file=None, database_url=None, allowed_hosts=["testserver", "localhost"],
                    provider_timeout_seconds=0.05, max_request_bytes=1024)


@pytest.fixture
def app(settings, queries, components):
    app = create_app(settings, components)
    app.dependency_overrides[get_queries] = lambda: queries
    return app


@pytest.fixture
def client(app):
    with TestClient(app) as client:
        yield client


@pytest.fixture
def risk_output():
    return {"scores": {"heat": 0.0, "population_exposure": 0.0},
            "exposure": {"population": 10.0},
            "metadata": {"updated": SYNTHETIC_TIME.isoformat(), "data_sources": ["synthetic fixture"]}}
