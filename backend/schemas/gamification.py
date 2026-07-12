"""OWNER: Dev 2 — Gamification schemas."""
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from core.enums import ApprovalStatus, ChallengeDifficulty, ChallengeStatus, RedemptionStatus, RewardStatus


class ChallengeBase(BaseModel):
    title: str
    category_id: int
    description: str | None = None
    xp_reward: int = 0
    difficulty: ChallengeDifficulty = ChallengeDifficulty.EASY
    evidence_required: bool = False
    deadline: date | None = None
    department_id: int | None = None


class ChallengeCreate(ChallengeBase):
    pass


class ChallengeRead(ChallengeBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    status: ChallengeStatus


class ChallengeStatusUpdate(BaseModel):
    """Dedicated endpoint body for lifecycle moves (Draft -> Active -> Under
    Review -> Completed, or Archived at any point). Validate the transition
    in the service layer, not just accept any enum value blindly."""
    status: ChallengeStatus


class ChallengeParticipationCreate(BaseModel):
    challenge_id: int
    employee_id: int
    progress: int = 0
    proof_url: str | None = None


class ChallengeParticipationRead(ChallengeParticipationCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    approval_status: ApprovalStatus
    xp_awarded: int
    completed_at: datetime | None


class ChallengeParticipationApprove(BaseModel):
    approval_status: ApprovalStatus


class BadgeBase(BaseModel):
    name: str
    description: str | None = None
    unlock_rule: str
    icon: str | None = None


class BadgeCreate(BadgeBase):
    pass


class BadgeRead(BadgeBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class RewardBase(BaseModel):
    name: str
    description: str | None = None
    points_required: int
    stock: int = 0
    status: RewardStatus = RewardStatus.ACTIVE


class RewardCreate(RewardBase):
    pass


class RewardRead(RewardBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class RewardRedemptionCreate(BaseModel):
    employee_id: int
    reward_id: int


class RewardRedemptionRead(RewardRedemptionCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    points_spent: int
    redeemed_at: datetime
    status: RedemptionStatus


class LeaderboardEntry(BaseModel):
    """Read-only projection, not tied to a single table — built by the
    service layer from Employee.xp_total."""
    employee_id: int
    employee_name: str
    department_name: str | None
    xp_total: int
    rank: int
