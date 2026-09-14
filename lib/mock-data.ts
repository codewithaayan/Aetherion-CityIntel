import { Area } from "@/types/area";
import { RiskScores } from "@/types/risk";
import { SimulationScenario, SimulationResults } from "@/types/simulation";

export const MOCK_AREAS: Area[] = [
  {
    id: "gulshan-iqbal",
    name: "Gulshan-e-Iqbal",
    city: "Karachi",
    country: "Pakistan",
    coordinates: { lat: 24.9207, lng: 67.0982 },
    population: 1200000,
    highRiskPopulation: 840000,
    exposedPercentage: 70,
    areaKm2: 26.4,
    densityPerKm2: 45454,
    lastUpdated: "2026-09-04T12:00:00Z",
    dataConfidence: 94,
    satellitePassDate: "2026-09-03 (Sentinel-2B & Landsat 9)",
    scores: {
      heat: 81,
      air: 74,
      flood: 68,
      green: 39,
      mobility: 61,
      populationExposure: 77,
      overall: 72,
    },
    summary:
      "This area shows elevated heat exposure combined with limited green infrastructure and significant population exposure.",
    keyInsights: [
      {
        id: "insight-1",
        title: "Heat Concentration",
        description:
          "Northern zones show significantly higher surface temperatures (+4.2°C above city baseline) driven by dense paved surfaces and lack of canopy.",
        category: "heat",
        severity: "critical",
        metricBadge: "LST 43.8°C",
      },
      {
        id: "insight-2",
        title: "Green Infrastructure Gap",
        description:
          "Low vegetation coverage (NDVI < 0.16) increases heat vulnerability and inhibits natural cooling corridors across residential blocks.",
        category: "green",
        severity: "warning",
        metricBadge: "NDVI 0.14",
      },
      {
        id: "insight-3",
        title: "High Population Exposure",
        description:
          "Large residential populations overlap with high environmental risk zones, leaving over 840,000 citizens with acute multi-stress exposure.",
        category: "population",
        severity: "critical",
        metricBadge: "840K At-Risk",
      },
    ],
    historicalTrends: [
      { month: "Oct", heat: 75, air: 70, flood: 40, green: 42, overall: 66 },
      { month: "Nov", heat: 64, air: 78, flood: 30, green: 41, overall: 62 },
      { month: "Dec", heat: 52, air: 85, flood: 25, green: 40, overall: 58 },
      { month: "Jan", heat: 48, air: 88, flood: 25, green: 39, overall: 56 },
      { month: "Feb", heat: 58, air: 82, flood: 30, green: 39, overall: 61 },
      { month: "Mar", heat: 72, air: 76, flood: 35, green: 38, overall: 67 },
      { month: "Apr", heat: 82, air: 72, flood: 38, green: 37, overall: 73 },
      { month: "May", heat: 91, air: 71, flood: 42, green: 36, overall: 79 },
      { month: "Jun", heat: 94, air: 69, flood: 55, green: 36, overall: 81 },
      { month: "Jul", heat: 88, air: 66, flood: 78, green: 38, overall: 78 },
      { month: "Aug", heat: 85, air: 68, flood: 82, green: 40, overall: 76 },
      { month: "Sep", heat: 81, air: 74, flood: 68, green: 39, overall: 72 },
    ],
    exposureDistribution: [
      { label: "Critical Exposure", population: 360000, percentage: 30, riskCategory: "High", color: "#EF4444" },
      { label: "Elevated Risk", population: 480000, percentage: 40, riskCategory: "Elevated", color: "#F97316" },
      { label: "Moderate Risk", population: 240000, percentage: 20, riskCategory: "Moderate", color: "#38BDF8" },
      { label: "Low Exposure", population: 120000, percentage: 10, riskCategory: "Low", color: "#10B981" },
    ],
  },
  {
    id: "dha",
    name: "Defence (DHA)",
    city: "Karachi",
    country: "Pakistan",
    coordinates: { lat: 24.8012, lng: 67.0674 },
    population: 450000,
    highRiskPopulation: 180000,
    exposedPercentage: 40,
    areaKm2: 35.8,
    densityPerKm2: 12569,
    lastUpdated: "2026-09-04T12:00:00Z",
    dataConfidence: 96,
    satellitePassDate: "2026-09-03 (Sentinel-2B)",
    scores: {
      heat: 62,
      air: 58,
      flood: 84,
      green: 55,
      mobility: 52,
      populationExposure: 48,
      overall: 59,
    },
    summary:
      "Coastal location mitigates heat island buildup but experiences significant coastal surge vulnerability and storm drainage bottlenecks.",
    keyInsights: [
      {
        id: "insight-dha-1",
        title: "Coastal Storm Vulnerability",
        description: "Low-lying phase zones experience backflow risks during extreme high tide and monsoon confluence.",
        category: "flood",
        severity: "critical",
        metricBadge: "High Surge Risk",
      },
      {
        id: "insight-dha-2",
        title: "Marine Air Exchange",
        description: "Daily sea breeze maintains moderate particulate dispersal compared to central inland corridors.",
        category: "air",
        severity: "info",
        metricBadge: "AQI 112",
      },
      {
        id: "insight-dha-3",
        title: "Planned Canopy Distribution",
        description: "Avenue-level tree density buffers localized surface radiant heat across residential zones.",
        category: "green",
        severity: "info",
        metricBadge: "NDVI 0.28",
      },
    ],
    historicalTrends: [
      { month: "Oct", heat: 58, air: 55, flood: 42, green: 56, overall: 54 },
      { month: "Nov", heat: 50, air: 62, flood: 30, green: 55, overall: 51 },
      { month: "Dec", heat: 42, air: 68, flood: 22, green: 54, overall: 48 },
      { month: "Jan", heat: 38, air: 70, flood: 20, green: 54, overall: 46 },
      { month: "Feb", heat: 46, air: 65, flood: 24, green: 54, overall: 49 },
      { month: "Mar", heat: 56, air: 60, flood: 28, green: 53, overall: 52 },
      { month: "Apr", heat: 64, air: 58, flood: 32, green: 52, overall: 55 },
      { month: "May", heat: 70, air: 56, flood: 40, green: 51, overall: 58 },
      { month: "Jun", heat: 74, air: 54, flood: 58, green: 52, overall: 62 },
      { month: "Jul", heat: 68, air: 52, flood: 92, green: 56, overall: 68 },
      { month: "Aug", heat: 65, air: 54, flood: 94, green: 57, overall: 67 },
      { month: "Sep", heat: 62, air: 58, flood: 84, green: 55, overall: 59 },
    ],
    exposureDistribution: [
      { label: "Critical Exposure", population: 67500, percentage: 15, riskCategory: "High", color: "#EF4444" },
      { label: "Elevated Risk", population: 112500, percentage: 25, riskCategory: "Elevated", color: "#F97316" },
      { label: "Moderate Risk", population: 180000, percentage: 40, riskCategory: "Moderate", color: "#38BDF8" },
      { label: "Low Exposure", population: 90000, percentage: 20, riskCategory: "Low", color: "#10B981" },
    ],
  },
  {
    id: "saddar",
    name: "Saddar Downtown",
    city: "Karachi",
    country: "Pakistan",
    coordinates: { lat: 24.8569, lng: 67.0143 },
    population: 850000,
    highRiskPopulation: 620000,
    exposedPercentage: 73,
    areaKm2: 14.2,
    densityPerKm2: 59859,
    lastUpdated: "2026-09-04T12:00:00Z",
    dataConfidence: 93,
    satellitePassDate: "2026-09-03 (Sentinel-5P & Landsat 9)",
    scores: {
      heat: 86,
      air: 89,
      flood: 64,
      green: 22,
      mobility: 92,
      populationExposure: 84,
      overall: 82,
    },
    summary:
      "Intense commercial density and high vehicular throughput produce acute particulate concentration and urban heat canyon effects.",
    keyInsights: [
      {
        id: "insight-saddar-1",
        title: "Severe Urban Heat Canyon",
        description: "Dense multi-story structures trap longwave radiation, delaying night-time cooling by up to 5 hours.",
        category: "heat",
        severity: "critical",
        metricBadge: "Night Temp +5.1°C",
      },
      {
        id: "insight-saddar-2",
        title: "Critical Traffic Emissions",
        description: "Continuous transit bottlenecks along Empress Market produce localized PM2.5 hotspots.",
        category: "air",
        severity: "critical",
        metricBadge: "PM2.5 168 µg/m³",
      },
      {
        id: "insight-saddar-3",
        title: "Extreme Canopy Deficit",
        description: "Vegetation coverage is below 6% of total surface area, offering virtually no shade or biological filtration.",
        category: "green",
        severity: "critical",
        metricBadge: "NDVI 0.07",
      },
    ],
    historicalTrends: [
      { month: "Oct", heat: 82, air: 86, flood: 35, green: 24, overall: 78 },
      { month: "Nov", heat: 72, air: 92, flood: 25, green: 23, overall: 76 },
      { month: "Dec", heat: 62, air: 97, flood: 20, green: 23, overall: 74 },
      { month: "Jan", heat: 58, air: 98, flood: 20, green: 22, overall: 73 },
      { month: "Feb", heat: 68, air: 94, flood: 25, green: 22, overall: 76 },
      { month: "Mar", heat: 78, air: 90, flood: 30, green: 22, overall: 79 },
      { month: "Apr", heat: 87, air: 88, flood: 32, green: 21, overall: 82 },
      { month: "May", heat: 94, air: 86, flood: 38, green: 21, overall: 85 },
      { month: "Jun", heat: 96, air: 84, flood: 50, green: 21, overall: 86 },
      { month: "Jul", heat: 91, air: 80, flood: 75, green: 22, overall: 84 },
      { month: "Aug", heat: 88, air: 82, flood: 78, green: 23, overall: 83 },
      { month: "Sep", heat: 86, air: 89, flood: 64, green: 22, overall: 82 },
    ],
    exposureDistribution: [
      { label: "Critical Exposure", population: 382500, percentage: 45, riskCategory: "High", color: "#EF4444" },
      { label: "Elevated Risk", population: 238000, percentage: 28, riskCategory: "Elevated", color: "#F97316" },
      { label: "Moderate Risk", population: 153000, percentage: 18, riskCategory: "Moderate", color: "#38BDF8" },
      { label: "Low Exposure", population: 76500, percentage: 9, riskCategory: "Low", color: "#10B981" },
    ],
  },
  {
    id: "clifton",
    name: "Clifton",
    city: "Karachi",
    country: "Pakistan",
    coordinates: { lat: 24.8188, lng: 67.0305 },
    population: 380000,
    highRiskPopulation: 140000,
    exposedPercentage: 37,
    areaKm2: 21.5,
    densityPerKm2: 17674,
    lastUpdated: "2026-09-04T12:00:00Z",
    dataConfidence: 95,
    satellitePassDate: "2026-09-03 (Landsat 9)",
    scores: {
      heat: 65,
      air: 62,
      flood: 76,
      green: 58,
      mobility: 55,
      populationExposure: 42,
      overall: 58,
    },
    summary:
      "Mixed coastal urban fabric with relatively strong municipal park reserves but vulnerability to storm surge and tidal inundation.",
    keyInsights: [
      {
        id: "insight-clifton-1",
        title: "Sea Front Ventilation",
        description: "Aero-thermal circulation from Arabian Sea moderates daytime ambient maximums.",
        category: "heat",
        severity: "info",
        metricBadge: "Sea Breeze 14kt",
      },
      {
        id: "insight-clifton-2",
        title: "Coastal Inundation Zone",
        description: "Blocks adjacent to Boat Basin face localized pooling during intense precipitation spells.",
        category: "flood",
        severity: "warning",
        metricBadge: "Tide Sensitive",
      },
      {
        id: "insight-clifton-3",
        title: "Urban Park Resilience",
        description: "Benazir Bhutto Park and surrounding vegetation buffers air pollutants effectively.",
        category: "green",
        severity: "info",
        metricBadge: "NDVI 0.31",
      },
    ],
    historicalTrends: [
      { month: "Oct", heat: 60, air: 60, flood: 38, green: 59, overall: 55 },
      { month: "Nov", heat: 52, air: 65, flood: 28, green: 58, overall: 52 },
      { month: "Dec", heat: 44, air: 70, flood: 22, green: 57, overall: 49 },
      { month: "Jan", heat: 40, air: 72, flood: 20, green: 57, overall: 48 },
      { month: "Feb", heat: 48, air: 68, flood: 24, green: 56, overall: 50 },
      { month: "Mar", heat: 58, air: 64, flood: 28, green: 56, overall: 53 },
      { month: "Apr", heat: 67, air: 62, flood: 30, green: 55, overall: 56 },
      { month: "May", heat: 73, air: 60, flood: 36, green: 54, overall: 59 },
      { month: "Jun", heat: 77, air: 58, flood: 54, green: 55, overall: 63 },
      { month: "Jul", heat: 72, air: 56, flood: 85, green: 59, overall: 67 },
      { month: "Aug", heat: 68, air: 58, flood: 87, green: 60, overall: 66 },
      { month: "Sep", heat: 65, air: 62, flood: 76, green: 58, overall: 58 },
    ],
    exposureDistribution: [
      { label: "Critical Exposure", population: 57000, percentage: 15, riskCategory: "High", color: "#EF4444" },
      { label: "Elevated Risk", population: 83600, percentage: 22, riskCategory: "Elevated", color: "#F97316" },
      { label: "Moderate Risk", population: 144400, percentage: 38, riskCategory: "Moderate", color: "#38BDF8" },
      { label: "Low Exposure", population: 95000, percentage: 25, riskCategory: "Low", color: "#10B981" },
    ],
  },
  {
    id: "korangi",
    name: "Korangi Industrial",
    city: "Karachi",
    country: "Pakistan",
    coordinates: { lat: 24.8322, lng: 67.1432 },
    population: 1400000,
    highRiskPopulation: 1050000,
    exposedPercentage: 75,
    areaKm2: 42.1,
    densityPerKm2: 33254,
    lastUpdated: "2026-09-04T12:00:00Z",
    dataConfidence: 91,
    satellitePassDate: "2026-09-03 (Sentinel-5P & NASA GPM)",
    scores: {
      heat: 84,
      air: 92,
      flood: 71,
      green: 18,
      mobility: 79,
      populationExposure: 88,
      overall: 83,
    },
    summary:
      "High concentration of manufacturing facilities, heavy commercial transit, and informal settlements create intense composite environmental stress.",
    keyInsights: [
      {
        id: "insight-korangi-1",
        title: "Industrial Plume Exposure",
        description: "Sulfur dioxide and particulate emissions from textile and chemical zones severely elevate localized AQI.",
        category: "air",
        severity: "critical",
        metricBadge: "AQI 214 Hazardous",
      },
      {
        id: "insight-korangi-2",
        title: "Thermal Rooftop Mass",
        description: "Extensive uninsulated corrugated iron industrial roofs amplify surface thermal radiation.",
        category: "heat",
        severity: "critical",
        metricBadge: "LST 46.2°C",
      },
      {
        id: "insight-korangi-3",
        title: "Malir River Drain Vulnerability",
        description: "Overflow along non-canalized natural nullahs poses flash flooding risk to low-income labor colonies.",
        category: "flood",
        severity: "warning",
        metricBadge: "Nullah Overflow",
      },
    ],
    historicalTrends: [
      { month: "Oct", heat: 80, air: 88, flood: 40, green: 19, overall: 79 },
      { month: "Nov", heat: 70, air: 95, flood: 30, green: 18, overall: 78 },
      { month: "Dec", heat: 60, air: 99, flood: 22, green: 18, overall: 77 },
      { month: "Jan", heat: 56, air: 99, flood: 20, green: 18, overall: 76 },
      { month: "Feb", heat: 66, air: 96, flood: 25, green: 18, overall: 78 },
      { month: "Mar", heat: 76, air: 92, flood: 30, green: 17, overall: 80 },
      { month: "Apr", heat: 85, air: 90, flood: 35, green: 17, overall: 82 },
      { month: "May", heat: 93, air: 88, flood: 45, green: 16, overall: 85 },
      { month: "Jun", heat: 95, air: 86, flood: 60, green: 16, overall: 87 },
      { month: "Jul", heat: 90, air: 82, flood: 85, green: 18, overall: 85 },
      { month: "Aug", heat: 86, air: 84, flood: 88, green: 19, overall: 84 },
      { month: "Sep", heat: 84, air: 92, flood: 71, green: 18, overall: 83 },
    ],
    exposureDistribution: [
      { label: "Critical Exposure", population: 700000, percentage: 50, riskCategory: "High", color: "#EF4444" },
      { label: "Elevated Risk", population: 350000, percentage: 25, riskCategory: "Elevated", color: "#F97316" },
      { label: "Moderate Risk", population: 210000, percentage: 15, riskCategory: "Moderate", color: "#38BDF8" },
      { label: "Low Exposure", population: 140000, percentage: 10, riskCategory: "Low", color: "#10B981" },
    ],
  },
];

