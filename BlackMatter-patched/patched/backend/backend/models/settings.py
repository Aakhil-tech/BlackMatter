"""App-wide config singleton and notification log."""
from datetime import datetime
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base


class ESGConfig(Base):
    """Singleton config row — always read via _get_or_create_config()."""
    __tablename__ = "esg_config"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    environmental_weight: Mapped[float] = mapped_column(Float, default=0.4)
    social_weight: Mapped[float] = mapped_column(Float, default=0.3)
    governance_weight: Mapped[float] = mapped_column(Float, default=0.3)
    auto_emission_calc_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    evidence_required_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    badge_auto_award_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    notify_in_app: Mapped[bool] = mapped_column(Boolean, default=True)
    notify_email: Mapped[bool] = mapped_column(Boolean, default=False)


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[int | None] = mapped_column(
        ForeignKey("employees.id", ondelete="SET NULL"), nullable=True, index=True
    )
    type: Mapped[str] = mapped_column(String(60), nullable=False)
    message: Mapped[str] = mapped_column(String(500), nullable=False)
    related_entity_type: Mapped[str | None] = mapped_column(String(60), nullable=True)
    related_entity_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
