import type { Area, City } from "@/types/area";
import type { LayerName, MapFeature, MapLayer, PopulationResponse, RiskResponse } from "@/types/risk";

export interface ExtendedGridProperties {
  grid_cell_id: string;
  timestamp: string;
  score_timestamp: string;
  temperature: number;
  heat_score: number;
  ndvi: number;
  green_percentage: number;
  green_score: number;
  rainfall: number;
  elevation: number;
  slope: number;
  flood_score: number;
  population: number;
  vulnerability?: "Critical" | "High" | "Moderate" | "Low";
  hotspot_type?: "thermal" | "flood" | "canopy_deficit";
}

export const MOCK_CITY: City = {
  id: "karachi",
  name: "Karachi",
  country: "Pakistan",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [66.95, 24.78],
        [67.18, 24.78],
        [67.18, 24.96],
        [66.95, 24.96],
        [66.95, 24.78],
      ],
    ],
  },
};

interface AreaDefinition {
  id: string;
  name: string;
  population: number;
  bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  overall: number;
  heat: number;
  air: number;
  flood: number;
  green: number;
  mobility: number;
  highRiskPopulation: number;
  description: string;
}

const AREA_DEFS: AreaDefinition[] = [
  {
    id: "saddar",
    name: "Saddar Town",
    population: 465000,
    bbox: [67.005, 24.850, 67.035, 24.872],
    overall: 84,
    heat: 89,
    air: 78,
    flood: 64,
    green: 22,
    mobility: 71,
    highRiskPopulation: 142000,
    description: "High-density commercial core with intense Urban Heat Island anomaly, low vegetative cover, and heavy transit congestion.",
  },
  {
    id: "clifton",
    name: "Clifton & Cantonment",
    population: 320000,
    bbox: [67.015, 24.805, 67.055, 24.835],
    overall: 52,
    heat: 46,
    air: 42,
    flood: 79,
    green: 58,
    mobility: 48,
    highRiskPopulation: 58000,
    description: "Coastal residential and commercial district with marine breeze buffer, moderate vegetation, but elevated coastal storm surge and flood exposure.",
  },
  {
    id: "gulshan",
    name: "Gulshan-e-Iqbal",
    population: 680000,
    bbox: [67.070, 24.900, 67.115, 24.935],
    overall: 66,
    heat: 68,
    air: 64,
    flood: 58,
    green: 44,
    mobility: 62,
    highRiskPopulation: 98000,
    description: "Mixed residential, educational, and commercial zone with moderate canopy corridors, experiencing monsoon runoff accumulation in low-lying sectors.",
  },
  {
    id: "korangi",
    name: "Korangi Industrial",
    population: 540000,
    bbox: [67.110, 24.815, 67.165, 24.855],
    overall: 88,
    heat: 92,
    air: 89,
    flood: 71,
    green: 18,
    mobility: 74,
    highRiskPopulation: 175000,
    description: "Primary manufacturing and industrial cluster with extreme thermal emissions, minimal permeable surfaces, and dense worker settlements.",
  },
  {
    id: "lyari",
    name: "Lyari District",
    population: 610000,
    bbox: [66.980, 24.860, 67.010, 24.888],
    overall: 86,
    heat: 82,
    air: 85,
    flood: 88,
    green: 14,
    mobility: 69,
    highRiskPopulation: 198000,
    description: "Historical high-density urban quarter with narrow alleyways, severe tree canopy deficit, and heightened flash flood risk along the Lyari River basin.",
  },
];

