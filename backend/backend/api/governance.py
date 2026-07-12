"""OWNER: Dev 1 — Governance routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.deps import get_db
from models.governance import Audit, ComplianceIssue, ESGPolicy, PolicyAcknowledgement
from schemas.governance import (
    AuditCreate,
    AuditRead,
    ComplianceIssueCreate,
    ComplianceIssueRead,
    ESGPolicyCreate,
    ESGPolicyRead,
    PolicyAcknowledgementCreate,
    PolicyAcknowledgementRead,
)
from services import governance_service

router = APIRouter(prefix="/governance", tags=["Governance"])


# --- ESG Policies -----------------------------------------------------

@router.post("/policies", response_model=ESGPolicyRead, status_code=201)
def create_policy(payload: ESGPolicyCreate, db: Session = Depends(get_db)):
    policy = ESGPolicy(**payload.model_dump())
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy


@router.get("/policies", response_model=list[ESGPolicyRead])
def list_policies(db: Session = Depends(get_db)):
    return db.query(ESGPolicy).all()


@router.post("/policies/acknowledge", response_model=PolicyAcknowledgementRead, status_code=201)
def acknowledge_policy(payload: PolicyAcknowledgementCreate, db: Session = Depends(get_db)):
    from datetime import datetime

    ack = PolicyAcknowledgement(**payload.model_dump(), acknowledged_at=datetime.utcnow())
    db.add(ack)
    db.commit()
    db.refresh(ack)
    return ack


# --- Audits ---------------------------------------------------------------

@router.post("/audits", response_model=AuditRead, status_code=201)
def create_audit(payload: AuditCreate, db: Session = Depends(get_db)):
    audit = Audit(**payload.model_dump())
    db.add(audit)
    db.commit()
    db.refresh(audit)
    return audit


@router.get("/audits", response_model=list[AuditRead])
def list_audits(department_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(Audit)
    if department_id is not None:
        query = query.filter(Audit.department_id == department_id)
    return query.all()


# --- Compliance Issues ------------------------------------------------

@router.post("/compliance-issues", response_model=ComplianceIssueRead, status_code=201)
def create_compliance_issue(payload: ComplianceIssueCreate, db: Session = Depends(get_db)):
    issue = ComplianceIssue(**payload.model_dump())
    db.add(issue)
    db.commit()
    db.refresh(issue)
    # TODO (Dev 1): fire notify() here — "new compliance issue raised" is
    # one of the four required notification triggers (Section 8).
    result = ComplianceIssueRead.model_validate(issue)
    result.is_overdue = governance_service.is_issue_overdue(issue)
    return result


@router.get("/compliance-issues", response_model=list[ComplianceIssueRead])
def list_compliance_issues(department_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(ComplianceIssue)
    if department_id is not None:
        query = query.filter(ComplianceIssue.department_id == department_id)
    issues = query.all()
    results = []
    for issue in issues:
        r = ComplianceIssueRead.model_validate(issue)
        r.is_overdue = governance_service.is_issue_overdue(issue)
        results.append(r)
    return results
