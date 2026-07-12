from __future__ import annotations
from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from core.database import Base
from core.enums import CategoryType, DepartmentStatus

if TYPE_CHECKING:
    from models.environmental import CarbonTransaction, EnvironmentalGoal
    from models.social import CSRActivity, EmployeeParticipation
    from models.governance import ComplianceIssue, PolicyAcknowledgement
    from models.gamification import ChallengeParticipation, UserBadge


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    parent_department_id: Mapped[int | None] = mapped_column(
        ForeignKey("departments.id", ondelete="SET NULL"), nullable=True, index=True
    )
    head_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    employee_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[DepartmentStatus] = mapped_column(
        Enum(DepartmentStatus), default=DepartmentStatus.ACTIVE, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    parent: Mapped[Department | None] = relationship(
        "Department", remote_side="Department.id", back_populates="children"
    )
    children: Mapped[list[Department]] = relationship(
        "Department", back_populates="parent"
    )
    head: Mapped[User | None] = relationship(
        "User", foreign_keys=[head_id], back_populates="headed_departments"
    )
    users: Mapped[list[User]] = relationship(
        "User", foreign_keys="User.department_id", back_populates="department"
    )
    carbon_transactions: Mapped[list[CarbonTransaction]] = relationship(
        "CarbonTransaction", back_populates="department"
    )
    environmental_goals: Mapped[list[EnvironmentalGoal]] = relationship(
        "EnvironmentalGoal", back_populates="department"
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(160), unique=True, nullable=False, index=True)
    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("departments.id", ondelete="SET NULL"), nullable=True, index=True
    )
    total_xp: Mapped[int] = mapped_column(Integer, default=0)
    total_points: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    department: Mapped[Department | None] = relationship(
        "Department", foreign_keys=[department_id], back_populates="users"
    )
    headed_departments: Mapped[list[Department]] = relationship(
        "Department", foreign_keys="Department.head_id", back_populates="head"
    )
    participations: Mapped[list[EmployeeParticipation]] = relationship(
        "EmployeeParticipation", back_populates="employee"
    )
    policy_acknowledgements: Mapped[list[PolicyAcknowledgement]] = relationship(
        "PolicyAcknowledgement", back_populates="employee"
    )
    owned_issues: Mapped[list[ComplianceIssue]] = relationship(
        "ComplianceIssue", back_populates="owner"
    )
    challenge_participations: Mapped[list[ChallengeParticipation]] = relationship(
        "ChallengeParticipation", back_populates="employee"
    )
    badges: Mapped[list[UserBadge]] = relationship(
        "UserBadge", back_populates="employee"
    )


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    type: Mapped[CategoryType] = mapped_column(
        Enum(CategoryType), nullable=False, index=True
    )
    status: Mapped[DepartmentStatus] = mapped_column(
        Enum(DepartmentStatus), default=DepartmentStatus.ACTIVE, index=True
    )

    csr_activities: Mapped[list[CSRActivity]] = relationship(
        "CSRActivity", back_populates="category"
    )
    challenges: Mapped[list[Challenge]] = relationship(
        "Challenge", back_populates="category"
    )
