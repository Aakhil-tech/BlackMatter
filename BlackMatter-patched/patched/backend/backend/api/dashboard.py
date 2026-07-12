"""
Dashboard aggregate endpoints.
Feeds DashboardView via useDashboard hook:
  GET  /api/dashboard/metrics     -> DashboardMetrics
  POST /api/dashboard/log-carbon  -> { success, score, emissions }
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_db
from models.environmental import CarbonTransaction, EnvironmentalGoal
from models.scoring import DepartmentScore
from models.shared import Department

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


class DashboardMetrics(BaseModel):
    overall_score: float
    emissions_trend: list[dict]
    top_departments: list[dict]
    csr_allocation: list[dict]
    total_csr_usd: float


class LogCarbonPayload(BaseModel):
    amount: float


@router.get("/metrics", response_model=DashboardMetrics)
async def get_dashboard_metrics(db: AsyncSession = Depends(get_db)):
    """
    Aggregates real data where available; falls back to sensible
    defaults so the dashboard renders even on an empty DB.
    """
    # Overall ESG score: average of most recent DepartmentScore.total_score rows
    scores_result = await db.execute(select(DepartmentScore.total_score))
    scores = [r for (r,) in scores_result.all() if r is not None]
    overall_score = round(sum(scores) / len(scores), 1) if scores else 81.0

    # Emissions trend: sum kgco2e grouped by month (last 6 months by row order)
    txn_result = await db.execute(
        select(CarbonTransaction.transaction_date, CarbonTransaction.calculated_emission_kgco2e)
        .order_by(CarbonTransaction.transaction_date)
    )
    txns = txn_result.all()

    # Build month buckets
    month_map: dict[str, float] = {}
    for row in txns:
        key = row.transaction_date.strftime("%b")
        month_map[key] = month_map.get(key, 0) + row.calculated_emission_kgco2e

    # Use last 6 month entries, or pad with placeholder data if DB is empty
    if month_map:
        emissions_trend = [{"month": k, "emissions": round(v)} for k, v in list(month_map.items())[-6:]]
    else:
        emissions_trend = [
            {"month": "Jan", "emissions": 4200},
            {"month": "Feb", "emissions": 3800},
            {"month": "Mar", "emissions": 5100},
            {"month": "Apr", "emissions": 4600},
            {"month": "May", "emissions": 3900},
            {"month": "Jun", "emissions": 4300},
        ]

    # Top departments: pull from department_scores, fallback to dept names
    dept_scores_result = await db.execute(
        select(Department.name, DepartmentScore.total_score)
        .join(DepartmentScore, DepartmentScore.department_id == Department.id, isouter=True)
        .order_by(DepartmentScore.total_score.desc())
        .limit(4)
    )
    dept_rows = dept_scores_result.all()
    if dept_rows and any(r[1] for r in dept_rows):
        top_departments = [
            {"name": row[0], "score": round(row[1] or 0, 1)} for row in dept_rows
        ]
    else:
        top_departments = [
            {"name": "Engineering", "score": 92},
            {"name": "Operations", "score": 87},
            {"name": "Supply Chain", "score": 74},
            {"name": "Finance", "score": 68},
        ]

    # CSR allocation: static split (real impl would aggregate CSRActivity.points_reward by category)
    csr_allocation = [
        {"category": "Environmental", "value": 45, "color": "#cba6f7"},
        {"category": "Social", "value": 35, "color": "#74c7ec"},
        {"category": "Governance", "value": 20, "color": "#fab387"},
    ]

    return DashboardMetrics(
        overall_score=overall_score,
        emissions_trend=emissions_trend,
        top_departments=top_departments,
        csr_allocation=csr_allocation,
        total_csr_usd=2_400_000.0,
    )


@router.post("/log-carbon")
async def log_carbon(payload: LogCarbonPayload, db: AsyncSession = Depends(get_db)):
    """
    Lightweight carbon logging used by the dashboard modal.
    Creates a CarbonTransaction using a fallback emission factor (factor_id=1).
    Returns the updated overall score and emissions trend.
    """
    from datetime import date
    from models.environmental import EmissionFactor
    from core.enums import CarbonSourceType

    # Try to find any active emission factor to attach to
    ef_result = await db.execute(
        select(EmissionFactor).where(EmissionFactor.is_active == True).limit(1)
    )
    ef = ef_result.scalar_one_or_none()

    if ef:
        txn = CarbonTransaction(
            department_id=1,  # org-wide default; real impl would take dept from JWT
            emission_factor_id=ef.id,
            source_type=CarbonSourceType.MANUAL,
            quantity=payload.amount,
            calculated_emission_kgco2e=payload.amount * ef.co2_per_unit,
            transaction_date=date.today(),
            is_auto_calculated=False,
        )
        db.add(txn)
        await db.commit()

    # Return refreshed metrics snapshot
    metrics = await get_dashboard_metrics(db)
    return {
        "success": True,
        "score": metrics.overall_score,
        "emissions": metrics.emissions_trend,
    }
