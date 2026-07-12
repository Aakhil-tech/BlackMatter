"""
OWNER: Dev 2 — Gamification business logic.

This file has the most cross-cutting logic in the whole gamification
domain — badge auto-award and reward redemption both touch
Employee.xp_total / Employee.points_balance, which are shared columns.
Coordinate with Dev 1 if you need to change how those are read elsewhere.
"""
from datetime import datetime

from sqlalchemy.orm import Session

from models.gamification import Badge, ChallengeParticipation, EmployeeBadge, Reward, RewardRedemption
from models.shared import Employee


def award_xp(db: Session, employee: Employee, xp_amount: int) -> Employee:
    """TODO (Dev 2): credit XP to an employee (e.g. on Challenge
    Participation approval) and immediately call check_and_award_badges()
    afterwards so unlocks happen the moment the threshold is crossed,
    not on some later poll.
    """
    raise NotImplementedError


def check_and_award_badges(db: Session, employee: Employee) -> list[Badge]:
    """TODO (Dev 2): implement Badge Auto-Award (Section 8, gated by
    ESGConfig.badge_auto_award_enabled).

    Badge.unlock_rule is a plain string like "xp_total>=500" or
    "completed_challenges>=5" — decide on a small fixed vocabulary of
    metrics (xp_total is the easy one, since it's already on Employee;
    completed_challenges needs a COUNT query against
    ChallengeParticipation) and a tiny parser. Don't reach for a generic
    eval() on the rule string — parse it explicitly.

    For every badge whose rule now passes and that the employee doesn't
    already have (check EmployeeBadge), insert an EmployeeBadge row and
    fire a "badge_unlocked" notification (Section 8 requirement).
    Return the list of newly-awarded badges to the caller.
    """
    raise NotImplementedError


def redeem_reward(db: Session, employee: Employee, reward: Reward) -> RewardRedemption:
    """TODO (Dev 2): implement Reward Redemption (Section 8, in-scope,
    not optional).

    Checks required before creating the RewardRedemption row:
    - reward.status is ACTIVE
    - reward.stock > 0 (decrement on success)
    - employee.points_balance >= reward.points_required (deduct on success)
    Raise a clear ValueError for each failure case so the route handler
    can turn it into a 400 with a useful message — don't let this fail
    as an unhandled exception.
    """
    raise NotImplementedError
