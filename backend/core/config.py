"""
Central app configuration. Reads from environment variables / .env file.
DATABASE_URL now points at the `db` service name from docker-compose,
not localhost — that's how containers find each other on the compose
network. Override it in .env for running the API outside Docker against
a local Postgres.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "EcoSphere ESG Platform"
    ENV: str = "development"

    # asyncpg driver, not psycopg2 — required for the async engine.
    DATABASE_URL: str = "postgresql+asyncpg://ecosphere:ecosphere@db:5432/ecosphere"

    CORS_ORIGINS: list[str] = ["*"]

    DEFAULT_ENVIRONMENTAL_WEIGHT: float = 0.4
    DEFAULT_SOCIAL_WEIGHT: float = 0.3
    DEFAULT_GOVERNANCE_WEIGHT: float = 0.3

    SECRET_KEY: str = "super_secret_fallback_key_change_in_production" # Y'all should add SECRET_KEY to the env, DONT FORGET
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60


settings = Settings()
