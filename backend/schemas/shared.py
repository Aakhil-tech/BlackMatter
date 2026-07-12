from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr
from core.enums import CategoryType, DepartmentStatus


# --- Department ---

class DepartmentBase(BaseModel):
    name: str
    code: str
    head_id: int | None = None
    parent_department_id: int | None = None
    status: DepartmentStatus = DepartmentStatus.ACTIVE


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentRead(DepartmentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    employee_count: int
    created_at: datetime


# --- User ---

class UserBase(BaseModel):
    name: str
    email: EmailStr
    department_id: int | None = None
    total_xp: int = 0
    total_points: int = 0


class UserCreate(UserBase):
    pass


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# --- Category ---

class CategoryBase(BaseModel):
    name: str
    type: CategoryType
    status: DepartmentStatus = DepartmentStatus.ACTIVE


class CategoryCreate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
