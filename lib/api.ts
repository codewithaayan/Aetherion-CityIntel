import type { Area, City, GeoJSONGeometry } from "@/types/area";
import type { GridPopulation, LayerName, MapLayer, PopulationResponse, RiskResponse, RiskScores, SourceMetadata } from "@/types/risk";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

type RawCity = { id: string; name: string; country: string; geometry: GeoJSONGeometry | null };
type RawArea = { id: string; city_id: string; name: string; geometry: GeoJSONGeometry | null; population: number | null };
type RawMetadata = { updated: string | null; data_sources: string[] | null };
type RawRisk = {
  area: { id: string; name: string; city: string };
  scores: Omit<RiskScores, "populationExposure"> & { population_exposure: number | null };
  exposure: { population: number | null; high_risk_population: number | null };
  metadata: RawMetadata;
};
type RawPopulation = {
  area: RawArea;
  exposure: { population: number | null; high_risk_population: number | null };
  grid_population: Array<{ grid_cell_id: string; timestamp: string; population: number | null }>;
  metadata: RawMetadata;
};
type RawLayer = { type: "FeatureCollection"; features: MapLayer["features"]; metadata: RawMetadata; incomplete_grid_cell_ids: string[] };

export class ApiError extends Error {
  constructor(message: string, public status: number, public code: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!response.ok) {
    let code = "request_failed";
    let message = `The data service returned ${response.status}.`;
    try {
      const body = (await response.json()) as { error?: { code?: string; message?: string } };
      code = body.error?.code ?? code;
      message = body.error?.message ?? message;
    } catch {
      // Keep the safe fallback when the server does not return JSON.
    }
    throw new ApiError(message, response.status, code);
  }
  return response.json() as Promise<T>;
}

const mapArea = (area: RawArea): Area => ({ id: area.id, cityId: area.city_id, name: area.name, geometry: area.geometry, population: area.population });
const mapMetadata = (metadata: RawMetadata): SourceMetadata => ({ updated: metadata.updated, dataSources: metadata.data_sources });

export async function getCities(): Promise<City[]> {
  return request<RawCity[]>("/api/cities");
}

export async function getAreas(cityId: string): Promise<Area[]> {
  return (await request<RawArea[]>(`/api/cities/${encodeURIComponent(cityId)}/areas`)).map(mapArea);
}

export async function getArea(areaId: string): Promise<Area> {
  return mapArea(await request<RawArea>(`/api/areas/${encodeURIComponent(areaId)}`));
}

export async function getRisk(areaId: string): Promise<RiskResponse> {
  const raw = await request<RawRisk>(`/api/areas/${encodeURIComponent(areaId)}/risk`);
  const { population_exposure, ...scores } = raw.scores;
  return {
    area: raw.area,
    scores: { ...scores, populationExposure: population_exposure },
    exposure: { population: raw.exposure.population, highRiskPopulation: raw.exposure.high_risk_population },
    metadata: mapMetadata(raw.metadata),
  };
}

export async function getPopulation(areaId: string): Promise<PopulationResponse> {
  const raw = await request<RawPopulation>(`/api/areas/${encodeURIComponent(areaId)}/population`);
  const gridPopulation: GridPopulation[] = raw.grid_population.map((row) => ({ gridCellId: row.grid_cell_id, timestamp: row.timestamp, population: row.population }));
  return {
    area: mapArea(raw.area),
    exposure: { population: raw.exposure.population, highRiskPopulation: raw.exposure.high_risk_population },
    gridPopulation,
    metadata: mapMetadata(raw.metadata),
  };
}

export async function getLayer(areaId: string, layer: LayerName): Promise<MapLayer> {
  const raw = await request<RawLayer>(`/api/areas/${encodeURIComponent(areaId)}/layers/${layer}`);
  return { type: raw.type, features: raw.features, metadata: mapMetadata(raw.metadata), incompleteGridCellIds: raw.incomplete_grid_cell_ids };
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "The backend could not be reached. Check that it is running and the API URL is correct.";
}