export const DEFAULT_AREA = MOCK_AREAS[0]; // Gulshan-e-Iqbal

export function getAreaById(id: string): Area {
  const found = MOCK_AREAS.find(
    (a) => a.id.toLowerCase() === id.toLowerCase() || a.id.replace(/-/g, "") === id.replace(/-/g, "")
  );
  return found || DEFAULT_AREA;
}

// AI Diagnostic Questions & Structured Responses
export interface StructuredAIResponse {
  question: string;
  primaryIssue: string;
  whyItMatters: string;
  evidence: { label: string; value: string; status: "alert" | "warning" | "neutral" }[];
  recommendedActions: string[];
  scientificNote: string;
}

export const AI_KNOWLEDGE_BASE: Record<string, StructuredAIResponse> = {
  "why-heat-risk-high": {
    question: "Why is heat risk high here?",
    primaryIssue: "Extreme Urban Heat Island (UHI) Effect & Thermal Inertia",
    whyItMatters:
      "Dense concrete building materials absorb solar radiation during peak daylight and reradiate thermal energy throughout the night. Combined with low albedo road surfaces, night-time minimum temperatures remain up to 4.2°C higher than surrounding non-urban zones, preventing thermal relief for vulnerable residents.",
    evidence: [
      { label: "Heat Score", value: "81 / 100 (High)", status: "alert" },
      { label: "Green Canopy Coverage", value: "39% (NDVI 0.14)", status: "alert" },
      { label: "Impervious Surface Ratio", value: "78.4%", status: "warning" },
      { label: "Night LST Deviation", value: "+4.2°C vs Baseline", status: "alert" },
    ],
    recommendedActions: [
      "Target high-albedo cool roof coatings across large commercial rooftops and civic facilities.",
      "Deploy linear pocket forests and shade trees along key pedestrian transit arteries.",
      "Establish localized cooling shelters equipped with passive shading and evaporative misting.",
    ],
    scientificNote:
      "Calculated from Landsat 9 Thermal Infrared Sensor (TIRS-2 Band 10) surface brightness temperature calibrated with Sentinel-2 NDVI vegetative indices.",
  },
  "biggest-environmental-concern": {
    question: "What is the biggest environmental concern?",
    primaryIssue: "Compound Hazard: Extreme Heat Overlapping Multi-Tier Population Density",
    whyItMatters:
      "While particulate matter (PM2.5) is elevated (Score 74), the critical systemic risk is the thermodynamic intersection: elderly and low-income demographics reside in high-density blocks with zero tree canopy buffer, resulting in 840,000 residents living under sustained thermal stress without mechanical air conditioning guarantees.",
    evidence: [
      { label: "Overall Priority Score", value: "72 / 100", status: "alert" },
      { label: "Exposed Population", value: "840,000 (70%)", status: "alert" },
      { label: "Air Quality Score", value: "74 / 100 (Elevated)", status: "warning" },
      { label: "Flood Vulnerability", value: "68 / 100", status: "warning" },
    ],
    recommendedActions: [
      "Prioritize municipal grant funding for reflective roofing in the highest density sub-blocks.",
      "Enforce mandatory green buffer zoning for all newly permitted mixed-use structures.",
      "Integrate early warning heat wave broadcast alerts with district community healthcare centers.",
    ],
    scientificNote:
      "Multi-criteria decision analysis (MCDA) weightings: Heat (30%), Population Density (25%), Air (20%), Drainage (15%), Mobility (10%).",
  },
  "who-is-most-exposed": {
    question: "Who is most exposed?",
    primaryIssue: "Children, Outdoor Workers, and High-Density Residential Tenants",
    whyItMatters:
      "Demographic overlay from WorldPop gridded census data reveals that children under 5 and seniors over 65 comprise 28% of the at-risk zone. Furthermore, unregulated informal commercial street vendors and non-air-conditioned multi-family walk-ups lack thermal resilience buffers.",
    evidence: [
      { label: "High-Risk Population", value: "840K citizens", status: "alert" },
      { label: "Vulnerable Age Group (<5 & >65)", value: "235,000 citizens", status: "alert" },
      { label: "Walkability Shade Deficit", value: "82% unshaded routes", status: "warning" },
      { label: "Health Facility Proximity", value: "1.8 km avg distance", status: "neutral" },
    ],
    recommendedActions: [
      "Install shaded transit stops and public hydrations stations along University Road and major market lanes.",
      "Equip local clinics with rapid cooling intravenous protocols during heat advisories.",
      "Deploy targeted educational campaigns on nocturnal ventilation and hydration timing.",
    ],
    scientificNote:
      "Synthesized from WorldPop 100m constrained population rasters combined with OpenStreetMap community amenity vectors.",
  },
  "what-interventions-could-help": {
    question: "What interventions could help?",
    primaryIssue: "Multi-Tiered Urban Greening and Reflective Surface Deployment",
    whyItMatters:
      "Micro-climate simulations indicate that expanding vegetative canopy by +20% and mandating cool roofs on 40% of building envelopes can drop local land surface temperature by 2.4°C and lower the composite Urban Priority Score from 72 down to 61.",
    evidence: [
      { label: "Simulated Temp Reduction", value: "-2.4°C Ambient", status: "neutral" },
      { label: "Green Score Potential", value: "39 → 58 (+19 pts)", status: "neutral" },
      { label: "Runoff Absorption Gain", value: "+38% stormwater buffer", status: "neutral" },
      { label: "Protected Citizens", value: "~195,000 de-escalated", status: "neutral" },
    ],
    recommendedActions: [
      "Initiate a public-private cool roof incentive targeting 50,000 square meters of flat rooftop.",
      "Convert underutilized median strips and canal easements into bioswales and continuous green corridors.",
      "Establish low-emission micro-mobility zones to curb localized exhaust heat and PM2.5 accumulation.",
    ],
    scientificNote:
      "Empirical modeling parameters adapted from chip-engine thermodynamic microclimate transfer functions.",
  },
};

