"""
OWNER: shared / whoever's free after their domain is stable.

DepartmentScore is the aggregate output of all three pillars — it reads
from Environmental, Social, and Governance tables but doesn't belong to
any one of them. Computed by services/scoring_service.py, not written
to directly from route handlers.
"""
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base
from models.mixins import TimestampMixin


class DepartmentScore(Base, TimestampMixin):
    __tablename__ = "department_scores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), nullable=False)
    period_start: Mapped[date] = mapped_column(Date, nullable=False)
    period_end: Mapped[date] = mapped_column(Date, nullable=False)
    environmental_score: Mapped[float] = mapped_column(Float, default=0)
    social_score: Mapped[float] = mapped_column(Float, default=0)
    governance_score: Mapped[float] = mapped_column(Float, default=0)
    total_score: Mapped[float] = mapped_column(Float, default=0)
    calculated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