export const MOCK_AREAS: Area[] = AREA_DEFS.map((def) => {
  const [minX, minY, maxX, maxY] = def.bbox;
  return {
    id: def.id,
    cityId: "karachi",
    name: def.name,
    population: def.population,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [minX, minY],
          [maxX, minY],
          [maxX, maxY],
          [minX, maxY],
          [minX, minY],
        ],
      ],
    },
  };
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateGridFeatures(def: AreaDefinition, _layerName: LayerName): MapFeature[] {
  const [minX, minY, maxX, maxY] = def.bbox;
  const rows = 4;
  const cols = 5;
  const stepX = (maxX - minX) / cols;
  const stepY = (maxY - minY) / rows;
  const features: MapFeature[] = [];

  let idx = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellMinX = minX + c * stepX;
      const cellMaxX = cellMinX + stepX;
      const cellMinY = minY + r * stepY;
      const cellMaxY = cellMinY + stepY;

      const posFactor = ((r * 1.3 + c * 0.9) % 3) / 3;
      const baseTemp = def.heat > 75 ? 39.5 : 34.0;
      const temp = Number((baseTemp + posFactor * 5.2 - (def.id === "clifton" ? 3.0 : 0)).toFixed(1));
      const heatScore = Math.min(99, Math.max(20, Math.round(def.heat + (posFactor - 0.5) * 22)));

      const baseNdvi = def.green > 40 ? 0.35 : 0.12;
      const ndvi = Number(Math.max(0.04, baseNdvi + (0.5 - posFactor) * 0.22).toFixed(2));
      const greenPct = Math.round(ndvi * 100 * 1.2);
      const greenScore = Math.min(99, Math.max(10, Math.round(def.green + (0.5 - posFactor) * 25)));

      const baseRain = 75;
      const rainfall = Number((baseRain + posFactor * 45).toFixed(1));
      const elevation = Number((12 + (rows - r) * 3 - c * 1.5).toFixed(1));
      const slope = Number((1.2 + posFactor * 2.1).toFixed(1));
      const floodScore = Math.min(99, Math.max(15, Math.round(def.flood + (posFactor - 0.4) * 24)));

      const cellPopulation = Math.round((def.population / (rows * cols)) * (0.8 + posFactor * 0.4));

      const properties: ExtendedGridProperties = {
        grid_cell_id: `KHI-${def.id.slice(0, 3).toUpperCase()}-${String(idx).padStart(3, "0")}`,
        timestamp: "2026-09-28T06:00:00Z",
        score_timestamp: "2026-09-28T06:00:00Z",
        temperature: temp,
        heat_score: heatScore,
        ndvi: ndvi,
        green_percentage: greenPct,
        green_score: greenScore,
        rainfall: rainfall,
        elevation: elevation,
        slope: slope,
        flood_score: floodScore,
        population: cellPopulation,
        vulnerability:
          heatScore > 82 || floodScore > 80
            ? "Critical"
            : heatScore > 65 || floodScore > 65
            ? "High"
            : "Moderate",
        hotspot_type:
          heatScore > 80
            ? "thermal"
            : floodScore > 80
            ? "flood"
            : greenScore < 25
            ? "canopy_deficit"
            : undefined,
      };

      features.push({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [cellMinX, cellMinY],
              [cellMaxX, cellMinY],
              [cellMaxX, cellMaxY],
              [cellMinX, cellMaxY],
              [cellMinX, cellMinY],
            ],
          ],
        },
        properties: properties as unknown as Record<string, unknown>,
      });

      idx++;
    }
  }

  return features;
}

export function getMockRisk(areaId: string): RiskResponse {
  const def = AREA_DEFS.find((d) => d.id === areaId) ?? AREA_DEFS[0];
  return {
    area: { id: def.id, name: def.name, city: "Karachi" },
    scores: {
      overall: def.overall,
      heat: def.heat,
      air: def.air,
      flood: def.flood,
      green: def.green,
      mobility: def.mobility,
      populationExposure: Math.round((def.highRiskPopulation / def.population) * 100),
    },
    exposure: {
      population: def.population,
      highRiskPopulation: def.highRiskPopulation,
    },
    metadata: {
      updated: "2026-09-28T06:00:00Z",
      dataSources: [
        "NASA Landsat 8/9 TIRS",
        "Copernicus Sentinel-2 MSI",
        "Open-Meteo Air Quality",
        "WorldPop High-Resolution 2026",
      ],
    },
  };
}

export function getMockPopulation(areaId: string): PopulationResponse {
  const def = AREA_DEFS.find((d) => d.id === areaId) ?? AREA_DEFS[0];
  const area = MOCK_AREAS.find((a) => a.id === areaId) ?? MOCK_AREAS[0];
  const gridCells = generateGridFeatures(def, "heat");

  return {
    area,
    exposure: {
      population: def.population,
      highRiskPopulation: def.highRiskPopulation,
    },
    gridPopulation: gridCells.map((f) => {
      const p = f.properties as unknown as ExtendedGridProperties;
      return {
        gridCellId: p.grid_cell_id,
        timestamp: p.timestamp,
        population: p.population,
      };
    }),
    metadata: {
      updated: "2026-09-28T06:00:00Z",
      dataSources: ["WorldPop 100m Gridded Dataset"],
    },
  };
}

export function getMockLayer(areaId: string, layerName: LayerName): MapLayer {
  const def = AREA_DEFS.find((d) => d.id === areaId) ?? AREA_DEFS[0];
  const features = generateGridFeatures(def, layerName);

  return {
    type: "FeatureCollection",
    features,
    metadata: {
      updated: "2026-09-28T06:00:00Z",
      dataSources: [
        layerName === "heat"
          ? "NASA Landsat-9 Band 10 / TIRS (Surface Temp)"
          : layerName === "green"
          ? "ESA Sentinel-2 B4/B8 (Normalized Difference Vegetation Index)"
          : "NASA GPM IMERG & SRTM Digital Elevation",
      ],
    },
    incompleteGridCellIds: [],
  };
}