// Simulation engine mock calculation
export function calculateSimulation(
  baseline: RiskScores,
  scenario: SimulationScenario
): SimulationResults {
  // Tree coverage delta: baseline is ~30% (scale 0-100)
  const treeBonus = Math.max(0, scenario.treeCoverage - 30) * 0.45;
  // Cool roofs: 0-100%
  const coolRoofBonus = scenario.coolRoofs * 0.22;
  // Drainage: 0-100
  const drainageBonus = (scenario.drainage / 100) * 22;
  // Traffic: 0-100%
  const trafficBonus = scenario.trafficReduction * 0.25;
  // Green corridors toggle: adds flat bonus
  const corridorBonus = scenario.greenCorridors ? 5.5 : 0;

  // Projected scores (bounded 10 - 95)
  const projectedHeat = Math.max(
    25,
    Math.round(baseline.heat - (treeBonus * 0.6 + coolRoofBonus * 0.7 + corridorBonus * 0.4))
  );
  const projectedGreen = Math.min(
    95,
    Math.round(baseline.green + treeBonus * 1.1 + corridorBonus * 0.8)
  );
  const projectedAir = Math.max(
    20,
    Math.round(baseline.air - (trafficBonus * 0.7 + treeBonus * 0.25 + corridorBonus * 0.3))
  );
  const projectedFlood = Math.max(
    20,
    Math.round(baseline.flood - (drainageBonus * 0.8 + treeBonus * 0.35 + corridorBonus * 0.3))
  );
  const projectedMobility = Math.max(
    25,
    Math.round(baseline.mobility - trafficBonus * 0.6)
  );

  const projectedOverall = Math.round(
    projectedHeat * 0.25 +
      projectedAir * 0.2 +
      projectedFlood * 0.15 +
      (100 - projectedGreen) * 0.15 +
      projectedMobility * 0.1 +
      baseline.populationExposure * 0.15
  );

  const tempDrop = parseFloat(
    ((treeBonus * 0.08 + coolRoofBonus * 0.05 + corridorBonus * 0.03)).toFixed(1)
  );

  return {
    baselineScores: baseline,
    projectedScores: {
      heat: projectedHeat,
      air: projectedAir,
      flood: projectedFlood,
      green: projectedGreen,
      mobility: projectedMobility,
      populationExposure: Math.max(20, Math.round(baseline.populationExposure - (treeBonus + coolRoofBonus) * 0.25)),
      overall: projectedOverall,
    },
    delta: {
      heat: projectedHeat - baseline.heat,
      green: projectedGreen - baseline.green,
      overall: projectedOverall - baseline.overall,
      air: projectedAir - baseline.air,
      flood: projectedFlood - baseline.flood,
    },
    metrics: {
      tempReductionC: Math.max(0.4, tempDrop),
      stormwaterAbsorptionRate: Math.round(drainageBonus * 1.6 + treeBonus * 0.8),
      co2ReductionTons: Math.round((scenario.treeCoverage * 14 + scenario.trafficReduction * 28)),
      vulnerablePopulationProtected: Math.round((baseline.overall - projectedOverall) * 14500),
    },
  };
}

