from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from core.enums import AuditStatus, ComplianceIssueStatus, Severity

if TYPE_CHECKING:
    from models.core import User


class ESGPolicy(Base):
    __tablename__ = "esg_policies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    version: Mapped[str] = mapped_column(String(20), default="1.0")
    active_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    acknowledgements: Mapped[list[PolicyAcknowledgement]] = relationship(
        "PolicyAcknowledgement", back_populates="policy"
    )


class PolicyAcknowledgement(Base):
    __tablename__ = "policy_acknowledgements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    policy_id: Mapped[int] = mapped_column(
        ForeignKey("esg_policies.id", ondelete="CASCADE"), nullable=False, index=True
    )
    acknowledged_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    employee: Mapped[User] = relationship(
        "User", back_populates="policy_acknowledgements"
    )
    policy: Mapped[ESGPolicy] = relationship(
        "ESGPolicy", back_populates="acknowledgements"
    )


class Audit(Base):
    __tablename__ = "audits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    auditor_name: Mapped[str] = mapped_column(String(120), nullable=False)
    audit_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    status: Mapped[AuditStatus] = mapped_column(
        Enum(AuditStatus), default=AuditStatus.SCHEDULED, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    compliance_issues: Mapped[list[ComplianceIssue]] = relationship(
        "ComplianceIssue", back_populates="audit"
    )


class ComplianceIssue(Base):
    __tablename__ = "compliance_issues"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    audit_id: Mapped[int | None] = mapped_column(
        ForeignKey("audits.id", ondelete="SET NULL"), nullable=True, index=True
    )
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    severity: Mapped[Severity] = mapped_column(
        Enum(Severity), nullable=False, index=True
    )
    description: Mapped[str] = mapped_column(String(1000), nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    status: Mapped[ComplianceIssueStatus] = mapped_column(
        Enum(ComplianceIssueStatus), default=ComplianceIssueStatus.OPEN, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    audit: Mapped[Audit | None] = relationship(
        "Audit", back_populates="compliance_issues"
    )
    owner: Mapped[User] = relationship(
        "User", back_populates="owned_issues"
    )
