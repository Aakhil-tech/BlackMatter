from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from core.enums import ApprovalStatus

if TYPE_CHECKING:
    from models.core import Category, User


class CSRActivity(Base):
    __tablename__ = "csr_activities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    points_reward: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    category: Mapped[Category] = relationship(
        "Category", back_populates="csr_activities"
    )
    participations: Mapped[list[EmployeeParticipation]] = relationship(
        "EmployeeParticipation", back_populates="activity"
    )


class EmployeeParticipation(Base):
    __tablename__ = "employee_participations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    activity_id: Mapped[int] = mapped_column(
        ForeignKey("csr_activities.id", ondelete="CASCADE"), nullable=False, index=True
    )
    proof_file_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    approval_status: Mapped[ApprovalStatus] = mapped_column(
        Enum(ApprovalStatus), default=ApprovalStatus.PENDING, index=True
    )
    points_earned: Mapped[int] = mapped_column(Integer, default=0)
    completion_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    employee: Mapped[User] = relationship(
        "User", back_populates="participations"
    )
    activity: Mapped[CSRActivity] = relationship(
        "CSRActivity", back_populates="participations"
    )
