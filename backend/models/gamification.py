"""
OWNER: Dev 2 — Gamification module.

Challenge, ChallengeParticipation, Badge, EmployeeBadge, Reward,
RewardRedemption.
This is the only models file you should be editing for Gamification work.
"""
from datetime import date, datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from core.enums import ApprovalStatus, ChallengeDifficulty, ChallengeStatus, RedemptionStatus, RewardStatus
from models.mixins import TimestampMixin


class Challenge(Base, TimestampMixin):
    __tablename__ = "challenges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    xp_reward: Mapped[int] = mapped_column(Integer, default=0)
    difficulty: Mapped[ChallengeDifficulty] = mapped_column(default=ChallengeDifficulty.EASY)
    evidence_required: Mapped[bool] = mapped_column(Boolean, default=False)
    deadline: Mapped[date | None] = mapped_column(nullable=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)
    status: Mapped[ChallengeStatus] = mapped_column(default=ChallengeStatus.DRAFT)


class ChallengeParticipation(Base, TimestampMixin):
    """Tracks employee progress within Challenges only (not CSR Activities)."""
    __tablename__ = "challenge_participations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    challenge_id: Mapped[int] = mapped_column(ForeignKey("challenges.id"), nullable=False)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    progress: Mapped[int] = mapped_column(Integer, default=0)  # 0-100
    proof_url: Mapped[str | None] = mapped_column(String(300), nullable=True)
    approval_status: Mapped[ApprovalStatus] = mapped_column(default=ApprovalStatus.PENDING)
    xp_awarded: Mapped[int] = mapped_column(Integer, default=0)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    challenge: Mapped["Challenge"] = relationship("Challenge")


class Badge(Base, TimestampMixin):
    __tablename__ = "badges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    # Kept as a simple string rule for now, e.g. "xp_total>=500" or
    # "completed_challenges>=5". services/gamification_service.py owns
    # parsing/evaluating this — see the TODO there before you build it out.
    unlock_rule: Mapped[str] = mapped_column(String(200), nullable=False)
    icon: Mapped[str | None] = mapped_column(String(300), nullable=True)


class EmployeeBadge(Base, TimestampMixin):
    """Join table: which employee has which badge, and when they got it."""
    __tablename__ = "employee_badges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    badge_id: Mapped[int] = mapped_column(ForeignKey("badges.id"), nullable=False)
    awarded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    badge: Mapped["Badge"] = relationship("Badge")


class Reward(Base, TimestampMixin):
    __tablename__ = "rewards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    points_required: Mapped[int] = mapped_column(Integer, nullable=False)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[RewardStatus] = mapped_column(default=RewardStatus.ACTIVE)


class RewardRedemption(Base, TimestampMixin):
    __tablename__ = "reward_redemptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    reward_id: Mapped[int] = mapped_column(ForeignKey("rewards.id"), nullable=False)
    points_spent: Mapped[int] = mapped_column(Integer, nullable=False)
    redeemed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[RedemptionStatus] = mapped_column(default=RedemptionStatus.COMPLETED)

    reward: Mapped["Reward"] = relationship("Reward")
