"""
OWNER: shared.

ESGConfig — org-wide singleton toggles (Section 8). Recreated to satisfy
imports in services/social_service.py, services/notification_service.py,
services/scoring_service.py, and api/settings.py.

Notification — in-app notifications fired by domain services.
"""
from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class ESGConfig(Base):
    __tablename__ = "esg_config"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    environmental_weight: Mapped[float] = mapped_column(Float, default=0.4)
    social_weight: Mapped[float] = mapped_column(Float, default=0.3)
    governance_weight: Mapped[float] = mapped_column(Float, default=0.3)

    auto_emission_calc_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    evidence_required_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    badge_auto_award_enabled: Mapped[bool] = mapped_column(Boolean, default=True)

    notify_in_app: Mapped[bool] = mapped_column(Boolean, default=True)
    notify_email: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )
    type: Mapped[str] = mapped_column(String(80), nullable=False)
    message: Mapped[str] = mapped_column(String(500), nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
