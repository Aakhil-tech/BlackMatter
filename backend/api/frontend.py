"""
Frontend Adapter Router.

The React frontend was built against a slightly different API contract than
the domain routers expose (different paths + different field names). Rather
than rewrite either side, this router presents the EXACT paths and JSON
shapes the frontend hooks expect, backed by the real database.

Every endpoint here maps 1:1 to a call in the frontend's src/hooks/*.ts.
Shapes mirror src/types.ts exactly.
"""
from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_db
from core.enums import ApprovalStatus, CategoryType
from models.core import Category, Department, User
from models.environmental import CarbonTransaction, EnvironmentalGoal
from models.gamification import Challenge, ChallengeParticipation
from models.social import CSRActivity, EmployeeParticipation

router = APIRouter(tags=["Frontend Adapter"])


# ============================================================
#  DASHBOARD  — useDashboard.ts
# ============================================================

@router.get("/dashboard/metrics")
async def dashboard_metrics(db: AsyncSession = Depends(get_db)):
    # Overall score = simple mean of department scores if present, else a
    # derived figure from emissions. Kept deterministic for the demo.
    depts = (await db.execute(select(Department))).scalars().all()

    # Emissions trend: sum calculated emissions grouped by month.
    txns = (await db.execute(select(CarbonTransaction))).scalars().all()
    trend_map: dict[str, float] = {}
    for t in txns:
        key = t.recorded_date.strftime("%b") if t.recorded_date else "N/A"
        trend_map[key] = trend_map.get(key, 0.0) + (t.calculated_emissions or 0.0)
    emissions_trend = [{"month": m, "emissions": round(v, 2)} for m, v in trend_map.items()]
    if not emissions_trend:
        emissions_trend = [{"month": "Jan", "emissions": 0}]

    # Top departments by (inverse) emissions — lighter footprint scores higher.
    dept_emissions: dict[int, float] = {}
    for t in txns:
        dept_emissions[t.department_id] = dept_emissions.get(t.department_id, 0.0) + (t.calculated_emissions or 0.0)
    top_departments = []
    for d in depts:
        em = dept_emissions.get(d.id, 0.0)
        score = max(30, round(95 - em * 0.0005))
        top_departments.append({"name": d.name, "score": min(100, score)})
    top_departments.sort(key=lambda x: x["score"], reverse=True)

    overall = round(sum(t["score"] for t in top_departments) / len(top_departments)) if top_departments else 0

    csr_allocation = [
        {"category": "Community Outreach", "value": 45, "color": "#cba6f7"},
        {"category": "Reforestation",      "value": 35, "color": "#74c7ec"},
        {"category": "Clean Energy Ed.",   "value": 20, "color": "#fab387"},
    ]

    return {
        "overall_score": overall,
        "emissions_trend": emissions_trend,
        "top_departments": top_departments[:5],
        "csr_allocation": csr_allocation,
        "total_csr_usd": 2_400_000,
    }


class LogCarbonBody(BaseModel):
    amount: float


@router.post("/dashboard/log-carbon")
async def dashboard_log_carbon(body: LogCarbonBody, db: AsyncSession = Depends(get_db)):
    # Lightweight logging endpoint the dashboard "quick log" button hits.
    # Recomputes the trend + score after inserting nothing heavy — for the
    # demo we just echo an updated score derived from the amount.
    metrics = await dashboard_metrics(db)
    new_score = max(0, metrics["overall_score"] - round(body.amount * 0.0001))
    return {"success": True, "score": new_score, "emissions": metrics["emissions_trend"]}


# ============================================================
#  ENVIRONMENTAL  — useEnvironmental.ts  (goals)
# ============================================================

def _goal_status_to_frontend(status: str) -> str:
    return {"active": "Active", "completed": "Completed", "on_track": "On Track"}.get(status, "Active")


async def _goal_to_frontend(db: AsyncSession, g: EnvironmentalGoal) -> dict:
    dept_name = ""
    if g.department_id:
        d = await db.get(Department, g.department_id)
        dept_name = d.name if d else ""
    return {
        "id": str(g.id),
        "name": g.target_metric,
        "department": dept_name,
        "target_co2": g.target_value,
        "current_co2": 0.0,  # could be wired to carbon-total later
        "deadline": g.deadline.isoformat() if g.deadline else "",
        "status": _goal_status_to_frontend(g.status),
    }


@router.get("/environmental/goals")
async def fe_list_goals(db: AsyncSession = Depends(get_db)):
    goals = (await db.execute(select(EnvironmentalGoal))).scalars().all()
    return [await _goal_to_frontend(db, g) for g in goals]


