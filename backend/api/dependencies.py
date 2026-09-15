from typing import Annotated

from fastapi import Depends, Path, Request

from backend.database.queries import Queries

AreaId = Annotated[str, Path(min_length=1, max_length=128)]
CityId = Annotated[str, Path(min_length=1, max_length=128)]


def get_queries(request: Request) -> Queries:
    return request.app.state.queries


Repository = Annotated[Queries, Depends(get_queries)]
