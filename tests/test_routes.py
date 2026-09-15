import asyncio
from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient

from backend.main import create_app


EXPECTED_ROUTES = {
    "/api/cities": "get", "/api/cities/{city_id}/areas": "get",
    "/api/areas/{area_id}": "get", "/api/areas/{area_id}/risk": "get",
    "/api/areas/{area_id}/layers/heat": "get", "/api/areas/{area_id}/layers/green": "get",
    "/api/areas/{area_id}/layers/flood": "get", "/api/areas/{area_id}/population": "get",
    "/api/areas/{area_id}/simulate": "post", "/api/areas/{area_id}/ai-analysis": "post",
}


def test_exact_api_routes(client):
    paths = client.get("/openapi.json").json()["paths"]
    assert set(paths) == set(EXPECTED_ROUTES)
    for path, method in EXPECTED_ROUTES.items():
        assert set(paths[path]) == {method}


@pytest.mark.parametrize("path,method", EXPECTED_ROUTES.items())
def test_unconfigured_database_is_honest(settings, path, method):
    path = path.replace("{city_id}", "test-city").replace("{area_id}", "test-area")
    with TestClient(create_app(settings)) as client:
        response = client.request(method, path, **({"json": {}} if method == "post" else {}))
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "database_not_configured"


def test_city_and_area_selection(client):
    assert client.get("/api/cities").json()[0]["name"] == "Synthetic city"
    assert client.get("/api/cities/test-city/areas").json()[0]["id"] == "test-area"
    assert client.get("/api/areas/test-area").json()["population"] == 10.0
    assert client.get("/api/cities/missing/areas").status_code == 404


def test_empty_catalogs_are_empty_lists(client, queries):
    queries.area_rows = []
    assert client.get("/api/cities/test-city/areas").json() == []
    queries.city_rows = []
    assert client.get("/api/cities").json() == []


@pytest.mark.parametrize("suffix,method", [
    ("", "get"), ("/risk", "get"), ("/layers/heat", "get"), ("/layers/green", "get"),
    ("/layers/flood", "get"), ("/population", "get"), ("/simulate", "post"), ("/ai-analysis", "post"),
])
def test_missing_area(client, suffix, method):
    response = client.request(method, "/api/areas/missing" + suffix, **({"json": {}} if method == "post" else {}))
    assert response.status_code == 404


@pytest.mark.parametrize("layer,value", [("heat", "temperature"), ("green", "ndvi"), ("flood", "rainfall")])
def test_map_serves_supplied_geometry_and_zero_values(client, layer, value):
    response = client.get(f"/api/areas/test-area/layers/{layer}")
    assert response.status_code == 200
    layer = response.json()
    assert layer["type"] == "FeatureCollection"
    assert layer["features"][0]["geometry"]["type"] == "Polygon"
    assert layer["features"][0]["properties"][value] == 0.0
    assert layer["features"][0]["properties"]["timestamp"].startswith("2026-01-01")
    assert layer["metadata"] == {"updated": None, "data_sources": None}


@pytest.mark.parametrize("layer", ["heat", "green", "flood"])
def test_empty_map_data_is_unavailable(client, queries, layer):
    queries.environment_rows = []
    queries.risk_rows = []
    response = client.get(f"/api/areas/test-area/layers/{layer}")
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "layer_unavailable"


def test_map_does_not_backfill_missing_scores_or_geometry(client, queries):
    queries.risk_rows = []
    queries.grid_rows[0]["geometry"] = None
    response = client.get("/api/areas/test-area/layers/flood").json()
    assert response["features"][0]["geometry"] is None
    assert response["features"][0]["properties"]["flood_score"] is None
    assert response["incomplete_grid_cell_ids"] == ["test-grid"]


def test_population_is_not_summed_or_turned_into_exposure(client):
    result = client.get("/api/areas/test-area/population").json()
    assert result["exposure"] == {"population": 10.0, "high_risk_population": None}
    assert result["grid_population"][0]["population"] == 0.0


def test_population_route_has_a_documented_response_schema(client):
    operation = client.get("/openapi.json").json()["paths"][
        "/api/areas/{area_id}/population"
    ]["get"]
    schema = operation["responses"]["200"]["content"]["application/json"]["schema"]
    assert schema == {"$ref": "#/components/schemas/PopulationResponse"}


def test_missing_population_remains_missing(client, queries):
    queries.area_rows[0]["population"] = None
    queries.environment_rows = []
    assert client.get("/api/areas/test-area/population").status_code == 503


def test_population_zero_is_present(client, queries):
    queries.area_rows[0]["population"] = 0.0
    queries.environment_rows = []
    response = client.get("/api/areas/test-area/population")
    assert response.status_code == 200
    assert response.json()["exposure"]["population"] == 0.0


def test_risk_requires_chips_adapter(client):
    response = client.get("/api/areas/test-area/risk")
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "risk_not_configured"


def test_supplied_risk_is_served_without_calculating(client, components, risk_output):
    components.risk = AsyncMock(return_value=risk_output)
    response = client.get("/api/areas/test-area/risk")
    assert response.status_code == 200
    assert response.json()["scores"]["heat"] == 0.0
    assert response.json()["scores"]["population_exposure"] == 0.0
    assert response.json()["scores"]["overall"] is None
    context = components.risk.call_args.args[0]
    assert context["air_quality"][0]["pm25"] is None
    assert context["environmental_data"][0]["temperature"] == 0.0


def test_risk_does_not_call_provider_without_data(client, queries, components):
    queries.environment_rows = []
    queries.risk_rows = []
    components.risk = AsyncMock()
    assert client.get("/api/areas/test-area/risk").status_code == 503
    components.risk.assert_not_called()


@pytest.mark.parametrize("bad_output", [
    "Made up explanation", {}, {"scores": {}, "exposure": {}, "metadata": {}},
    {"scores": {"heat": float("nan")}, "exposure": {}, "metadata": {}},
    {"scores": {"heat": True}, "exposure": {}, "metadata": {}},
    {"scores": {"heat": "72"}, "exposure": {}, "metadata": {}},
])
def test_bad_risk_output_is_rejected(client, components, bad_output):
    components.risk = AsyncMock(return_value=bad_output)
    response = client.get("/api/areas/test-area/risk")
    assert response.status_code == 502


def test_provider_timeout(client, components):
    async def slow(context):
        await asyncio.sleep(10)
    components.risk = slow
    assert client.get("/api/areas/test-area/risk").status_code == 504


def test_provider_error_is_redacted(client, components):
    components.risk = AsyncMock(side_effect=RuntimeError("secret-api-key"))
    response = client.get("/api/areas/test-area/risk")
    assert response.status_code == 502
    assert "secret-api-key" not in response.text
