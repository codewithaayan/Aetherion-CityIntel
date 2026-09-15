from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, AwareDatetime

Identifier = Annotated[str, Field(min_length=1, max_length=128, strict=True)]
Number = Annotated[float, Field(strict=True, allow_inf_nan=False)]


class Record(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False, revalidate_instances="always")


class Metadata(Record):
    # These are source dates, never the time the backend served a request.
    updated: AwareDatetime | None = None
    data_sources: list[str] | None = None
