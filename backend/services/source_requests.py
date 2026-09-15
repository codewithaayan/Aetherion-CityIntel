"""Transport parameters chosen by the caller; no dataset or model defaults."""

from datetime import date
from typing import Annotated, Literal

from pydantic import AwareDatetime, Field, model_validator

from backend.models.common import Number, Record

Latitude = Annotated[Number, Field(ge=-90, le=90)]
Longitude = Annotated[Number, Field(ge=-180, le=180)]
PageSize = Annotated[int, Field(strict=True, ge=1, le=100)]
AirVariable = Literal["pm10", "pm2_5", "carbon_monoxide", "carbon_dioxide",
                      "nitrogen_dioxide", "sulphur_dioxide", "ozone", "aerosol_optical_depth", "dust"]


class AirQualityRequest(Record):
    latitude: Latitude
    longitude: Longitude
    hourly: list[AirVariable] = Field(min_length=1, max_length=9)
    start_date: date
    end_date: date
    domains: Literal["auto", "cams_global", "cams_europe"]

    @model_validator(mode="after")
    def check_selection(self):
        if self.end_date < self.start_date:
            raise ValueError("end_date must be on or after start_date.")
        if len(set(self.hourly)) != len(self.hourly):
            raise ValueError("Request each variable once.")
        return self


class OverpassRequest(Record):
    # Arjun supplies the complete selectors/output statements, without global settings.
    statements: str = Field(min_length=1, max_length=60000)


class SpatialSearch(Record):
    bbox: tuple[Longitude, Latitude, Longitude, Latitude]
    start: AwareDatetime
    end: AwareDatetime
    limit: PageSize = 10

    @model_validator(mode="after")
    def check_extent_and_dates(self):
        west, south, east, north = self.bbox
        if west >= east or south >= north:
            raise ValueError("Supply west,south,east,north; split antimeridian searches explicitly.")
        if self.end < self.start:
            raise ValueError("end must be on or after start.")
        return self


class LandsatSearch(SpatialSearch):
    collection: Literal["landsat-c2l2-st", "landsat-c2l2-sr"]


class SentinelSearch(SpatialSearch):
    collection: Literal["sentinel-2-l1c", "sentinel-2-l2a"]


EarthdataName = Annotated[str, Field(pattern=r"^(GPM_3IMERG[A-Z0-9_]*|SRTM[A-Z0-9_]*)$", max_length=80)]


class EarthdataCollectionSearch(Record):
    short_name: EarthdataName
    page_num: int = Field(default=1, strict=True, ge=1)
    page_size: PageSize = 10


class EarthdataGranuleSearch(SpatialSearch):
    short_name: EarthdataName
    version: str = Field(min_length=1, max_length=32)
    page_num: int = Field(default=1, strict=True, ge=1)


class WorldPopSearch(Record):
    dataset: str = Field(pattern=r"^[A-Za-z][A-Za-z0-9_]*$", max_length=80)
    iso3: str | None = Field(default=None, pattern=r"^[A-Z]{3}$")
