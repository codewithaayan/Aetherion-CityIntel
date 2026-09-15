import asyncio
from pathlib import Path

from backend.config.settings import Settings
from backend.database.connection import Database
from backend.errors import APIError


async def main():
    database = Database(Settings())
    await database.open()
    try:
        async with database.connection() as conn:
            async with conn.transaction():
                await conn.execute(Path(__file__).with_name("schema.sql").read_text())
    finally:
        await database.close()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except APIError as error:
        raise SystemExit(f"{error.code}: {error.message}") from None
    print("UrbanPulse schema created. No data was added.")
