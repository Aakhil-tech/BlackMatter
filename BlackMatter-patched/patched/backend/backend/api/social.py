"""OWNER: Dev 2 — Social routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.deps import get_db
from models.social import CSRActivity, DiversityMetric, EmployeeParticipation, TrainingRecord
from schemas.social import (
    CSRActivityCreate,
    CSRActivityRead,
    DiversityMetricCreate,
    DiversityMetricRead,
    EmployeeParticipationApprove,
    EmployeeParticipationCreate,
    EmployeeParticipationRead,
    TrainingRecordCreate,
    TrainingRecordRead,
)
from services import social_service

router = APIRouter(prefix="/social", tags=["Social"])


# --- CSR Activities ---------------------------------------------------

@router.post("/activities", response_model=CSRActivityRead, status_code=201)
def create_activity(payload: CSRActivityCreate, db: Session = Depends(get_db)):
    activity = CSRActivity(**payload.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity


@router.get("/activities", response_model=list[CSRActivityRead])
def list_activities(department_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(CSRActivity)
    if department_id is not None:
        query = query.filter(CSRActivity.department_id == department_id)
    return query.all()


# --- Employee Participation ------------------------------------------

@router.post("/participations", response_model=EmployeeParticipationRead, status_code=201)
def create_participation(payload: EmployeeParticipationCreate, db: Session = Depends(get_db)):
    participation = EmployeeParticipation(**payload.model_dump())
    db.add(participation)
    db.commit()
    db.refresh(participation)
    return participation


@router.get("/participations", response_model=list[EmployeeParticipationRead])
def list_participations(employee_id: int | None = None, activity_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(EmployeeParticipation)
    if employee_id is not None:
        query = query.filter(EmployeeParticipation.employee_id == employee_id)
    if activity_id is not None:
        query = query.filter(EmployeeParticipation.activity_id == activity_id)
    return query.all()


@router.post("/participations/{participation_id}/approve", response_model=EmployeeParticipationRead)
def approve_participation(participation_id: int, payload: EmployeeParticipationApprove, db: Session = Depends(get_db)):
    """TODO (Dev 2): wired to a NotImplementedError stub — fill in
    services.social_service.approve_participation()."""
    participation = db.get(EmployeeParticipation, participation_id)
    if not participation:
        raise HTTPException(404, "Participation not found")
    return social_service.approve_participation(
        db, participation, payload.approval_status, payload.approved_by_employee_id
    )


# --- Diversity + Training ------------------------------------------------

@router.post("/diversity-metrics", response_model=DiversityMetricRead, status_code=201)
def create_diversity_metric(payload: DiversityMetricCreate, db: Session = Depends(get_db)):
    metric = DiversityMetric(**payload.model_dump())
    db.add(metric)
    db.commit()
    db.refresh(metric)
    return metric


@router.get("/diversity-metrics", response_model=list[DiversityMetricRead])
def list_diversity_metrics(department_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(DiversityMetric)
    if department_id is not None:
        query = query.filter(DiversityMetric.department_id == department_id)
    return query.all()


@router.post("/training-records", response_model=TrainingRecordRead, status_code=201)
def create_training_record(payload: TrainingRecordCreate, db: Session = Depends(get_db)):
    record = TrainingRecord(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/training-records", response_model=list[TrainingRecordRead])
def list_training_records(employee_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(TrainingRecord)
    if employee_id is not None:
        query = query.filter(TrainingRecord.employee_id == employee_id)
    return query.all()