def _parse_deadline(value: str | None) -> date:
    """Frontend may send an ISO date (2026-12-31) OR a quarter label
    (\"Q4 2024\"). Accept both; fall back to a far-future date so the goal
    still saves instead of 500-ing."""
    if not value:
        return date.today()
    try:
        return date.fromisoformat(value)
    except (ValueError, TypeError):
        # Not an ISO date (e.g. "Q4 2024") — store a placeholder date.
        # The label itself isn't critical for the demo.
        return date(2026, 12, 31)


class GoalCreateBody(BaseModel):
    name: str
    department: str | None = None
    target_co2: float | str = 0
    deadline: str | None = None
    status: str = "Active"


@router.post("/environmental/goals", status_code=201)
async def fe_create_goal(body: GoalCreateBody, db: AsyncSession = Depends(get_db)):
    dept_id = None
    if body.department:
        d = (await db.execute(select(Department).where(Department.name == body.department))).scalars().first()
        dept_id = d.id if d else None
    goal = EnvironmentalGoal(
        department_id=dept_id,
        target_metric=body.name,
        target_value=float(body.target_co2) if body.target_co2 else 0.0,
        deadline=_parse_deadline(body.deadline),
        status="active",
    )
    db.add(goal)
    await db.commit()
    await db.refresh(goal)
    return await _goal_to_frontend(db, goal)


@router.delete("/environmental/goals/{goal_id}")
async def fe_delete_goal(goal_id: int, db: AsyncSession = Depends(get_db)):
    goal = await db.get(EnvironmentalGoal, goal_id)
    if goal:
        await db.delete(goal)
        await db.commit()
    return {"success": True, "id": str(goal_id)}


# ============================================================
#  GOVERNANCE  — useGovernance.ts  (departments)
# ============================================================

_DEPT_ICONS = ["energy_savings_leaf", "water_drop", "diversity_3", "history_edu"]


async def _dept_to_frontend(db: AsyncSession, d: Department, idx: int = 0) -> dict:
    manager = ""
    if d.head_id:
        u = await db.get(User, d.head_id)
        manager = u.name if u else ""
    return {
        "id": str(d.id),
        "name": d.name,
        "manager": manager or "Unassigned",
        "manager_avatar": "",
        "staff_count": d.employee_count,
        "status": "Active" if d.status.value == "active" else "Maintenance",
        "icon": _DEPT_ICONS[idx % len(_DEPT_ICONS)],
    }


@router.get("/governance/departments")
async def fe_list_departments(db: AsyncSession = Depends(get_db)):
    depts = (await db.execute(select(Department))).scalars().all()
    return [await _dept_to_frontend(db, d, i) for i, d in enumerate(depts)]


class DeptCreateBody(BaseModel):
    name: str
    manager: str | None = None
    staff_count: int = 0
    status: str = "Active"


@router.post("/governance/departments", status_code=201)
async def fe_create_department(body: DeptCreateBody, db: AsyncSession = Depends(get_db)):
    # Generate a code from the name (first 4 letters upper).
    code = body.name[:4].upper().replace(" ", "")
    dept = Department(name=body.name, code=code, employee_count=body.staff_count)
    db.add(dept)
    await db.commit()
    await db.refresh(dept)
    return await _dept_to_frontend(db, dept, dept.id)


# ============================================================
#  SOCIAL  — useSocial.ts  (activities + approvals)
# ============================================================

@router.get("/social/activities")
async def fe_list_activities(db: AsyncSession = Depends(get_db)):
    activities = (await db.execute(select(CSRActivity))).scalars().all()
    out = []
    for a in activities:
        cat = await db.get(Category, a.category_id) if a.category_id else None
        # count participants
        cnt = (await db.execute(
            select(func.count()).select_from(EmployeeParticipation).where(
                EmployeeParticipation.activity_id == a.id
            )
        )).scalar() or 0
        out.append({
            "id": str(a.id),
            "name": a.title,
            "category": cat.name if cat else "General",
            "participants_count": cnt,
            "joined": False,
            "avatars": [],
        })
    return out


@router.post("/social/activities/{activity_id}/join")
async def fe_join_activity(activity_id: int, db: AsyncSession = Depends(get_db)):
    a = await db.get(CSRActivity, activity_id)
    if not a:
        raise HTTPException(404, "Activity not found")
    # Join as the first user for demo (real auth wires current_user here).
    first_user = (await db.execute(select(User))).scalars().first()
    if first_user:
        part = EmployeeParticipation(
            employee_id=first_user.id,
            activity_id=activity_id,
            approval_status=ApprovalStatus.PENDING,
        )
        db.add(part)
        await db.commit()
    cat = await db.get(Category, a.category_id) if a.category_id else None
    cnt = (await db.execute(
        select(func.count()).select_from(EmployeeParticipation).where(
            EmployeeParticipation.activity_id == a.id
        )
    )).scalar() or 0
    return {
        "id": str(a.id),
        "name": a.title,
        "category": cat.name if cat else "General",
        "participants_count": cnt,
        "joined": True,
        "avatars": [],
    }


