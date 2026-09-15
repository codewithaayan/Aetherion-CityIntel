from pydantic import AwareDatetime, model_validator

from backend.models.common import Identifier, Number, Record


class ScenarioValues(Record):
    # Owners must supply all fields, using null for unsupported interventions.
    # No units, ranges, coefficients or default changes are chosen here.
    tree_change: Number | None
    drainage_change: Number | None
    cool_roof_change: Number | None
    traffic_change: Number | None
    projected_heat: Number | None
    projected_flood: Number | None
    projected_green: Number | None
    projected_overall: Number | None

    @model_validator(mode="after")
    def some_projection_available(self):
        projections = (self.projected_heat, self.projected_flood,
                       self.projected_green, self.projected_overall)
        if all(value is None for value in projections):
            raise ValueError("No scenario projections were supplied.")
        return self


class Scenario(ScenarioValues):
    id: Identifier
    area_id: Identifier
    created_at: AwareDatetime
