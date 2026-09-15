from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: SecretStr | None = None
    cors_origins: list[str] = ["http://localhost:3000"]
    allowed_hosts: list[str] = ["localhost", "127.0.0.1"]
    database_timeout_seconds: float = Field(default=5, gt=0, le=60)
    database_pool_size: int = Field(default=5, ge=1, le=20)
    provider_timeout_seconds: float = Field(default=30, gt=0, le=120)
    cache_ttl_seconds: float = Field(default=30, ge=0, le=3600)
    cache_max_entries: int = Field(default=128, ge=1, le=10000)
    max_request_bytes: int = Field(default=65536, ge=1024, le=1048576)
    team_components_factory: str = ""
    external_timeout_seconds: float = Field(default=30, gt=0, le=120)
    external_max_response_bytes: int = Field(default=2097152, ge=1024, le=16777216)
    external_cache_ttl_seconds: float = Field(default=900, ge=0, le=86400)
    external_cache_max_entries: int = Field(default=32, ge=1, le=128)
    external_min_interval_seconds: float = Field(default=1, ge=0.1, le=60)

    @field_validator("database_url", mode="before")
    @classmethod
    def empty_url(cls, value):
        return None if value == "" else value

    @field_validator("cors_origins", "allowed_hosts")
    @classmethod
    def explicit_access(cls, values):
        if not values or any("*" in value or not value.strip() for value in values):
            raise ValueError("Use explicit origins and hostnames; wildcards are disabled.")
        return values
