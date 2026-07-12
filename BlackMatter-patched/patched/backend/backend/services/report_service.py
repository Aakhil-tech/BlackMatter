"""
OWNER: shared — build last, once the domains have real data to report on.
"""
from datetime import date

from sqlalchemy.orm import Session


def generate_report(
    db: Session,
    report_type: str,  # "environmental" | "social" | "governance" | "esg_summary" | "custom"
    export_format: str,  # "pdf" | "excel" | "csv"
    department_id: int | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    employee_id: int | None = None,
    challenge_id: int | None = None,
    esg_category: str | None = None,
) -> bytes:
    """TODO (shared): implement the four standard reports plus the Custom
    Report Builder (Section 7), filterable by all of Department, Date
    Range, Module, Employee, Challenge, ESG Category, exported as
    PDF/Excel/CSV.

    Suggested libraries: reportlab or weasyprint for PDF, openpyxl for
    Excel, the stdlib csv module for CSV — none are wired in yet, add
    whichever you pick to requirements.txt.
    """
    raise NotImplementedError
