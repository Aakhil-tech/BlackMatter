"""OWNER: Dev 2 | Gamification business logic."""
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from core.enums import ApprovalStatus
from models.core import User
from models.gamification import Badge, ChallengeParticipation, Reward, UserBadge
from services.notification_service import notify


async def redeem_reward(db: AsyncSession, user: User, reward: Reward) -> None:
    """Atomically decrements reward stock and user points."""
    # 1. Validation Constraints
    if reward.stock_status <= 0:
        raise ValueError(f"Reward '{reward.name}' is currently out of stock.")

    if user.total_points < reward.points_required:
        raise ValueError(f"Insufficient points. You need {reward.points_required} but have {user.total_points}.")

    # 2. Apply Decrements
    reward.stock_status -= 1
    user.total_points -= reward.points_required

    # 3. Atomic Commit
    await db.commit()
    await db.refresh(user)
    await db.refresh(reward)


async def award_xp(db: AsyncSession, user: User, xp_amount: int) -> User:
    """Credits XP to a user and immediately evaluates badge unlocks."""
    user.total_xp += xp_amount
    await check_and_award_badges(db, user)
    return user


async def check_and_award_badges(db: AsyncSession, user: User) -> list[Badge]:
    """Parses unlock rules (fixed vocab) and automatically awards eligible badges."""

    # 1. Fetch all available badges
    badges_result = await db.execute(select(Badge))
    all_badges = badges_result.scalars().all()

    # 2. Fetch user's currently owned badges to prevent duplicates
    user_badges_result = await db.execute(
        select(UserBadge).where(UserBadge.employee_id == user.id)
    )
    owned_badge_ids = {ub.badge_id for ub in user_badges_result.scalars().all()}

    # 3. Calculate metrics for rule evaluation
    completed_challenges_query = select(func.count(ChallengeParticipation.id)).where(
        ChallengeParticipation.employee_id == user.id,
        ChallengeParticipation.approval_status == ApprovalStatus.APPROVED
    )
    cc_result = await db.execute(completed_challenges_query)
    completed_challenges_count = cc_result.scalar() or 0

    newly_awarded = []

    # 4. Evaluate fixed vocabulary rules (xp_total>=N, completed_challenges>=N)
    for badge in all_badges:
        if badge.id in owned_badge_ids:
            continue

        unlock_granted = False
        rule = badge.unlock_rule.replace(" ", "")

        if ">=" in rule:
            metric, threshold_str = rule.split(">=")
            try:
                threshold = int(threshold_str)
                if metric == "xp_total" and user.total_xp >= threshold:
                    unlock_granted = True
                elif metric == "completed_challenges" and completed_challenges_count >= threshold:
                    unlock_granted = True
            except ValueError:
                continue # Skip malformed rules safely

        # 5. Award and Queue Notification
        if unlock_granted:
            new_user_badge = UserBadge(employee_id=user.id, badge_id=badge.id)
            db.add(new_user_badge)
            newly_awarded.append(badge)

    if newly_awarded:
        await db.commit()
        for awarded_badge in newly_awarded:
            await notify(
                db=db,
                employee_id=user.id,
                type="badge_unlocked",
                message=f"Congratulations! You unlocked the {awarded_badge.name} badge!"
            )

    return newly_awarded
