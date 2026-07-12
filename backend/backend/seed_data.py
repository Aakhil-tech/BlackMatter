"""
Seeder scaffold. Run manually after the stack is up:
    docker compose exec api python seed_data.py
"""
import asyncio

from sqlalchemy import select

from core.database import AsyncSessionLocal, Base, engine

# TODO: once models are migrated to the async session pattern (the model
# classes themselves don't change, only how they're queried), uncomment:
# from models.environmental import EmissionFactor
# from models.shared import Employee


async def is_database_empty(db) -> bool:
    """TODO: replace with a real check once EmissionFactor is imported."""
    return True


async def seed_emission_factors(db):
    """TODO: insert hardcoded EmissionFactor rows here."""
    pass


async def seed_mock_users(db):
    """TODO: insert hardcoded Employee/Department rows here."""
    pass


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        if not await is_database_empty(db):
            print("Database already has data — skipping seed.")
            return
        await seed_emission_factors(db)
        await seed_mock_users(db)
        await db.commit()
        print("Seed complete.")


if __name__ == "__main__":
    asyncio.run(seed())