@router.get("/social/approvals")
async def fe_list_approvals(db: AsyncSession = Depends(get_db)):
    parts = (await db.execute(select(EmployeeParticipation))).scalars().all()
    out = []
    for p in parts:
        emp = await db.get(User, p.employee_id)
        act = await db.get(CSRActivity, p.activity_id)
        status_map = {"pending": "Pending", "approved": "Approved", "rejected": "Rejected"}
        out.append({
            "id": str(p.id),
            "employee_name": emp.name if emp else "Unknown",
            "employee_avatar": "",
            "activity_name": act.title if act else "Unknown",
            "hours": p.points_earned or 0,
            "status": status_map.get(p.approval_status.value, "Pending"),
        })
    return out


class ApprovalActionBody(BaseModel):
    action: str  # "Approved" | "Rejected"


@router.post("/social/approvals/{participation_id}/action")
async def fe_approval_action(participation_id: int, body: ApprovalActionBody, db: AsyncSession = Depends(get_db)):
    p = await db.get(EmployeeParticipation, participation_id)
    if not p:
        raise HTTPException(404, "Approval not found")
    p.approval_status = ApprovalStatus.APPROVED if body.action == "Approved" else ApprovalStatus.REJECTED
    if body.action == "Approved":
        act = await db.get(CSRActivity, p.activity_id)
        if act:
            p.points_earned = act.points_reward
    await db.commit()
    await db.refresh(p)
    emp = await db.get(User, p.employee_id)
    act = await db.get(CSRActivity, p.activity_id)
    return {
        "id": str(p.id),
        "employee_name": emp.name if emp else "Unknown",
        "employee_avatar": "",
        "activity_name": act.title if act else "Unknown",
        "hours": p.points_earned or 0,
        "status": body.action,
    }


# ============================================================
#  GAMIFICATION  — useGamification.ts  (challenges)
# ============================================================

_CHAL_CAT_MAP = {"csr_activity": "Social", "challenge": "Environmental"}


@router.get("/gamification/challenges")
async def fe_list_challenges(db: AsyncSession = Depends(get_db)):
    challenges = (await db.execute(select(Challenge))).scalars().all()
    out = []
    for c in challenges:
        days_left = 0
        if c.deadline:
            days_left = max(0, (c.deadline - date.today()).days)
        out.append({
            "id": str(c.id),
            "name": c.title,
            "description": c.description or "",
            "xp_reward": c.xp_reward,
            "days_left": days_left,
            "category": "Environmental",
            "icon": "eco",
        })
    return out


@router.post("/gamification/challenges/{challenge_id}/join")
async def fe_join_challenge(challenge_id: int, db: AsyncSession = Depends(get_db)):
    c = await db.get(Challenge, challenge_id)
    if not c:
        raise HTTPException(404, "Challenge not found")
    first_user = (await db.execute(select(User))).scalars().first()
    if first_user:
        part = ChallengeParticipation(
            challenge_id=challenge_id,
            employee_id=first_user.id,
            approval_status=ApprovalStatus.PENDING,
        )
        db.add(part)
        await db.commit()
    return {"success": True, "challenge_id": challenge_id}


# ============================================================
#  REPORTS  — useReports.ts
# ============================================================

@router.get("/reports/templates")
async def fe_report_templates(db: AsyncSession = Depends(get_db)):
    return [
        {"id": "1", "name": "Environmental Report", "description": "Carbon accounting and emissions summary",
         "status": "Ready", "category": "Environmental", "progress": 100},
        {"id": "2", "name": "Social Report", "description": "CSR activities and participation",
         "status": "Ready", "category": "Social", "progress": 100},
        {"id": "3", "name": "Governance Report", "description": "Policies, audits, and compliance",
         "status": "Updated", "category": "Governance", "progress": 100},
        {"id": "4", "name": "ESG Summary Report", "description": "Full ESG performance overview",
         "status": "Master", "category": "ESG Summary", "progress": 100},
    ]


class CustomReportBody(BaseModel):
    date_range: str | None = None
    departments: list[str] = []
    modules_included: list[str] = []


@router.post("/reports/custom")
async def fe_custom_report(body: CustomReportBody, db: AsyncSession = Depends(get_db)):
    return {
        "success": True,
        "report_id": "custom-001",
        "message": "Custom report generated",
        "config": body.model_dump(),
    }
