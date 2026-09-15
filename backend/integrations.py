import asyncio
import json
from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from importlib import import_module

from pydantic import BaseModel, ValidationError

from backend.errors import APIError, unavailable


@dataclass
class JSONComponent:
    """Owners supply strict Pydantic schemas and an asynchronous adapter."""

    request_model: type[BaseModel]
    response_model: type[BaseModel]
    run: Callable[[dict, dict], Awaitable[dict]]


@dataclass
class Components:
    risk: Callable[[dict], Awaitable[dict]] | None = None
    layers: Callable[[str, str], Awaitable[dict]] | None = None
    simulator: JSONComponent | None = None
    ai: JSONComponent | None = None


def load_components(factory_path: str) -> Components:
    if not factory_path:
        return Components()
    try:
        module_name, function_name = factory_path.split(":", 1)
        factory = getattr(import_module(module_name), function_name)
        components = factory()
        if not isinstance(components, Components):
            raise TypeError
        for component in (components.simulator, components.ai):
            if component:
                for model in (component.request_model, component.response_model):
                    if not issubclass(model, BaseModel) or model.model_config.get("extra") != "forbid":
                        raise TypeError
        return components
    except Exception:
        raise RuntimeError("TEAM_COMPONENTS_FACTORY must load valid team adapters and schemas.") from None


async def call_component(function, *args, timeout: float, output_model):
    try:
        async with asyncio.timeout(timeout):
            output = await function(*args)
        if not isinstance(output, dict):
            raise ValueError("Expected a structured JSON object.")
        # Reject NaN/infinity and non-JSON output before schema validation.
        encoded = json.dumps(output, allow_nan=False)
        return output_model.model_validate_json(encoded).model_dump(mode="json")
    except APIError:
        # Adapters can explicitly report missing data, without leaking their details.
        raise unavailable("component_unavailable", "The team component reports unavailable inputs.") from None
    except TimeoutError:
        raise APIError(504, "component_timeout", "The team component did not finish in time.") from None
    except (ValidationError, TypeError, ValueError):
        raise APIError(502, "invalid_component_output", "The team component returned invalid structured data.") from None
    except Exception:
        raise APIError(502, "component_failed", "The team component could not complete the request.") from None


def validate_payload(component: JSONComponent, payload: dict):
    try:
        return component.request_model.model_validate_json(
            json.dumps(payload, allow_nan=False)
        ).model_dump(mode="json")
    except (ValidationError, ValueError, TypeError):
        raise APIError(422, "invalid_component_request", "The request does not match the owner's schema.") from None
