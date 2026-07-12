"""OWNER: Dev 1 — Environmental routes. Keep handlers thin; real logic
lives in services/environmental_service.py."""
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

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


# --- Emission Factors ------------------------------------------------------

@router.post("/emission-factors", response_model=EmissionFactorRead, status_code=201)
def create_emission_factor(payload: EmissionFactorCreate, db: Session = Depends(get_db)):
    factor = EmissionFactor(**payload.model_dump())
    db.add(factor)
    db.commit()
    db.refresh(factor)
    return factor


@router.get("/emission-factors", response_model=list[EmissionFactorRead])
def list_emission_factors(db: Session = Depends(get_db)):
    return db.query(EmissionFactor).all()


# --- Carbon Transactions ----------------------------------------------

@router.post("/carbon-transactions", response_model=CarbonTransactionRead, status_code=201)
def create_carbon_transaction(payload: CarbonTransactionCreate, db: Session = Depends(get_db)):
    try:
        emission = environmental_service.calculate_emission(db, payload.emission_factor_id, payload.quantity)
    except ValueError as e:
        raise HTTPException(404, str(e))
    txn = CarbonTransaction(**payload.model_dump(), calculated_emission_kgco2e=emission, is_auto_calculated=False)
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn


@router.get("/carbon-transactions", response_model=list[CarbonTransactionRead])
def list_carbon_transactions(department_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(CarbonTransaction)
    if department_id is not None:
        query = query.filter(CarbonTransaction.department_id == department_id)
    return query.all()


@router.get("/departments/{department_id}/carbon-total")
def get_department_carbon_total(
    department_id: int, start: date, end: date, db: Session = Depends(get_db)
):
    """TODO (Dev 1): wired to a NotImplementedError stub — fill in
    services.environmental_service.get_department_carbon_total()."""
    total = environmental_service.get_department_carbon_total(db, department_id, start, end)
    return {"department_id": department_id, "total_kgco2e": total}


# --- Environmental Goals -----------------------------------------------

@router.post("/goals", response_model=EnvironmentalGoalRead, status_code=201)
def create_goal(payload: EnvironmentalGoalCreate, db: Session = Depends(get_db)):
    goal = EnvironmentalGoal(**payload.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.get("/goals", response_model=list[EnvironmentalGoalRead])
def list_goals(department_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(EnvironmentalGoal)
    if department_id is not None:
        query = query.filter(EnvironmentalGoal.department_id == department_id)
    return query.all()

@router.delete("/goals/{goal_id}", status_code=204)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.get(EnvironmentalGoal, goal_id)
    if not goal:
        raise HTTPException(404, "Goal not found")
    db.delete(goal)
    db.commit()
