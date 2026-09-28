from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass(frozen=True)
class Cellinputs:
    cell_id: str

    #Heat stats
    lst_celsius: Optional[float] = None
    valid_pixel_fraction: Optional[float] = None
    cloud_fraction: Optional[float] = None

    #Green stats
    ndvi: Optional[float] = None

    #Air quality stat
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    no2: Optional[float] = None
    o3: Optional[float] = None
    so2: Optional[float] = None
    co: Optional[float] = None

    #Flood stats
    rainfall_mm_hr: Optional[float] = None
    rainfall_24h_mm: Optional[float] = None
    elevation_m: Optional[float] = None
    slope_deg: Optional[float] = None
    impervious_fraction: Optional[float] = None  # 0 to 1
    water_distance_m: Optional[float] = None
    twi: Optional[float] = None  # Topographic Wetness Index, optional

    #Urban stats
    population: Optional[float] = None
    road_density: Optional[float] = None 


@dataclass(frozen=True)
class gridscoring:

    cell_id: str

    heat_score: float
    air_score: float
    flood_score: float
    green_score: float
    green_deficit_score: float
    mobility_score: float

    environmental_risk_score: float
    exposure_score: float
    urban_priority_score: float

    population: float
    high_risk_population: float

    confidence: float

    provenance: Dict[str, object]


@dataclass(frozen=True)
class basestats:

    heat: float
    air: float
    flood: float
    green: float
    mobility: float

    environmental_risk: float
    exposure_score: float
    urban_priority: float

    impervious_fraction: float = 0.5


@dataclass(frozen=True)
class scenarioinput:
    tree_change_pp: float = 0.0
    cool_roof_change_pp: float = 0.0
    drainage_change_pp: float = 0.0
    traffic_reduction_pp: float = 0.0
    green_corridor_pp: float = 0.0


@dataclass(frozen=True)
class scenario_output:
    baseline: Dict[str, float]
    projected: Dict[str, float]
    deltas: Dict[str, float]
    assumptions: List[str]

    label: str = "modelled scenario"
    confidence: float = 0.65
    uncertainty: Optional[Dict[str, float]] = None