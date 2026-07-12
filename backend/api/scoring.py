"""OWNER: shared."""
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.deps import get_db
from models.scoring import DepartmentScore
from schemas.scoring import DepartmentScoreRead
from services import scoring_service

router = APIRouter(prefix="/scoring", tags=["Scoring"])


@router.get("/departments/{department_id}", response_model=list[DepartmentScoreRead])
def get_department_scores(department_id: int, db: Session = Depends(get_db)):
    return db.query(DepartmentScore).filter(DepartmentScore.department_id == department_id).all()


@router.post("/departments/{department_id}/calculate", response_model=DepartmentScoreRead, status_code=201)
def calculate_department_score(department_id: int, period_start: date, period_end: date, db: Session = Depends(get_db)):
    """TODO: wired to a NotImplementedError stub — fill in
    services.scoring_service.calculate_department_score()."""
    return scoring_service.calculate_department_score(db, department_id, period_start, period_end)


@router.get("/overall")
def get_overall_score(db: Session = Depends(get_db)):
    """TODO: wired to a NotImplementedError stub — feeds the Organization
    Dashboard's headline number (Section 5)."""
    return {"overall_esg_score": scoring_service.get_overall_esg_score(db)}
