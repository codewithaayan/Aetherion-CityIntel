import { RiskScores, HistoricalTrendPoint, ExposureBreakdown } from "./risk";

export interface KeyInsight {
  id: string;
  title: string;
  description: string;
  category: "heat" | "green" | "population" | "flood" | "air";
  severity: "critical" | "warning" | "info";
  metricBadge: string;
}

export interface Area {
  id: string;
  name: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  population: number;
  highRiskPopulation: number;
  exposedPercentage: number;
  areaKm2: number;
  densityPerKm2: number;
  lastUpdated: string;
  dataConfidence: number; // e.g. 94
  satellitePassDate: string;
  scores: RiskScores;
  summary: string;
  keyInsights: KeyInsight[];
  historicalTrends: HistoricalTrendPoint[];
  exposureDistribution: ExposureBreakdown[];
}
