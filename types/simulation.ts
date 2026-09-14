import { RiskScores } from "./risk";

export interface SimulationScenario {
  treeCoverage: number; // percentage (e.g., 30 to 60)
  coolRoofs: number; // percentage (0 to 60)
  drainage: number; // 0 to 100 (Low to High index)
  trafficReduction: number; // percentage (0 to 50)
  greenCorridors: boolean; // boolean toggle
}

export interface SimulationResults {
  baselineScores: RiskScores;
  projectedScores: RiskScores;
  delta: {
    heat: number;
    green: number;
    overall: number;
    air: number;
    flood: number;
  };
  metrics: {
    tempReductionC: number;
    stormwaterAbsorptionRate: number; // percentage increase
    co2ReductionTons: number;
    vulnerablePopulationProtected: number;
  };
}
