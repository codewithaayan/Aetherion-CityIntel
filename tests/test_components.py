from unittest.mock import AsyncMock

import pytest
from pydantic import Field

from backend.errors import unavailable
from backend.integrations import JSONComponent
from backend.models.common import Number, Record
from backend.models.scenario import ScenarioValues


class SyntheticRequest(Record):
    # Test-only units/ranges, not a proposed simulator contract.
    fixture_change: Number = Field(ge=-1, le=1)


class SyntheticSimulation(Record):
    scenario: ScenarioValues
    fixture_note: str


class SyntheticAIRequest(Record):
    pass


class SyntheticAIResponse(Record):
    fixture_note: str


@pytest.fixture
def scenario_values():
    return dict(tree_change=0.0, drainage_change=None, cool_roof_change=None, traffic_change=None,
                projected_heat=0.0, projected_flood=None, projected_green=None, projected_overall=None)


def test_simulator_calls_owner_then_persists(client, components, queries, scenario_values):
    run = AsyncMock(return_value={"scenario": scenario_values, "fixture_note": "synthetic only"})
    components.simulator = JSONComponent(SyntheticRequest, SyntheticSimulation, run)
    response = client.post("/api/areas/test-area/simulate", json={"fixture_change": 0.0})
    assert response.status_code == 201
    body = response.json()
    assert body["label"] == "modelled scenario"
    assert len(queries.saved) == 1
    assert body["scenario"]["id"] == queries.saved[0].id
    assert queries.saved[0].area_id == "test-area"
    assert queries.saved[0].projected_heat == 0.0
    assert run.call_args.args[0] == {"fixture_change": 0.0}
    assert run.call_args.args[1]["area"]["id"] == "test-area"


@pytest.mark.parametrize("payload", [{}, {"fixture_change": 2.0}, {"fixture_change": "0"},
                                       {"fixture_change": True}, {"fixture_change": 0.0, "extra": "secret"}])
def test_simulator_uses_owner_validation(client, components, queries, payload):
    run = AsyncMock()
    components.simulator = JSONComponent(SyntheticRequest, SyntheticSimulation, run)
    response = client.post("/api/areas/test-area/simulate", json=payload)
    assert response.status_code == 422
    assert "secret" not in response.text
    run.assert_not_called()
    assert queries.saved == []


def test_invalid_simulation_is_not_saved(client, components, queries, scenario_values):
    scenario_values["projected_heat"] = None
    components.simulator = JSONComponent(SyntheticRequest, SyntheticSimulation,
        AsyncMock(return_value={"scenario": scenario_values, "fixture_note": "synthetic only"}))
    response = client.post("/api/areas/test-area/simulate", json={"fixture_change": 0.0})
    assert response.status_code == 502
    assert queries.saved == []


def test_scenario_write_failure_is_not_success(client, components, queries, scenario_values):
    components.simulator = JSONComponent(SyntheticRequest, SyntheticSimulation,
        AsyncMock(return_value={"scenario": scenario_values, "fixture_note": "synthetic only"}))
    queries.save_scenario = AsyncMock(side_effect=unavailable("database_unavailable", "Database unavailable."))
    assert client.post("/api/areas/test-area/simulate", json={"fixture_change": 0.0}).status_code == 503


def test_ai_receives_validated_structured_risk(client, components, risk_output):
    components.risk = AsyncMock(return_value=risk_output)
    run = AsyncMock(return_value={"fixture_note": "synthetic analysis fixture"})
    components.ai = JSONComponent(SyntheticAIRequest, SyntheticAIResponse, run)
    response = client.post("/api/areas/test-area/ai-analysis", json={})
    assert response.status_code == 200
    assert run.call_args.args[0] == {}
    assert run.call_args.args[1] == response.json()["risk"]
    assert response.json()["analysis"] == {"fixture_note": "synthetic analysis fixture"}


def test_ai_requires_risk_before_calling_provider(client, components):
    run = AsyncMock()
    components.ai = JSONComponent(SyntheticAIRequest, SyntheticAIResponse, run)
    assert client.post("/api/areas/test-area/ai-analysis", json={}).status_code == 503
    run.assert_not_called()


@pytest.mark.parametrize("output", ["unstructured text", {"unknown": "secret"}, {"fixture_note": 12}])
def test_ai_output_schema_is_enforced(client, components, risk_output, output):
    components.risk = AsyncMock(return_value=risk_output)
    components.ai = JSONComponent(SyntheticAIRequest, SyntheticAIResponse, AsyncMock(return_value=output))
    response = client.post("/api/areas/test-area/ai-analysis", json={})
    assert response.status_code == 502
    assert "secret" not in response.text


def test_supplied_geojson_is_served(client, components):
    payload = {"type": "FeatureCollection", "features": [
        {"type": "Feature", "geometry": {"type": "Point", "coordinates": [0, 0]},
         "properties": {"fixture_value": 0, "source": "synthetic"}}
    ]}
    components.layers = AsyncMock(return_value=payload)
    response = client.get("/api/areas/test-area/layers/heat")
    assert response.status_code == 200
    assert response.json()["features"] == payload["features"]
    components.layers.assert_awaited_once_with("test-area", "heat")


@pytest.mark.parametrize("payload,status", [
    ({"type": "FeatureCollection", "features": []}, 503),
    ({"type": "FeatureCollection", "features": [{"type": "Feature", "geometry": {"type": "fake"}, "properties": {}}]}, 502),
])
def test_missing_or_invalid_supplied_map(client, components, payload, status):
    components.layers = AsyncMock(return_value=payload)
    assert client.get("/api/areas/test-area/layers/heat").status_code == status
