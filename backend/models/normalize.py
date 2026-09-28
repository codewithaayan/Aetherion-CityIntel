from __future__ import annotations
from typing import Mapping, Optional
import numpy as np


def clamp_array(values: np.ndarray | list | float, low: float = 0.0, high: float = 100.0) -> np.ndarray:
    arr = np.asarray(values, dtype=float)
    return np.clip(arr, low, high)


def finite_percentile(values: np.ndarray | list, q: float) -> float:
    arr = np.asarray(values, dtype=float)
    arr = arr[np.isfinite(arr)]

    if arr.size == 0:
        return float("nan")

    return float(np.percentile(arr, q * 100.0))


def robust_bounds(
    values: np.ndarray | list,
    lower_q: float,
    upper_q: float,
) -> tuple[float, float]:
    arr = np.asarray(values, dtype=float)
    finite = arr[np.isfinite(arr)]

    lower = finite_percentile(arr, lower_q)
    upper = finite_percentile(arr, upper_q)

    if (
        finite.size == 0
        or not np.isfinite(lower)
        or not np.isfinite(upper)
        or upper <= lower
    ):
        if finite.size == 0:
            return 0.0, 1.0

        lower = float(np.min(finite))
        upper = float(np.max(finite))

    if upper <= lower:
        upper = lower + 1e-6

    return lower, upper


def badhighvalue(
    values: np.ndarray | list,
    lower: Optional[float] = None,
    upper: Optional[float] = None,
    lower_q: float = 0.05,
    upper_q: float = 0.95,
    neutral: float = 50.0,
    preserve_missing: bool = True,
) -> np.ndarray:

    arr = np.asarray(values, dtype=float)

    if arr.size == 0:
        return arr.copy()

    if lower is None or upper is None:
        auto_lower, auto_upper = robust_bounds(arr, lower_q, upper_q)
        lower = float(lower) if lower is not None else auto_lower
        upper = float(upper) if upper is not None else auto_upper

    # If there is no meaningful spread, return neutral for finite values.
    if (
        not np.isfinite(lower)
        or not np.isfinite(upper)
        or upper <= lower + 1e-9
    ):
        if preserve_missing:
            return np.where(np.isfinite(arr), neutral, np.nan)
        return np.full(arr.shape, neutral, dtype=float)

    out = 100.0 * (arr - lower) / (upper - lower)
    out = clamp_array(out, 0.0, 100.0)

    if preserve_missing:
        out = np.where(np.isfinite(arr), out, np.nan)
    else:
        out = np.where(np.isfinite(out), out, neutral)

    return out


def betterhighvalue(
    values: np.ndarray | list,
    lower: Optional[float] = None,
    upper: Optional[float] = None,
    lower_q: float = 0.05,
    upper_q: float = 0.95,
    neutral: float = 50.0,
    preserve_missing: bool = True,
) -> np.ndarray:

    better = badhighvalue(
        values,
        lower=lower,
        upper=upper,
        lower_q=lower_q,
        upper_q=upper_q,
        neutral=neutral,
        preserve_missing=preserve_missing,
    )

    return clamp_array(100.0 - better, 0.0, 100.0)


def invert_score(values: np.ndarray | list) -> np.ndarray:
    arr = np.asarray(values, dtype=float)
    return clamp_array(100.0 - arr, 0.0, 100.0)


def weighted_avg(scores: Mapping[str, np.ndarray], weights: Mapping[str, float], neutral: float = 50.0) -> tuple[np.ndarray, np.ndarray]:
    if not scores:
        return np.asarray([], dtype=float), np.asarray([], dtype=float)

    first = next(iter(scores.values()))
    shape = np.asarray(first).shape

    total_weight = float(sum(weights.values()))
    if total_weight <= 0:
        return np.full(shape, neutral, dtype=float), np.zeros(shape, dtype=float)

    weighted_sum = np.zeros(shape, dtype=float)
    weight_sum = np.zeros(shape, dtype=float)

    for key, weight in weights.items():
        if key not in scores:
            continue

        arr = np.asarray(scores[key], dtype=float)
        available = np.isfinite(arr)

        safe_arr = np.where(available, arr, 0.0)
        weighted_sum += safe_arr * float(weight)
        weight_sum += np.where(available, float(weight), 0.0)

    score = np.where(
        weight_sum > 1e-9,
        weighted_sum / np.maximum(weight_sum, 1e-9),
        neutral,
    )

    availability = weight_sum / total_weight
    confidence = clamp_array(availability * 100.0, 0.0, 100.0)

    return clamp_array(score, 0.0, 100.0), confidence


def impute_median(values: np.ndarray | list, default: float = 0.0) -> np.ndarray:
    arr = np.asarray(values, dtype=float)

    if np.any(np.isfinite(arr)):
        median = float(np.nanmedian(arr))
    else:
        median = float(default)

    return np.where(np.isfinite(arr), arr, median)