"""OWNER: shared. Scoring + config schemas."""
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class DepartmentScoreRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    department_id: int
    period_start: date
    period_end: date
    environmental_score: float
    social_score: float
    governance_score: float
    total_score: float
    calculated_at: datetime


class ESGConfigRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    environmental_weight: float
    social_weight: float
    governance_weight: float
    auto_emission_calc_enabled: bool
    evidence_required_enabled: bool
    badge_auto_award_enabled: bool
    notify_in_app: bool
    notify_email: bool


class ESGConfigUpdate(BaseModel):
    """All optional — PATCH-style partial update."""
    environmental_weight: float | None = None
    social_weight: float | None = None
    governance_weight: float | None = None
    auto_emission_calc_enabled: bool | None = None
    evidence_required_enabled: bool | None = None
    badge_auto_award_enabled: bool | None = None
    notify_in_app: bool | None = None
    notify_email: bool | None = None


class NotificationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    employee_id: int | None
    type: str
    message: str
    related_entity_type: str | None
    related_entity_id: int | None
    is_read: bool
    created_at: datetime
