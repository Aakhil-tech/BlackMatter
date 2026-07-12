"""OWNER: Dev 2 | Gamification routes. Fully Async SQLAlchemy 2.0 implementation."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_db
from core.enums import ChallengeStatus
from models.gamification import Badge, Challenge, ChallengeParticipation, Reward
from models.core import User
from schemas.gamification import (
    BadgeCreate,
    BadgeRead,
    ChallengeCreate,
    ChallengeParticipationApprove,
    ChallengeParticipationCreate,
    ChallengeParticipationRead,
    ChallengeRead,
    ChallengeStatusUpdate,
    LeaderboardEntry,
    RewardCreate,
    RewardRead,
    RewardRedemptionCreate,
)
from services import gamification_service

router = APIRouter(prefix="/gamification", tags=["Gamification"])

_VALID_TRANSITIONS = {
    ChallengeStatus.DRAFT: {ChallengeStatus.ACTIVE},
    ChallengeStatus.ACTIVE: {ChallengeStatus.UNDER_REVIEW},
    ChallengeStatus.UNDER_REVIEW: {ChallengeStatus.COMPLETED},
    ChallengeStatus.COMPLETED: set(),
    ChallengeStatus.ARCHIVED: set(),
}

# --- Challenges -----------------------------------------------------------

@router.post("/challenges", response_model=ChallengeRead, status_code=status.HTTP_201_CREATED)
async def create_challenge(payload: ChallengeCreate, db: AsyncSession = Depends(get_db)):
    challenge = Challenge(**payload.model_dump())
    db.add(challenge)
    await db.commit()
    await db.refresh(challenge)
    return challenge

@router.get("/challenges", response_model=list[ChallengeRead])
async def list_challenges(status: ChallengeStatus | None = None, db: AsyncSession = Depends(get_db)):
    query = select(Challenge)
    if status is not None:
        query = query.where(Challenge.status == status)
    result = await db.execute(query)
    return result.scalars().all()

@router.patch("/challenges/{challenge_id}/status", response_model=ChallengeRead)
async def update_challenge_status(challenge_id: int, payload: ChallengeStatusUpdate, db: AsyncSession = Depends(get_db)):
    challenge = await db.get(Challenge, challenge_id)
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")

    if payload.status != ChallengeStatus.ARCHIVED and payload.status not in _VALID_TRANSITIONS[challenge.status]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Cannot move challenge from {challenge.status} to {payload.status}")

    challenge.status = payload.status
    await db.commit()
    await db.refresh(challenge)
    return challenge

# --- Challenge Participation ----------------------------------------------

@router.post("/challenge-participations", response_model=ChallengeParticipationRead, status_code=status.HTTP_201_CREATED)
async def create_challenge_participation(payload: ChallengeParticipationCreate, db: AsyncSession = Depends(get_db)):
    participation = ChallengeParticipation(**payload.model_dump())
    db.add(participation)
    await db.commit()
    await db.refresh(participation)
    return participation

@router.post("/challenge-participations/{participation_id}/approve", response_model=ChallengeParticipationRead)
async def approve_challenge_participation(participation_id: int, payload: ChallengeParticipationApprove, db: AsyncSession = Depends(get_db)):
    participation = await db.get(ChallengeParticipation, participation_id)
    if not participation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participation not found")

    # Full gamification logic handled in service layer
    try:
        user = await db.get(User, participation.employee_id)
        await gamification_service.award_xp(db, user, participation.challenge.xp_reward)
        participation.approval_status = payload.approval_status
        await db.commit()
        await db.refresh(participation)
        return participation
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# --- Badges & Rewards -----------------------------------------------------

@router.post("/rewards/redeem", status_code=status.HTTP_200_OK)
async def redeem_reward(payload: RewardRedemptionCreate, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, payload.employee_id)
    reward = await db.get(Reward, payload.reward_id)

    if not user or not reward:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User or Reward not found")

    try:
        await gamification_service.redeem_reward(db, user, reward)
        return {"message": "Reward redeemed successfully."}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
