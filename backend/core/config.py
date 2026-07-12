"""
Central app configuration. Reads from environment variables / .env file.
One place to change DB, CORS, and default ESG weighting — nobody else
should hardcode these values anywhere else in the codebase.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "EcoSphere ESG Platform"
    ENV: str = "development"

    # Swap to a Postgres URL when you're ready:
    # postgresql+psycopg2://user:password@localhost:5432/ecosphere
    DATABASE_URL: str = "sqlite:///./ecosphere.db"

    # Hackathon rule: wide open. Lock down before anything resembling prod.
    CORS_ORIGINS: list[str] = ["*"]

    # Default ESG weighting (Section 8 of the brief). Overridable per org
    # via the ESGConfig table — these are just the fallback defaults.
    DEFAULT_ENVIRONMENTAL_WEIGHT: float = 0.4
    DEFAULT_SOCIAL_WEIGHT: float = 0.3
    DEFAULT_GOVERNANCE_WEIGHT: float = 0.3


settings = Settings()
