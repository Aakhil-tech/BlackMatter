from datetime import date

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.environmental import CarbonTransaction, EmissionFactor


async def calculate_emission(
    db: AsyncSession, emission_factor_id: int, amount: float
) -> tuple[float, float]:
    """Returns (calculated_emissions, factor_value_snapshot).
    Raises ValueError if factor not found.
    """
    factor = await db.get(EmissionFactor, emission_factor_id)
    if factor is None:
        raise ValueError(f"EmissionFactor {emission_factor_id} not found")
    return round(amount * factor.factor_value, 4), factor.factor_value


async def get_department_carbon_total(
    db: AsyncSession, department_id: int, start: date, end: date
) -> float:
    """Sum calculated_emissions for a department within a date range.
    Feeds the Environmental Dashboard and scoring service.
    """
    result = await db.execute(
        select(func.sum(CarbonTransaction.calculated_emissions)).where(
            CarbonTransaction.department_id == department_id,
            CarbonTransaction.recorded_date >= start,
            CarbonTransaction.recorded_date <= end,
        )
    )
    return result.scalar() or 0.0


async def get_overdue_goals(db: AsyncSession) -> list:
    """Return all active goals past their deadline — feeds the dashboard."""
    from datetime import date as date_
    result = await db.execute(
        select(EmissionFactor).where(  # placeholder — replace with EnvironmentalGoal
        )
    )
    # TODO: wire to EnvironmentalGoal once scoring integration starts
    return []