// Data Sources Data
export const DATA_SOURCES = [
  {
    name: "NASA Earth Observation",
    agency: "NASA EOSDIS",
    description: "Multispectral radiance, land surface temperature, and atmospheric profile data.",
    resolution: "1km / Daily pass",
    badge: "Thermal & Climate",
    icon: "Satellite",
  },
  {
    name: "Landsat 8 & 9",
    agency: "USGS / NASA",
    description: "Thermal Infrared Sensor (TIRS) and OLI high-resolution surface heat island detection.",
    resolution: "30m - 100m / 16-day cycle",
    badge: "Surface Temperature",
    icon: "Globe",
  },
  {
    name: "Sentinel-2",
    agency: "European Space Agency (ESA)",
    description: "High-resolution multispectral imagery for NDVI vegetation health and canopy density mapping.",
    resolution: "10m - 20m / 5-day cycle",
    badge: "Vegetation & Canopy",
    icon: "Layers",
  },
  {
    name: "NASA GPM",
    agency: "NASA / JAXA",
    description: "Global Precipitation Measurement constellation providing integrated multi-satellite rain rates.",
    resolution: "0.1° (~10km) / Half-hourly",
    badge: "Precipitation & Flood",
    icon: "CloudRain",
  },
  {
    name: "Open-Meteo",
    agency: "Meteorological Models",
    description: "Global high-resolution weather, wind velocity, surface pressure, and atmospheric chemical forecasts.",
    resolution: "1km - 11km / Hourly",
    badge: "Atmospheric & AQI",
    icon: "Wind",
  },
  {
    name: "WorldPop",
    agency: "University of Southampton",
    description: "High-resolution gridded demographic data mapping spatial population distributions and age profiles.",
    resolution: "100m grid cell",
    badge: "Population Density",
    icon: "Users",
  },
  {
    name: "OpenStreetMap",
    agency: "OpenStreetMap Foundation",
    description: "Open community geodata mapping urban building footprints, road networks, and civic infrastructure.",
    resolution: "Vector metric precision",
    badge: "Urban Topography",
    icon: "MapPin",
  },
];

