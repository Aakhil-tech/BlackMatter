"""
OWNER: shared.

DepartmentScore — aggregated ESG score per department per period.
Recreated to satisfy imports in services/scoring_service.py and
api/scoring.py.
"""
from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class DepartmentScore(Base):
    __tablename__ = "department_scores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id", ondelete="CASCADE"), nullable=False, index=True
    )
    period_start: Mapped[date] = mapped_column(Date, nullable=False)
    period_end: Mapped[date] = mapped_column(Date, nullable=False)
    environmental_score: Mapped[float] = mapped_column(Float, default=0)
    social_score: Mapped[float] = mapped_column(Float, default=0)
    governance_score: Mapped[float] = mapped_column(Float, default=0)
    total_score: Mapped[float] = mapped_column(Float, default=0)
    calculated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
