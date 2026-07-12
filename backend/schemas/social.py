"""OWNER: Dev 2 — Social schemas."""
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from core.enums import ApprovalStatus


class CSRActivityBase(BaseModel):
    title: str
    description: str | None = None
    category_id: int
    department_id: int | None = None
    points_reward: int = 0
    start_date: date
    end_date: date | None = None
    status: str = "active"


class CSRActivityCreate(CSRActivityBase):
    pass


class CSRActivityRead(CSRActivityBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class EmployeeParticipationBase(BaseModel):
    employee_id: int
    activity_id: int
    proof_url: str | None = None


class EmployeeParticipationCreate(EmployeeParticipationBase):
    pass


class EmployeeParticipationRead(EmployeeParticipationBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    approval_status: ApprovalStatus
    points_earned: int
    completion_date: date | None
    approved_by_employee_id: int | None


class EmployeeParticipationApprove(BaseModel):
    """Body for the approve/reject action endpoint."""
    approval_status: ApprovalStatus
    approved_by_employee_id: int


class DiversityMetricCreate(BaseModel):
    department_id: int
    metric_name: str
    metric_value: float
    recorded_date: date


class DiversityMetricRead(DiversityMetricCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


class TrainingRecordCreate(BaseModel):
    employee_id: int
    training_name: str
    completed_date: date | None = None
    status: str = "in_progress"


class TrainingRecordRead(TrainingRecordCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
