from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_db
from models.governance import Audit, ComplianceIssue, ESGPolicy, PolicyAcknowledgement
from schemas.governance import (
    AuditCreate, AuditRead,
    ComplianceIssueCreate, ComplianceIssueRead,
    ESGPolicyCreate, ESGPolicyRead,
    PolicyAcknowledgementCreate, PolicyAcknowledgementRead,
)
from services import governance_service

router = APIRouter(prefix="/governance", tags=["Governance"])


# --- ESG Policies ---

@router.post("/policies", response_model=ESGPolicyRead, status_code=201)
async def create_policy(payload: ESGPolicyCreate, db: AsyncSession = Depends(get_db)):
    policy = ESGPolicy(**payload.model_dump())
    db.add(policy)
    await db.commit()
    await db.refresh(policy)
    return policy


@router.get("/policies", response_model=list[ESGPolicyRead])
async def list_policies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ESGPolicy))
    return result.scalars().all()


@router.post("/policies/acknowledge", response_model=PolicyAcknowledgementRead, status_code=201)
async def acknowledge_policy(payload: PolicyAcknowledgementCreate, db: AsyncSession = Depends(get_db)):
    ack = PolicyAcknowledgement(**payload.model_dump(), acknowledged_date=datetime.utcnow())
    db.add(ack)
    await db.commit()
    await db.refresh(ack)
    return ack


# --- Audits ---

@router.post("/audits", response_model=AuditRead, status_code=201)
async def create_audit(payload: AuditCreate, db: AsyncSession = Depends(get_db)):
    audit = Audit(**payload.model_dump())
    db.add(audit)
    await db.commit()
    await db.refresh(audit)
    return audit


@router.get("/audits", response_model=list[AuditRead])
async def list_audits(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Audit))
    return result.scalars().all()


# --- Compliance Issues ---

@router.post("/compliance-issues", response_model=ComplianceIssueRead, status_code=201)
async def create_compliance_issue(payload: ComplianceIssueCreate, db: AsyncSession = Depends(get_db)):
    issue = ComplianceIssue(**payload.model_dump())
    db.add(issue)
    await db.commit()
    await db.refresh(issue)
    # TODO: fire notification here once notification_service is ready
    result = ComplianceIssueRead.model_validate(issue)
    result.is_overdue = governance_service.is_issue_overdue(issue)
    return result


@router.get("/compliance-issues", response_model=list[ComplianceIssueRead])
async def list_compliance_issues(
    department_id: int | None = None, db: AsyncSession = Depends(get_db)
):
    query = select(ComplianceIssue)
    if department_id is not None:
        query = query.where(ComplianceIssue.audit_id == department_id)
    result = await db.execute(query)
    issues = result.scalars().all()
    out = []
    for issue in issues:
        r = ComplianceIssueRead.model_validate(issue)
        r.is_overdue = governance_service.is_issue_overdue(issue)
        out.append(r)
    return out


@router.get("/compliance-issues/overdue", response_model=list[ComplianceIssueRead])
async def list_overdue_issues(db: AsyncSession = Depends(get_db)):
    issues = await governance_service.get_overdue_issues(db)
    out = []
    for issue in issues:
        r = ComplianceIssueRead.model_validate(issue)
        r.is_overdue = True
        out.append(r)
    return out
