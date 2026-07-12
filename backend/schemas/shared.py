"""
OWNER: shared. Schemas for Department, Employee, Category.
"""
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from core.enums import CategoryType, DepartmentStatus, EmployeeStatus


class DepartmentBase(BaseModel):
    name: str
    code: str
    head_employee_id: int | None = None
    parent_department_id: int | None = None
    status: DepartmentStatus = DepartmentStatus.ACTIVE


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentRead(DepartmentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    employee_count: int
    created_at: datetime


class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    department_id: int | None = None
    role: str = "employee"
    status: EmployeeStatus = EmployeeStatus.ACTIVE


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeRead(EmployeeBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    xp_total: int
    points_balance: int
    created_at: datetime


class CategoryBase(BaseModel):
    name: str
    type: CategoryType
    status: DepartmentStatus = DepartmentStatus.ACTIVE


class CategoryCreate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
