"""OWNER: Dev 2 | Social routes. Fully Async SQLAlchemy 2.0 implementation."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_db
from models.social import CSRActivity, EmployeeParticipation
from models.core import User
from schemas.social import (
    CSRActivityCreate,
    CSRActivityRead,
    EmployeeParticipationApprove,
    EmployeeParticipationCreate,
    EmployeeParticipationRead,
)
from services import social_service

router = APIRouter(prefix="/social", tags=["Social"])

# --- CSR Activities ---------------------------------------------------

@router.post("/activities", response_model=CSRActivityRead, status_code=status.HTTP_201_CREATED)
async def create_activity(payload: CSRActivityCreate, db: AsyncSession = Depends(get_db)):
    activity = CSRActivity(**payload.model_dump())
    db.add(activity)
    await db.commit()
    await db.refresh(activity)
    return activity

@router.get("/activities", response_model=list[CSRActivityRead])
async def list_activities(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CSRActivity))
    return result.scalars().all()

# --- Employee Participation -------------------------------------------

@router.post("/participations", response_model=EmployeeParticipationRead, status_code=status.HTTP_201_CREATED)
async def create_participation(payload: EmployeeParticipationCreate, db: AsyncSession = Depends(get_db)):
    participation = EmployeeParticipation(**payload.model_dump())
    db.add(participation)
    await db.commit()
    await db.refresh(participation)
    return participation

@router.get("/participations", response_model=list[EmployeeParticipationRead])
async def list_participations(employee_id: int | None = None, activity_id: int | None = None, db: AsyncSession = Depends(get_db)):
    query = select(EmployeeParticipation)
    if employee_id is not None:
        query = query.where(EmployeeParticipation.employee_id == employee_id)
    if activity_id is not None:
        query = query.where(EmployeeParticipation.activity_id == activity_id)

    result = await db.execute(query)
    return result.scalars().all()

@router.post("/participations/{participation_id}/approve", response_model=EmployeeParticipationRead)
async def approve_participation(participation_id: int, payload: EmployeeParticipationApprove, db: AsyncSession = Depends(get_db)):
    participation = await db.get(EmployeeParticipation, participation_id)
    if not participation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participation not found")

    try:
        return await social_service.approve_participation(
            db,
            participation,
            payload.approval_status
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
