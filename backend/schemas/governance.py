"""OWNER: Dev 1 — Governance schemas."""
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from core.enums import AuditStatus, ComplianceIssueStatus, PolicyStatus, Severity


class ESGPolicyBase(BaseModel):
    title: str
    description: str | None = None
    version: str = "1.0"
    effective_date: date
    document_url: str | None = None
    status: PolicyStatus = PolicyStatus.DRAFT


class ESGPolicyCreate(ESGPolicyBase):
    pass


class ESGPolicyRead(ESGPolicyBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class PolicyAcknowledgementCreate(BaseModel):
    policy_id: int
    employee_id: int


class PolicyAcknowledgementRead(PolicyAcknowledgementCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    acknowledged_at: datetime | None


class AuditBase(BaseModel):
    title: str
    department_id: int | None = None
    auditor: str
    scheduled_date: date
    status: AuditStatus = AuditStatus.SCHEDULED
    findings_summary: str | None = None


class AuditCreate(AuditBase):
    pass


class AuditRead(AuditBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    completed_date: date | None


class ComplianceIssueBase(BaseModel):
    audit_id: int | None = None
    department_id: int | None = None
    severity: Severity
    description: str
    owner_employee_id: int  # required — Section 8 business rule
    due_date: date          # required — Section 8 business rule


class ComplianceIssueCreate(ComplianceIssueBase):
    pass


class ComplianceIssueRead(ComplianceIssueBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    status: ComplianceIssueStatus
    resolved_date: date | None
    is_overdue: bool = False  # computed in the service layer, not stored
