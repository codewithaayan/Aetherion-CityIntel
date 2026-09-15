import asyncio
from contextlib import asynccontextmanager

import asyncpg

from backend.config.settings import Settings
from backend.errors import APIError, unavailable


class Database:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.pool = None

    async def open(self):
        if self.settings.database_url:
            # min_size=0 keeps startup usable when the database is temporarily down.
            try:
                self.pool = await self.create_pool()
            except (ValueError, asyncpg.InterfaceError):
                raise RuntimeError("DATABASE_URL is not a valid PostgreSQL connection string.") from None

    async def create_pool(self):
        return await asyncpg.create_pool(
            self.settings.database_url.get_secret_value(),
            min_size=0,
            max_size=self.settings.database_pool_size,
            timeout=self.settings.database_timeout_seconds,
            command_timeout=self.settings.database_timeout_seconds,
            server_settings={
                "application_name": "urbanpulse-backend",
                "statement_timeout": str(int(self.settings.database_timeout_seconds * 1000)),
            },
        )

    async def close(self):
        if self.pool is not None:
            try:
                async with asyncio.timeout(self.settings.database_timeout_seconds):
                    await self.pool.close()
            except TimeoutError:
                self.pool.terminate()

    @asynccontextmanager
    async def connection(self):
        if self.pool is None:
            raise unavailable("database_not_configured", "The team database is not configured.")
        try:
            async with self.pool.acquire(timeout=self.settings.database_timeout_seconds) as conn:
                yield conn
        except APIError:
            raise
        except (asyncpg.PostgresError, asyncpg.InterfaceError, OSError, TimeoutError):
            # Database exceptions can contain connection details and submitted values.
            raise unavailable("database_unavailable", "The database request could not be completed.") from None
