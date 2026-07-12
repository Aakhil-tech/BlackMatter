# schemas/environmental.py
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict
from core.enums import CarbonSourceType


class EmissionFactorCreate(BaseModel):
    transaction_type: CarbonSourceType
    factor_value: float
    unit: str


class EmissionFactorRead(EmissionFactorCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


class CarbonTransactionCreate(BaseModel):
    department_id: int
    emission_factor_id: int
    transaction_type: CarbonSourceType
    description: str | None = None
    amount: float
    recorded_date: date


class CarbonTransactionRead(CarbonTransactionCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    calculated_emissions: float
    emission_factor_used: float
    created_at: datetime


class EnvironmentalGoalCreate(BaseModel):
    department_id: int | None = None
    target_metric: str
    target_value: float
    deadline: date
    status: str = "active"


class EnvironmentalGoalRead(EnvironmentalGoalCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
