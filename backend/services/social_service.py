"""OWNER: Dev 2 | Social business logic."""
from datetime import date
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.enums import ApprovalStatus
from models.social import EmployeeParticipation
from models.settings import ESGConfig
from services.notification_service import notify

async def approve_participation(db: AsyncSession, participation: EmployeeParticipation, approval_status: ApprovalStatus) -> EmployeeParticipation:
    """Approves participation, checks evidence rules, awards points, and notifies."""

    # 1. Fetch ESG Config for evidence requirements
    config_result = await db.execute(select(ESGConfig))
    config = config_result.scalars().first()

    # 2. Evidence Check
    if config and config.evidence_required_enabled and approval_status == ApprovalStatus.APPROVED:
        if not participation.proof_file_url:
            raise ValueError("Proof of participation is required for approval based on current ESG settings.")

    # 3. Update Status
    participation.approval_status = approval_status

    if approval_status == ApprovalStatus.APPROVED:
        # Eager load activity and employee to ensure we have access to their attributes
        await db.refresh(participation, ["activity", "employee"])

        participation.completion_date = date.today()
        participation.points_earned = participation.activity.points_reward

        # Credit user points
        participation.employee.total_points += participation.points_earned

    # 4. Commit transaction
    await db.commit()
    await db.refresh(participation)

    # 5. Fire Notification
    await notify(
        db=db,
        employee_id=participation.employee_id,
        type="CSR Activity Update",
        message=f"Your CSR participation was marked as {approval_status.value}."
    )

    return participation
