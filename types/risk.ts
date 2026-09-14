export interface RiskScores {
  heat: number;
  air: number;
  flood: number;
  green: number;
  mobility: number;
  populationExposure: number;
  overall: number;
}

export interface RiskDimension {
  id: keyof RiskScores;
  name: string;
  score: number;
  level: "LOW" | "MODERATE" | "ELEVATED" | "HIGH" | "CRITICAL";
  iconName: string;
  description: string;
  trend: "increasing" | "stable" | "decreasing";
  changeRate: string;
  dataSource: string;
  confidence: number;
}

export interface HistoricalTrendPoint {
  month: string;
  heat: number;
  air: number;
  flood: number;
  green: number;
  overall: number;
}

export interface ExposureBreakdown {
  label: string;
  population: number;
  percentage: number;
  riskCategory: "Low" | "Moderate" | "Elevated" | "High";
  color: string;
}
