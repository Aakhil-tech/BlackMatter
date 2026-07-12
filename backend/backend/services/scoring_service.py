"""
OWNER: shared — build after both domains have working CRUD, since this
reads from all three pillars.
"""
from datetime import date, datetime

from sqlalchemy.orm import Session

from models.scoring import DepartmentScore
from models.settings import ESGConfig


def calculate_department_score(db: Session, department_id: int, period_start: date, period_end: date) -> DepartmentScore:
    """TODO (shared): compute environmental_score, social_score,
    governance_score (each 0-100, methodology up to you — e.g. normalize
    against the department's EnvironmentalGoal targets, CSR participation
    rate, and compliance issue resolution rate) then total_score as the
    weighted average using ESGConfig's weights (default 40/30/30 per
    Section 5). Persist as a new DepartmentScore row rather than
    overwriting the previous period's — that history is what the
    dashboard trend view needs.
    """
    raise NotImplementedError


def get_overall_esg_score(db: Session) -> float:
    """TODO (shared): weighted average of all DepartmentScore.total_score
    for the most recent period. Feeds the Organization Dashboard (Section 5).
    """
    raise NotImplementedError
