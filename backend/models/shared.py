"""
OWNER: shared — built once, don't fork this into domain files.

Department, Employee, Category are used by all four modules
(Environmental / Social / Governance / Gamification). If you need a new
field on Employee for your domain (e.g. a diversity attribute, a role
flag), add it here and flag it in standup, don't create a second
Employee-like table.
"""
from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from core.enums import CategoryType, DepartmentStatus, EmployeeStatus
from models.mixins import TimestampMixin


class Department(Base, TimestampMixin):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    head_employee_id: Mapped[int | None] = mapped_column(ForeignKey("employees.id"), nullable=True)
    parent_department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)
    employee_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[DepartmentStatus] = mapped_column(default=DepartmentStatus.ACTIVE)

    employees: Mapped[list["Employee"]] = relationship(
        "Employee", back_populates="department", foreign_keys="Employee.department_id"
    )


class Employee(Base, TimestampMixin):
    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)
    role: Mapped[str] = mapped_column(String(50), default="employee")  # employee / manager / admin
    status: Mapped[EmployeeStatus] = mapped_column(default=EmployeeStatus.ACTIVE)

    # Gamification aggregates live here (not in a separate table) because
    # they're read by Reward Redemption, Leaderboards, and Badge
    # Auto-Award alike — updated by services/gamification_service.py,
    # never written to directly from a route handler.
    xp_total: Mapped[int] = mapped_column(Integer, default=0)
    points_balance: Mapped[int] = mapped_column(Integer, default=0)

    department: Mapped["Department"] = relationship(
        "Department", back_populates="employees", foreign_keys=[department_id]
    )


class Category(Base, TimestampMixin):
    """Shared category values used by CSR Activities and Challenges alike."""
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    type: Mapped[CategoryType] = mapped_column(nullable=False)
    status: Mapped[DepartmentStatus] = mapped_column(default=DepartmentStatus.ACTIVE)
