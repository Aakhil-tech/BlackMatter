"""
OWNER: Dev 1 — Environmental module.

EmissionFactor, CarbonTransaction, EnvironmentalGoal.
This is the only models file you should be editing for Environmental work.
"""
from datetime import date

from sqlalchemy import Boolean, Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from core.enums import CarbonSourceType
from models.mixins import TimestampMixin


class EmissionFactor(Base, TimestampMixin):
    """Carbon values used during calculations (e.g. kg CO2e per litre of diesel)."""
    __tablename__ = "emission_factors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    source_type: Mapped[CarbonSourceType] = mapped_column(nullable=False)
    unit: Mapped[str] = mapped_column(String(30), nullable=False)  # e.g. "litre", "kWh", "km"
    co2_per_unit: Mapped[float] = mapped_column(Float, nullable=False)
    effective_date: Mapped[date] = mapped_column(Date, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class CarbonTransaction(Base, TimestampMixin):
    """A single calculated emission event, tied to a department and an ERP source record."""
    __tablename__ = "carbon_transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), nullable=False)
    emission_factor_id: Mapped[int] = mapped_column(ForeignKey("emission_factors.id"), nullable=False)

    source_type: Mapped[CarbonSourceType] = mapped_column(nullable=False)
    source_reference_id: Mapped[str | None] = mapped_column(String(80), nullable=True)  # e.g. Purchase Order #

    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    calculated_emission_kgco2e: Mapped[float] = mapped_column(Float, nullable=False)
    transaction_date: Mapped[date] = mapped_column(Date, nullable=False)
    is_auto_calculated: Mapped[bool] = mapped_column(Boolean, default=False)

    emission_factor: Mapped["EmissionFactor"] = relationship("EmissionFactor")


class EnvironmentalGoal(Base, TimestampMixin):
    """A sustainability target, org-wide or scoped to a department."""
    __tablename__ = "environmental_goals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    target_metric: Mapped[str] = mapped_column(String(80), nullable=False)  # e.g. "kgCO2e"
    target_value: Mapped[float] = mapped_column(Float, nullable=False)
    current_value: Mapped[float] = mapped_column(Float, default=0)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="active")
