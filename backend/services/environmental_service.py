"""
OWNER: Dev 1 — Environmental business logic.

Route handlers in api/environmental.py should stay thin and call into
here. Don't put calculation logic directly in the route function.
"""
from datetime import date

from sqlalchemy.orm import Session

from models.environmental import CarbonTransaction, EmissionFactor


def calculate_emission(db: Session, emission_factor_id: int, quantity: float) -> float:
    """Core carbon math: quantity * emission_factor.co2_per_unit.

    TODO (Dev 1): decide how to handle unit mismatches (e.g. quantity given
    in litres but factor defined per gallon) — either enforce matching
    units at the schema level or add a conversion step here.
    """
    factor = db.get(EmissionFactor, emission_factor_id)
    if factor is None:
        raise ValueError(f"EmissionFactor {emission_factor_id} not found")
    return quantity * factor.co2_per_unit


def auto_calculate_from_erp_record(db: Session, source_type: str, source_reference_id: str, quantity: float):
    """TODO (Dev 1): implement the Auto Emission Calculation feature
    (Section 8). When ESGConfig.auto_emission_calc_enabled is True, this
    should be called from wherever Purchase/Manufacturing/Expense/Fleet
    records land (webhook, ERP sync job, or a manual trigger endpoint —
    the brief doesn't specify where those records originate, so decide
    this with the team) and create a CarbonTransaction with
    is_auto_calculated=True, picking the right EmissionFactor by source_type.
    """
    raise NotImplementedError("TODO: wire this to wherever ERP records are created")


def get_department_carbon_total(db: Session, department_id: int, start: date, end: date) -> float:
    """TODO (Dev 1): sum CarbonTransaction.calculated_emission_kgco2e for a
    department within a date range. Feeds both the Environmental Dashboard
    and the scoring service's environmental_score input.
    """
    raise NotImplementedError
