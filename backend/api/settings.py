"""OWNER: shared. Settings & Administration (Section 6): ESG Configuration
and Notification Settings live here as a singleton config row."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.deps import get_db
from models.settings import ESGConfig
from schemas.scoring import ESGConfigRead, ESGConfigUpdate

router = APIRouter(prefix="/settings", tags=["Settings"])


def _get_or_create_config(db: Session) -> ESGConfig:
    config = db.query(ESGConfig).first()
    if not config:
        config = ESGConfig()
        db.add(config)
        db.commit()
        db.refresh(config)
    return config


@router.get("/esg-config", response_model=ESGConfigRead)
def get_esg_config(db: Session = Depends(get_db)):
    return _get_or_create_config(db)


@router.patch("/esg-config", response_model=ESGConfigRead)
def update_esg_config(payload: ESGConfigUpdate, db: Session = Depends(get_db)):
    config = _get_or_create_config(db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(config, field, value)
    db.commit()
    db.refresh(config)
    return config
