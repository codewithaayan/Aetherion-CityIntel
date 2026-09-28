from __future__ import annotations
from dataclasses import dataclass, field
from typing import Mapping, Tuple


@dataclass(frozen=True)
class normalizeconfig:
    lower_quantile: float = 0.05
    upper_quantile: float = 0.95
    exposure_upper_quantile: float = 0.98
    neutral_score: float = 50.0


@dataclass(frozen=True)
class heatconfig:
    absolute_weight: float = 0.70
    anomaly_weight: float = 0.30
    rural_reference_quantile: float = 0.10
    min_valid_fraction: float = 0.35
    max_cloud_fraction: float = 0.35


@dataclass(frozen=True)
class greenconfig:
    ndvi_soil: float = 0.10
    ndvi_full_veg: float = 0.70


@dataclass(frozen=True)
class airconfig:

    weights: Mapping[str, float] = field(
        default_factory=lambda: {"pm25": 0.40,"pm10": 0.20,"no2": 0.15,"o3": 0.15,"so2": 0.05,"co": 0.05}
    )

    bounds: Mapping[str, Tuple[float, float]] = field(
        default_factory=lambda: {
            "pm25": (5.0, 75.0),
            "pm10": (15.0, 150.0),
            "no2": (10.0, 200.0),
            "o3": (60.0, 180.0),
            "so2": (20.0, 350.0),
            "co": (4.0, 30.0),
        }
    )


@dataclass(frozen=True)
class floodconfig:
    weights: Mapping[str, float] = field(
        default_factory=lambda: {"rainfall": 0.30,"elevation": 0.25,"slope": 0.15,"impervious": 0.20,"water": 0.10}
    )

    rainfall_upper_mm_hr: float = 30.0
    max_slope_deg: float = 15.0
    water_distance_max_m: float = 1000.0
    twi_weight_in_slope: float = 0.30


@dataclass(frozen=True)
class mobileconfig:
    road_weight: float = 0.65
    population_weight: float = 0.35


@dataclass(frozen=True)
class expconfig:
    high_risk_threshold: float = 70.0


@dataclass(frozen=True)
class cpsconfig:
    environmental_weights: Mapping[str, float] = field(
        default_factory=lambda: {
            "heat": 0.30,
            "air": 0.25,
            "flood": 0.25,
            "green_deficit": 0.12,
            "mobility": 0.08,
        }
    )

    hazard_weight: float = 0.65
    exposure_weight: float = 0.35

    minimum_component_score: float = 0.0
    maximum_component_score: float = 100.0


@dataclass(frozen=True)
class sim_coeffs:

    tree_heat_per_pp: float = 0.22
    tree_green_per_pp: float = 1.00
    tree_flood_per_pp: float = 0.08
    tree_air_per_pp: float = 0.05

    cool_roof_heat_per_pp: float = 0.18

    drainage_flood_per_pp: float = 0.30

    traffic_air_per_pp: float = 0.22
    traffic_mobility_per_pp: float = 0.35
    traffic_heat_per_pp: float = 0.02

    corridor_green_per_pp: float = 0.60
    corridor_heat_per_pp: float = 0.10
    corridor_flood_per_pp: float = 0.05
    corridor_air_per_pp: float = 0.03
    corridor_mobility_per_pp: float = 0.05

    uncertainty_cv: float = 0.25

    floor_score: float = 3.0


@dataclass(frozen=True)
class engineconfig:
    normalization: normalizeconfig = field(default_factory=normalizeconfig)
    heat: heatconfig = field(default_factory=heatconfig)
    green: greenconfig = field(default_factory=greenconfig)
    air: airconfig = field(default_factory=airconfig)
    flood: floodconfig = field(default_factory=floodconfig)
    mobility:mobileconfig = field(default_factory=mobileconfig)
    exposure: expconfig = field(default_factory=expconfig)
    composite: cpsconfig = field(default_factory=cpsconfig)
    simulator: sim_coeffs = field(default_factory=sim_coeffs)