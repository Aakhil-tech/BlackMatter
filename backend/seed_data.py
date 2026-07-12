import asyncio
from datetime import date, datetime

from sqlalchemy import select

from core.database import AsyncSessionLocal, Base, engine
from core.enums import AuditStatus, CategoryType, CarbonSourceType, ComplianceIssueStatus, Severity
from models.core import Category, Department, User
from models.environmental import CarbonTransaction, EmissionFactor, EnvironmentalGoal
from models.governance import Audit, ComplianceIssue, ESGPolicy, PolicyAcknowledgement
from models.gamification import Badge, Challenge, Reward  # noqa: F401
from models.social import CSRActivity, EmployeeParticipation  # noqa: F401
from core.security import get_password_hash


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:

        # Guard — skip if already seeded
        result = await db.execute(select(Department))
        if result.scalars().first():
            print("Already seeded — skipping.")
            return

        # ── Departments ──────────────────────────────────────────────
        ops       = Department(name="Operations", code="OPS",  employee_count=0)
        logistics = Department(name="Logistics",  code="LOG",  employee_count=0)
        corporate = Department(name="Corporate",  code="CORP", employee_count=0)
        facilities= Department(name="Facilities", code="FAC",  employee_count=0)
        db.add_all([ops, logistics, corporate, facilities])
        await db.flush()

        # ── Users ────────────────────────────────────────────────────
        users = [
            User(name="Asha Menon",   email="asha@ecosphere.test",   department_id=ops.id,        total_xp=120, total_points=120, hashed_password=get_password_hash("password123")),
            User(name="Rahul Varma",  email="rahul@ecosphere.test",  department_id=logistics.id,  total_xp=80,  total_points=80,  hashed_password=get_password_hash("password123")),
            User(name="Divya Nair",   email="divya@ecosphere.test",  department_id=corporate.id,  total_xp=200, total_points=200, hashed_password=get_password_hash("password123")),
            User(name="Arjun Pillai", email="arjun@ecosphere.test",  department_id=facilities.id, total_xp=40,  total_points=40,  hashed_password=get_password_hash("password123")),
        ]
        db.add_all(users)
        await db.flush()

        ops.employee_count       = 1
        logistics.employee_count = 1
        corporate.employee_count = 1
        facilities.employee_count= 1

        # ── Categories ───────────────────────────────────────────────
        categories = [
            Category(name="Tree Plantation", type=CategoryType.CSR_ACTIVITY),
            Category(name="Blood Donation",  type=CategoryType.CSR_ACTIVITY),
            Category(name="Energy Saving",   type=CategoryType.CHALLENGE),
            Category(name="Waste Reduction", type=CategoryType.CHALLENGE),
        ]
        db.add_all(categories)
        await db.flush()

        # ── CSR Activities (Social tab) ──────────────────────────────
        csr_cat = categories[0]  # Tree Plantation
        blood_cat = categories[1]
        activities = [
            CSRActivity(title="Tree Plantation Drive", category_id=csr_cat.id,
                        description="Plant 500 trees in the city outskirts.",
                        date=date(2026, 3, 15), points_reward=50),
            CSRActivity(title="Blood Donation Camp", category_id=blood_cat.id,
                        description="Company-wide blood donation event.",
                        date=date(2026, 4, 20), points_reward=30),
        ]
        db.add_all(activities)
        await db.flush()

        # A couple of participations so the Approvals queue isn't empty
        parts = [
            EmployeeParticipation(employee_id=users[1].id, activity_id=activities[0].id, points_earned=0),
            EmployeeParticipation(employee_id=users[2].id, activity_id=activities[1].id, points_earned=0),
        ]
        db.add_all(parts)

        # ── Challenges (Gamification tab) ────────────────────────────
        chal_cat = categories[2]  # Energy Saving
        waste_cat = categories[3]
        challenges = [
            Challenge(title="Zero Waste Week", category_id=waste_cat.id,
                      description="Reduce office waste to under 1kg per employee.",
                      xp_reward=250, deadline=date(2026, 12, 31)),
            Challenge(title="Renewable Upgrade", category_id=chal_cat.id,
                      description="Activate solar panels on the operations bay.",
                      xp_reward=500, deadline=date(2026, 11, 30)),
        ]
        db.add_all(challenges)


        # ── Emission Factors ─────────────────────────────────────────
        factors = [
            EmissionFactor(transaction_type=CarbonSourceType.FLEET,
                           factor_value=2.68,    unit="kgCO2e/litre"),
            EmissionFactor(transaction_type=CarbonSourceType.MANUFACTURING,
                           factor_value=0.0004,  unit="kgCO2e/kWh"),
            EmissionFactor(transaction_type=CarbonSourceType.EXPENSE,
                           factor_value=0.00022, unit="kgCO2e/mile"),
            EmissionFactor(transaction_type=CarbonSourceType.PURCHASE,
                           factor_value=0.5,     unit="kgCO2e/kg"),
        ]
        db.add_all(factors)
        await db.flush()

        # ── Carbon Transactions ──────────────────────────────────────
        txns = [
            CarbonTransaction(
                department_id=ops.id,
                emission_factor_id=factors[1].id,
                transaction_type=CarbonSourceType.MANUFACTURING,
                description="Main plant assembly line",
                amount=120000,
                calculated_emissions=round(120000 * factors[1].factor_value, 4),
                emission_factor_used=factors[1].factor_value,
                recorded_date=date(2026, 1, 15),
            ),
            CarbonTransaction(
                department_id=logistics.id,
                emission_factor_id=factors[0].id,
                transaction_type=CarbonSourceType.FLEET,
                description="Fleet delivery fuel",
                amount=4500,
                calculated_emissions=round(4500 * factors[0].factor_value, 4),
                emission_factor_used=factors[0].factor_value,
                recorded_date=date(2026, 2, 10),
            ),
            CarbonTransaction(
                department_id=corporate.id,
                emission_factor_id=factors[2].id,
                transaction_type=CarbonSourceType.EXPENSE,
                description="Executive travel",
                amount=85000,
                calculated_emissions=round(85000 * factors[2].factor_value, 4),
                emission_factor_used=factors[2].factor_value,
                recorded_date=date(2026, 4, 12),
            ),
        ]
        db.add_all(txns)

        # ── Environmental Goals ──────────────────────────────────────
        goals = [
            EnvironmentalGoal(department_id=ops.id,
                              target_metric="kgCO2e", target_value=400.0,
                              deadline=date(2026, 12, 31), status="active"),
            EnvironmentalGoal(department_id=logistics.id,
                              target_metric="kgCO2e", target_value=300.0,
                              deadline=date(2026, 12, 31), status="active"),
        ]
        db.add_all(goals)

        # ── ESG Policies ─────────────────────────────────────────────
        policies = [
            ESGPolicy(title="Anti-Bribery & Corruption Policy",
                      description="Annual certification of anti-money laundering protocols.",
                      version="1.0", active_date=date(2026, 1, 1)),
            ESGPolicy(title="Data Privacy Policy",
                      description="GDPR and global data handler access guidelines.",
                      version="2.1", active_date=date(2026, 1, 1)),
        ]
        db.add_all(policies)
        await db.flush()

        # ── Policy Acknowledgements ──────────────────────────────────
        acks = [
            PolicyAcknowledgement(employee_id=users[0].id, policy_id=policies[0].id,
                                  acknowledged_date=datetime(2026, 1, 10)),
            PolicyAcknowledgement(employee_id=users[1].id, policy_id=policies[0].id,
                                  acknowledged_date=datetime(2026, 1, 12)),
        ]
        db.add_all(acks)

        # ── Audits ───────────────────────────────────────────────────
        audits = [
            Audit(title="Scope 1 & 2 Emissions Audit", auditor_name="Marcus Vance",
                  audit_date=date(2026, 8, 15), status=AuditStatus.IN_PROGRESS),
            Audit(title="Factory Health & Safety Audit", auditor_name="Danielle Kross",
                  audit_date=date(2026, 7, 28), status=AuditStatus.SCHEDULED),
        ]
        db.add_all(audits)
        await db.flush()

        # ── Compliance Issues ────────────────────────────────────────
        issues = [
            ComplianceIssue(
                audit_id=audits[1].id,
                owner_id=users[3].id,
                severity=Severity.HIGH,
                description="Factory ventilation recertification overdue.",
                due_date=date(2026, 7, 28),
                status=ComplianceIssueStatus.OPEN,
            ),
            ComplianceIssue(
                audit_id=audits[0].id,
                owner_id=users[1].id,
                severity=Severity.MEDIUM,
                description="Anomalous carbon log variance on fleet reports.",
                due_date=date(2026, 8, 30),
                status=ComplianceIssueStatus.OPEN,
            ),
        ]
        db.add_all(issues)

        await db.commit()
        print("Seed complete:")
        print(f"  4 departments, {len(users)} users, {len(categories)} categories")
        print(f"  {len(factors)} emission factors, {len(txns)} carbon transactions")
        print(f"  {len(goals)} goals, {len(policies)} policies, "
              f"{len(audits)} audits, {len(issues)} compliance issues")


if __name__ == "__main__":
    asyncio.run(seed())
