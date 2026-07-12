"""OWNER: Dev 2 — Gamification routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.deps import get_db
from core.enums import ChallengeStatus
from models.gamification import Badge, Challenge, ChallengeParticipation, Reward, RewardRedemption
from models.shared import Employee
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
    RewardRedemptionRead,
)
from services import gamification_service

router = APIRouter(prefix="/gamification", tags=["Gamification"])

# Valid forward moves through the lifecycle (Section 6). ARCHIVED is
# reachable from any non-terminal state, handled as a special case below.
_VALID_TRANSITIONS = {
    ChallengeStatus.DRAFT: {ChallengeStatus.ACTIVE},
    ChallengeStatus.ACTIVE: {ChallengeStatus.UNDER_REVIEW},
    ChallengeStatus.UNDER_REVIEW: {ChallengeStatus.COMPLETED},
    ChallengeStatus.COMPLETED: set(),
    ChallengeStatus.ARCHIVED: set(),
}


# --- Challenges -----------------------------------------------------------

@router.post("/challenges", response_model=ChallengeRead, status_code=201)
def create_challenge(payload: ChallengeCreate, db: Session = Depends(get_db)):
    challenge = Challenge(**payload.model_dump())
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    return challenge


@router.get("/challenges", response_model=list[ChallengeRead])
def list_challenges(status: ChallengeStatus | None = None, db: Session = Depends(get_db)):
    query = db.query(Challenge)
    if status is not None:
        query = query.filter(Challenge.status == status)
    return query.all()


@router.patch("/challenges/{challenge_id}/status", response_model=ChallengeRead)
def update_challenge_status(challenge_id: int, payload: ChallengeStatusUpdate, db: Session = Depends(get_db)):
    challenge = db.get(Challenge, challenge_id)
    if not challenge:
        raise HTTPException(404, "Challenge not found")
    if payload.status != ChallengeStatus.ARCHIVED and payload.status not in _VALID_TRANSITIONS[challenge.status]:
        raise HTTPException(400, f"Cannot move challenge from {challenge.status} to {payload.status}")
    challenge.status = payload.status
    db.commit()
    db.refresh(challenge)
    return challenge


# --- Challenge Participation -------------------------------------------

@router.post("/challenge-participations", response_model=ChallengeParticipationRead, status_code=201)
def create_challenge_participation(payload: ChallengeParticipationCreate, db: Session = Depends(get_db)):
    participation = ChallengeParticipation(**payload.model_dump())
    db.add(participation)
    db.commit()
    db.refresh(participation)
    return participation


@router.get("/challenge-participations", response_model=list[ChallengeParticipationRead])
def list_challenge_participations(
    employee_id: int | None = None, challenge_id: int | None = None, db: Session = Depends(get_db)
):
    query = db.query(ChallengeParticipation)
    if employee_id is not None:
        query = query.filter(ChallengeParticipation.employee_id == employee_id)
    if challenge_id is not None:
        query = query.filter(ChallengeParticipation.challenge_id == challenge_id)
    return query.all()


@router.post("/challenge-participations/{participation_id}/approve", response_model=ChallengeParticipationRead)
def approve_challenge_participation(
    participation_id: int, payload: ChallengeParticipationApprove, db: Session = Depends(get_db)
):
    """TODO (Dev 2): on approval this should call
    services.gamification_service.award_xp() (which then calls
    check_and_award_badges()) — not implemented as a direct DB write here
    on purpose, so the XP + badge logic stays in one place."""
    participation = db.get(ChallengeParticipation, participation_id)
    if not participation:
        raise HTTPException(404, "Participation not found")
    raise HTTPException(501, "TODO: wire to gamification_service.award_xp()")


# --- Badges -----------------------------------------------------------

@router.post("/badges", response_model=BadgeRead, status_code=201)
def create_badge(payload: BadgeCreate, db: Session = Depends(get_db)):
    badge = Badge(**payload.model_dump())
    db.add(badge)
    db.commit()
    db.refresh(badge)
    return badge


@router.get("/badges", response_model=list[BadgeRead])
def list_badges(db: Session = Depends(get_db)):
    return db.query(Badge).all()


# --- Rewards ------------------------------------------------------------

@router.post("/rewards", response_model=RewardRead, status_code=201)
def create_reward(payload: RewardCreate, db: Session = Depends(get_db)):
    reward = Reward(**payload.model_dump())
    db.add(reward)
    db.commit()
    db.refresh(reward)
    return reward


@router.get("/rewards", response_model=list[RewardRead])
def list_rewards(db: Session = Depends(get_db)):
    return db.query(Reward).all()


@router.post("/rewards/redeem", response_model=RewardRedemptionRead, status_code=201)
def redeem_reward(payload: RewardRedemptionCreate, db: Session = Depends(get_db)):
    """TODO (Dev 2): wired to a NotImplementedError stub — fill in
    services.gamification_service.redeem_reward()."""
    employee = db.get(Employee, payload.employee_id)
    reward = db.get(Reward, payload.reward_id)
    if not employee:
        raise HTTPException(404, "Employee not found")
    if not reward:
        raise HTTPException(404, "Reward not found")
    try:
        return gamification_service.redeem_reward(db, employee, reward)
    except ValueError as e:
        raise HTTPException(400, str(e))


# --- Leaderboard --------------------------------------------------------

@router.get("/leaderboard", response_model=list[LeaderboardEntry])
def get_leaderboard(limit: int = 10, db: Session = Depends(get_db)):
    employees = db.query(Employee).order_by(Employee.xp_total.desc()).limit(limit).all()
    return [
        LeaderboardEntry(
            employee_id=e.id,
            employee_name=e.name,
            department_name=e.department.name if e.department else None,
            xp_total=e.xp_total,
            rank=i + 1,
        )
        for i, e in enumerate(employees)
    ]
