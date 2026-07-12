"""OWNER: shared — build last (Section 7)."""
from datetime import date

from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from api.deps import get_db
from services import report_service

router = APIRouter(prefix="/reports", tags=["Reports"])

_VALID_TYPES = {"environmental", "social", "governance", "esg_summary", "custom"}
_VALID_FORMATS = {"pdf", "excel", "csv"}


@router.get("/{report_type}")
def get_report(
    report_type: str,
    export_format: str = "pdf",
    department_id: int | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    employee_id: int | None = None,
    challenge_id: int | None = None,
    esg_category: str | None = None,
    db: Session = Depends(get_db),
):
    """TODO: wired to a NotImplementedError stub — fill in
    services.report_service.generate_report(). Covers all four standard
    reports plus the Custom Report Builder via report_type='custom'."""
    if report_type not in _VALID_TYPES:
        return Response(content=f"Unknown report_type. Must be one of {_VALID_TYPES}", status_code=400)
    if export_format not in _VALID_FORMATS:
        return Response(content=f"Unknown export_format. Must be one of {_VALID_FORMATS}", status_code=400)

    content = report_service.generate_report(
        db, report_type, export_format, department_id, date_from, date_to, employee_id, challenge_id, esg_category
    )
    media_types = {"pdf": "application/pdf", "excel": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "csv": "text/csv"}
    return Response(content=content, media_type=media_types[export_format])
