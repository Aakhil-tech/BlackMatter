"""
Populate a few departments, employees, and categories so the frontend
team isn't staring at empty tables on day one. Run with:

    python seed.py

Safe to re-run — it checks for existing rows first.
"""
from datetime import date

from core.database import Base, SessionLocal, engine
from models.shared import Category, Department, Employee

# Import every model module so create_all sees all tables — same reason
# as in main.py.
from models import environmental, gamification, governance, scoring, settings, social  # noqa: F401
from core.enums import CategoryType

Base.metadata.create_all(bind=engine)

db = SessionLocal()

if db.query(Department).count() == 0:
    engineering = Department(name="Engineering", code="ENG", employee_count=0)
    operations = Department(name="Operations", code="OPS", employee_count=0)
    db.add_all([engineering, operations])
    db.commit()
    db.refresh(engineering)
    db.refresh(operations)

    employees = [
        Employee(name="Asha Menon", email="asha@ecosphere.test", department_id=engineering.id, role="manager"),
        Employee(name="Rahul Varma", email="rahul@ecosphere.test", department_id=engineering.id),
        Employee(name="Divya Nair", email="divya@ecosphere.test", department_id=operations.id, role="manager"),
    ]
    db.add_all(employees)

    engineering.employee_count = 2
    operations.employee_count = 1

    categories = [
        Category(name="Tree Plantation", type=CategoryType.CSR_ACTIVITY),
        Category(name="Blood Donation", type=CategoryType.CSR_ACTIVITY),
        Category(name="Energy Saving", type=CategoryType.CHALLENGE),
        Category(name="Waste Reduction", type=CategoryType.CHALLENGE),
    ]
    db.add_all(categories)

    db.commit()
    print("Seeded 2 departments, 3 employees, 4 categories.")
else:
    print("Departments already exist — skipping seed.")

db.close()
