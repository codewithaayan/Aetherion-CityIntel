from fastapi import APIRouter

from backend.api.dependencies import AreaId, CityId, Repository
from backend.errors import unavailable
from backend.models.area import Area, City
from backend.models.population import PopulationResponse
from backend.services.population import population_data

router = APIRouter(prefix="/api", tags=["Areas"])


@router.get("/cities", response_model=list[City])
async def cities(queries: Repository):
    return await queries.cities()


@router.get("/cities/{city_id}/areas", response_model=list[Area])
async def areas(city_id: CityId, queries: Repository):
    return await queries.areas(city_id)


@router.get("/areas/{area_id}", response_model=Area)
async def area(area_id: AreaId, queries: Repository):
    return await queries.area(area_id)


@router.get("/areas/{area_id}/population", response_model=PopulationResponse)
async def population(area_id: AreaId, queries: Repository):
    area = await queries.area(area_id)
    cells = population_data(await queries.environmental(area_id))
    if area["population"] is None and not any(row["population"] is not None for row in cells):
        raise unavailable("population_unavailable", "No population values have been supplied for this area.")
    return {
        "area": area,
        "exposure": {"population": area["population"], "high_risk_population": None},
        "grid_population": cells,
        "metadata": {"updated": None, "data_sources": None},
    }