// Team Aetherion
export const TEAM_MEMBERS = [
  {
    name: "Phantom",
    role: "Product + Frontend",
    description: "Architects the product experience, component boundaries, visual telemetry, and reactive UI states.",
    gradient: "from-cyan-500 to-blue-600",
    initials: "PH",
    specialty: "Next.js, UX Architecture, Telemetry Systems",
  },
  {
    name: "Chip",
    role: "Environmental Modeling",
    description: "Develops thermodynamic transfer functions, UHI simulation logic, and multi-criteria environmental scoring.",
    gradient: "from-emerald-500 to-cyan-600",
    initials: "CH",
    specialty: "Microclimate Modeling, Physics Engines, Thermal Dynamics",
  },
  {
    name: "Infinity",
    role: "GIS + Visualization",
    description: "Engineers spatial data rasterization, WebGL shader layers, GeoJSON rendering, and interactive cartography.",
    gradient: "from-purple-500 to-indigo-600",
    initials: "IN",
    specialty: "GIS Pipelines, Mapbox/MapLibre, Vector Shaders",
  },
  {
    name: "Abd",
    role: "Backend + Infrastructure",
    description: "Constructs scalable high-throughput REST/gRPC endpoints, database caching, and cloud data distribution.",
    gradient: "from-blue-600 to-sky-400",
    initials: "AB",
    specialty: "High-Throughput APIs, Geospatial DBs, Cloud Architecture",
  },
  {
    name: "Arjun",
    role: "Data + AI",
    description: "Orchestrates multi-satellite ingestion pipelines, spatial feature embeddings, and LLM diagnostic synthesis.",
    gradient: "from-amber-500 to-orange-600",
    initials: "AR",
    specialty: "Satellite Pipelines, Spatial AI, ML Inference",
  },
  {
    name: "Ayesha",
    role: "Research + Validation",
    description: "Validates scientific methodology against peer-reviewed urban heat literature and ground sensor networks.",
    gradient: "from-rose-500 to-pink-600",
    initials: "AY",
    specialty: "Urban Climatology, Statistical Validation, Ground Truth",
  },
];
