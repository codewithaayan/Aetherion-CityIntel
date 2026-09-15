from fastapi import APIRouter, Request

from backend.api.dependencies import AreaId, Repository
from backend.errors import unavailable
from backend.integrations import call_component
from backend.models.risk import RiskResponse, RiskResult
from backend.services.air_quality import air_quality_data
from backend.services.population import population_data
from backend.services.satellite import satellite_data
from backend.services.weather import weather_data

router = APIRouter(prefix="/api/areas", tags=["Risk"])


async def area_context(queries, area):
    grids = await queries.grids(area["id"])
    environmental = await queries.environmental(area["id"])
    risks = await queries.risks(area["id"])
    if not grids or not (environmental or risks):
        raise unavailable("risk_data_unavailable", "Prepared grid measurements or scores are missing.")
    return {
        "area": area,
        "grid_cells": grids,
        "environmental_data": environmental,
        "risk_scores": risks,
        "weather": weather_data(environmental),
        "air_quality": air_quality_data(environmental),
        "satellite": satellite_data(environmental),
        "population": population_data(environmental),
    }


async def structured_risk(area_id, queries, request):
    area = await queries.area(area_id)
    provider = request.app.state.components.risk
    if provider is None:
        raise unavailable("risk_not_configured", "Chip's area risk calculation adapter is not connected.")
    context = await area_context(queries, area)
    result = await call_component(
        provider, context,
        timeout=request.app.state.settings.provider_timeout_seconds,
        output_model=RiskResult,
    )
    city = await queries.city(area["city_id"])
    return {
        "area": {"id": area["id"], "name": area["name"], "city": city["name"]},
        **result,
    }


@router.get("/{area_id}/risk", response_model=RiskResponse)
async def risk(area_id: AreaId, queries: Repository, request: Request):
    return await structured_risk(area_id, queries, request)
