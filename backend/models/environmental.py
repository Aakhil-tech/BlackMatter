from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from core.enums import CarbonSourceType

if TYPE_CHECKING:
    from models.core import Department


class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    transaction_type: Mapped[CarbonSourceType] = mapped_column(
        Enum(CarbonSourceType), nullable=False, index=True
    )
    factor_value: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String(40), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    carbon_transactions: Mapped[list[CarbonTransaction]] = relationship(
        "CarbonTransaction", back_populates="emission_factor"
    )


class CarbonTransaction(Base):
    __tablename__ = "carbon_transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id", ondelete="CASCADE"), nullable=False, index=True
    )
    emission_factor_id: Mapped[int] = mapped_column(
        ForeignKey("emission_factors.id", ondelete="RESTRICT"), nullable=False
    )
    transaction_type: Mapped[CarbonSourceType] = mapped_column(
        Enum(CarbonSourceType), nullable=False, index=True
    )
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    calculated_emissions: Mapped[float] = mapped_column(Float, nullable=False)
    emission_factor_used: Mapped[float] = mapped_column(Float, nullable=False)
    recorded_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    department: Mapped[Department] = relationship(
        "Department", back_populates="carbon_transactions"
    )
    emission_factor: Mapped[EmissionFactor] = relationship(
        "EmissionFactor", back_populates="carbon_transactions"
    )


class EnvironmentalGoal(Base):
    __tablename__ = "environmental_goals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("departments.id", ondelete="SET NULL"), nullable=True, index=True
    )
    target_metric: Mapped[str] = mapped_column(String(80), nullable=False)
    target_value: Mapped[float] = mapped_column(Float, nullable=False)
    deadline: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="active", index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    department: Mapped[Department | None] = relationship(
        "Department", back_populates="environmental_goals"
    )
