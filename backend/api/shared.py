"""
OWNER: shared — Departments, Users, Categories.
Fully async, uses models.core (not the deleted models.shared).
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_db
from models.core import Category, Department, User
from schemas.shared import (
    CategoryCreate, CategoryRead,
    DepartmentCreate, DepartmentRead,
    UserCreate, UserRead,
)

router = APIRouter(tags=["Shared"])


# --- Departments ---

@router.post("/departments", response_model=DepartmentRead, status_code=201)
async def create_department(payload: DepartmentCreate, db: AsyncSession = Depends(get_db)):
    dept = Department(**payload.model_dump())
    db.add(dept)
    await db.commit()
    await db.refresh(dept)
    return dept


@router.get("/departments", response_model=list[DepartmentRead])
async def list_departments(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Department))
    return result.scalars().all()


@router.get("/departments/{department_id}", response_model=DepartmentRead)
async def get_department(department_id: int, db: AsyncSession = Depends(get_db)):
    dept = await db.get(Department, department_id)
    if not dept:
        raise HTTPException(404, "Department not found")
    return dept


# --- Users ---

@router.post("/users", response_model=UserRead, status_code=201)
async def create_user(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    user = User(**payload.model_dump())
    db.add(user)
    await db.commit()
    await db.refresh(user)
    if user.department_id:
        dept = await db.get(Department, user.department_id)
        if dept:
            dept.employee_count += 1
            await db.commit()
    return user


@router.get("/users", response_model=list[UserRead])
async def list_users(department_id: int | None = None, db: AsyncSession = Depends(get_db)):
    query = select(User)
    if department_id is not None:
        query = query.where(User.department_id == department_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/users/{user_id}", response_model=UserRead)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return user


# --- Categories ---

@router.post("/categories", response_model=CategoryRead, status_code=201)
async def create_category(payload: CategoryCreate, db: AsyncSession = Depends(get_db)):
    category = Category(**payload.model_dump())
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


@router.get("/categories", response_model=list[CategoryRead])
async def list_categories(type: str | None = None, db: AsyncSession = Depends(get_db)):
    query = select(Category)
    if type is not None:
        query = query.where(Category.type == type)
    result = await db.execute(query)
    return result.scalars().all()
