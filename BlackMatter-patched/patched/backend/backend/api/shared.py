"""
OWNER: shared. Departments, Employees, Categories — build this first,
before either domain router, so Dev 1/Dev 2 have real FKs to point at.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.deps import get_db
from models.shared import Category, Department, Employee
from schemas.shared import CategoryCreate, CategoryRead, DepartmentCreate, DepartmentRead, EmployeeCreate, EmployeeRead

router = APIRouter(tags=["Shared: Departments / Employees / Categories"])


# --- Departments ---------------------------------------------------------

@router.post("/departments", response_model=DepartmentRead, status_code=201)
def create_department(payload: DepartmentCreate, db: Session = Depends(get_db)):
    dept = Department(**payload.model_dump())
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return dept


@router.get("/departments", response_model=list[DepartmentRead])
def list_departments(db: Session = Depends(get_db)):
    return db.query(Department).all()


@router.get("/departments/{department_id}", response_model=DepartmentRead)
def get_department(department_id: int, db: Session = Depends(get_db)):
    dept = db.get(Department, department_id)
    if not dept:
        raise HTTPException(404, "Department not found")
    return dept


# --- Employees -------------------------------------------------------------

@router.post("/employees", response_model=EmployeeRead, status_code=201)
def create_employee(payload: EmployeeCreate, db: Session = Depends(get_db)):
    employee = Employee(**payload.model_dump())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    # Keep Department.employee_count in sync. TODO (shared): move this into
    # a service function if more places start mutating employee counts.
    if employee.department_id:
        dept = db.get(Department, employee.department_id)
        if dept:
            dept.employee_count += 1
            db.commit()
    return employee


@router.get("/employees", response_model=list[EmployeeRead])
def list_employees(department_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(Employee)
    if department_id is not None:
        query = query.filter(Employee.department_id == department_id)
    return query.all()


@router.get("/employees/{employee_id}", response_model=EmployeeRead)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.get(Employee, employee_id)
    if not employee:
        raise HTTPException(404, "Employee not found")
    return employee


# --- Categories --------------------------------------------------------

@router.post("/categories", response_model=CategoryRead, status_code=201)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db)):
    category = Category(**payload.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.get("/categories", response_model=list[CategoryRead])
def list_categories(type: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Category)
    if type is not None:
        query = query.filter(Category.type == type)
    return query.all()
