"""OWNER: Dev 1 — Environmental schemas."""
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from core.enums import CarbonSourceType


class EmissionFactorBase(BaseModel):
    name: str
    source_type: CarbonSourceType
    unit: str
    co2_per_unit: float
    effective_date: date
    is_active: bool = True


class EmissionFactorCreate(EmissionFactorBase):
    pass


class EmissionFactorRead(EmissionFactorBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class CarbonTransactionBase(BaseModel):
    department_id: int
    emission_factor_id: int
    source_type: CarbonSourceType
    source_reference_id: str | None = None
    quantity: float
    transaction_date: date


class CarbonTransactionCreate(CarbonTransactionBase):
    """calculated_emission_kgco2e is NOT accepted from the client — the
    service layer computes it from quantity * emission_factor.co2_per_unit.
    Don't add it here even if it'd make manual testing easier."""
    pass


class CarbonTransactionRead(CarbonTransactionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    calculated_emission_kgco2e: float
    is_auto_calculated: bool
    created_at: datetime


class EnvironmentalGoalBase(BaseModel):
    department_id: int | None = None
    title: str
    description: str | None = None
    target_metric: str
    target_value: float
    start_date: date
    end_date: date
    status: str = "active"


class EnvironmentalGoalCreate(EnvironmentalGoalBase):
    pass


class EnvironmentalGoalRead(EnvironmentalGoalBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    current_value: float
