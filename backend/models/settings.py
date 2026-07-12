"""
OWNER: shared.

ESGConfig: org-wide toggles from Section 8 (weights, auto-emission-calc,
evidence-required, badge-auto-award). Treated as a singleton — one row.
Notification: fired by every domain's service layer on the four required
events (compliance issue raised, CSR/Challenge approval, policy
acknowledgement reminders, badge unlocks). Don't build a second
notification table per domain — everyone writes into this one.
"""
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base
from models.mixins import TimestampMixin


class ESGConfig(Base, TimestampMixin):
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


class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[int | None] = mapped_column(ForeignKey("employees.id"), nullable=True)  # null = broadcast
    type: Mapped[str] = mapped_column(String(60), nullable=False)  # e.g. "compliance_issue_raised", "badge_unlocked"
    message: Mapped[str] = mapped_column(String(500), nullable=False)
    related_entity_type: Mapped[str | None] = mapped_column(String(60), nullable=True)
    related_entity_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
