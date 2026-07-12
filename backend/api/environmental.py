from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_db
from models.environmental import CarbonTransaction, EmissionFactor, EnvironmentalGoal
from schemas.environmental import (
    CarbonTransactionCreate,
    CarbonTransactionRead,
    EmissionFactorCreate,
    EmissionFactorRead,
    EnvironmentalGoalCreate,
    EnvironmentalGoalRead,
)
from services import environmental_service

router = APIRouter(prefix="/environmental", tags=["Environmental"])


# --- Emission Factors ---

@router.post("/emission-factors", response_model=EmissionFactorRead, status_code=201)
async def create_emission_factor(payload: EmissionFactorCreate, db: AsyncSession = Depends(get_db)):
    factor = EmissionFactor(**payload.model_dump())
    db.add(factor)
    await db.commit()
    await db.refresh(factor)
    return factor


@router.get("/emission-factors", response_model=list[EmissionFactorRead])
async def list_emission_factors(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EmissionFactor))
    return result.scalars().all()


# --- Carbon Transactions ---

@router.post("/carbon-transactions", response_model=CarbonTransactionRead, status_code=201)
async def create_carbon_transaction(payload: CarbonTransactionCreate, db: AsyncSession = Depends(get_db)):
    try:
        calculated, factor_snapshot = await environmental_service.calculate_emission(
            db, payload.emission_factor_id, payload.amount
        )
    except ValueError as e:
        raise HTTPException(404, str(e))

    txn = CarbonTransaction(
        department_id=payload.department_id,
        emission_factor_id=payload.emission_factor_id,
        transaction_type=payload.transaction_type,
        description=payload.description,
        amount=payload.amount,
        calculated_emissions=calculated,
        emission_factor_used=factor_snapshot,
        recorded_date=payload.recorded_date,
    )
    db.add(txn)
    await db.commit()
    await db.refresh(txn)
    return txn


@router.get("/carbon-transactions", response_model=list[CarbonTransactionRead])
async def list_carbon_transactions(
    department_id: int | None = None, db: AsyncSession = Depends(get_db)
):
    query = select(CarbonTransaction)
    if department_id is not None:
        query = query.where(CarbonTransaction.department_id == department_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/departments/{department_id}/carbon-total")
async def get_department_carbon_total(
    department_id: int, start: date, end: date, db: AsyncSession = Depends(get_db)
):
    total = await environmental_service.get_department_carbon_total(db, department_id, start, end)
    return {"department_id": department_id, "total_calculated_emissions": total}


# --- Environmental Goals ---

@router.post("/goals", response_model=EnvironmentalGoalRead, status_code=201)
async def create_goal(payload: EnvironmentalGoalCreate, db: AsyncSession = Depends(get_db)):
    goal = EnvironmentalGoal(**payload.model_dump())
    db.add(goal)
    await db.commit()
    await db.refresh(goal)
    return goal


@router.get("/goals", response_model=list[EnvironmentalGoalRead])
async def list_goals(department_id: int | None = None, db: AsyncSession = Depends(get_db)):
    query = select(EnvironmentalGoal)
    if department_id is not None:
        query = query.where(EnvironmentalGoal.department_id == department_id)
    result = await db.execute(query)
    return result.scalars().all()
