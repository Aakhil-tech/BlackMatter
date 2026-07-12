"""
OWNER: Dev 1 — Governance business logic.
"""
from datetime import date

from sqlalchemy.orm import Session

from core.enums import ComplianceIssueStatus
from models.governance import ComplianceIssue


def is_issue_overdue(issue: ComplianceIssue, as_of: date | None = None) -> bool:
    """Section 8 rule: an OPEN issue past its due_date should be flagged.
    Deliberately NOT a stored column — always computed, so it can't go
    stale. Called from the read schema serialization in api/governance.py.
    """
    as_of = as_of or date.today()
    return issue.status == ComplianceIssueStatus.OPEN and issue.due_date < as_of


def get_overdue_issues(db: Session) -> list[ComplianceIssue]:
    """TODO (Dev 1): query all OPEN issues with due_date < today. This is
    what should feed the Notification System's overdue alert — call
    services.notification_service.notify() for each newly-overdue issue
    from wherever you decide to run this check (a scheduled job, or on
    every relevant GET request — pick one and be consistent).
    """
    raise NotImplementedError
