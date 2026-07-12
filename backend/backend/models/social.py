"""
OWNER: Dev 2 — Social module.

CSRActivity, EmployeeParticipation, plus DiversityMetric and
TrainingRecord (the brief lists "Diversity Metrics" and "Training
Completion" as features but doesn't give a schema for them — these are
a reasonable starting point, adjust fields as your actual data needs
become clear).
This is the only models file you should be editing for Social work.
"""
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from core.enums import ApprovalStatus
from models.mixins import TimestampMixin


class CSRActivity(Base, TimestampMixin):
    __tablename__ = "csr_activities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)
    points_reward: Mapped[int] = mapped_column(Integer, default=0)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="active")


class EmployeeParticipation(Base, TimestampMixin):
    """Tracks employee involvement in CSR Activities only (not Challenges —
    that's ChallengeParticipation in gamification.py)."""
    __tablename__ = "employee_participations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    activity_id: Mapped[int] = mapped_column(ForeignKey("csr_activities.id"), nullable=False)
    proof_url: Mapped[str | None] = mapped_column(String(300), nullable=True)
    approval_status: Mapped[ApprovalStatus] = mapped_column(default=ApprovalStatus.PENDING)
    points_earned: Mapped[int] = mapped_column(Integer, default=0)
    completion_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    approved_by_employee_id: Mapped[int | None] = mapped_column(ForeignKey("employees.id"), nullable=True)

    activity: Mapped["CSRActivity"] = relationship("CSRActivity")


class DiversityMetric(Base, TimestampMixin):
    __tablename__ = "diversity_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), nullable=False)
    metric_name: Mapped[str] = mapped_column(String(80), nullable=False)  # e.g. "gender_ratio"
    metric_value: Mapped[float] = mapped_column(Float, nullable=False)
    recorded_date: Mapped[date] = mapped_column(Date, nullable=False)


class TrainingRecord(Base, TimestampMixin):
    __tablename__ = "training_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    training_name: Mapped[str] = mapped_column(String(150), nullable=False)
    completed_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="in_progress")
