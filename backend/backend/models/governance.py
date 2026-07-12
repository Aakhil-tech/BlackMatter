"""
OWNER: Dev 1 — Governance module.

ESGPolicy, PolicyAcknowledgement, Audit, ComplianceIssue.
This is the only models file you should be editing for Governance work.
"""
from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from core.enums import AuditStatus, ComplianceIssueStatus, PolicyStatus, Severity
from models.mixins import TimestampMixin


class ESGPolicy(Base, TimestampMixin):
    __tablename__ = "esg_policies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    version: Mapped[str] = mapped_column(String(20), default="1.0")
    effective_date: Mapped[date] = mapped_column(Date, nullable=False)
    document_url: Mapped[str | None] = mapped_column(String(300), nullable=True)
    status: Mapped[PolicyStatus] = mapped_column(default=PolicyStatus.DRAFT)


class PolicyAcknowledgement(Base, TimestampMixin):
    __tablename__ = "policy_acknowledgements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    policy_id: Mapped[int] = mapped_column(ForeignKey("esg_policies.id"), nullable=False)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    acknowledged_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    policy: Mapped["ESGPolicy"] = relationship("ESGPolicy")


class Audit(Base, TimestampMixin):
    __tablename__ = "audits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)
    auditor: Mapped[str] = mapped_column(String(120), nullable=False)
    scheduled_date: Mapped[date] = mapped_column(Date, nullable=False)
    completed_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[AuditStatus] = mapped_column(default=AuditStatus.SCHEDULED)
    findings_summary: Mapped[str | None] = mapped_column(String(1000), nullable=True)


class ComplianceIssue(Base, TimestampMixin):
    """Every issue must have an Owner + Due Date (Section 8 business rule) —
    enforce that in the schema/service layer, not just here."""
    __tablename__ = "compliance_issues"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    audit_id: Mapped[int | None] = mapped_column(ForeignKey("audits.id"), nullable=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)
    severity: Mapped[Severity] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False)
    owner_employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[ComplianceIssueStatus] = mapped_column(default=ComplianceIssueStatus.OPEN)
    resolved_date: Mapped[date | None] = mapped_column(Date, nullable=True)
