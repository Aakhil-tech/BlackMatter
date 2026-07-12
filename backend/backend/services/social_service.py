"""
OWNER: Dev 2 — Social business logic.
"""
from datetime import date, datetime

from sqlalchemy.orm import Session

from core.enums import ApprovalStatus
from models.shared import Employee
from models.social import CSRActivity, EmployeeParticipation


def approve_participation(
    db: Session, participation: EmployeeParticipation, approval_status: ApprovalStatus, approved_by_employee_id: int
) -> EmployeeParticipation:
    """TODO (Dev 2): implement the approval flow.

    Rules to enforce here (from Section 8):
    - If ESGConfig.evidence_required_enabled is True, refuse to approve
      without participation.proof_url set.
    - On APPROVED: set completion_date, award points_earned from the
      linked CSRActivity.points_reward, and credit Employee.points_balance.
    - On APPROVED or REJECTED: fire a notification via
      services.notification_service.notify() (Section 8: "CSR/Challenge
      approval decisions").
    """
    raise NotImplementedError
