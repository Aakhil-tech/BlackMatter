"""
Entry point. Set up once, rarely touched again — if you're adding a new
domain router, add ONE line in the include_router block below and leave
everything else alone.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import environmental, gamification, governance, notifications, reports, scoring, settings, shared, social
from core.config import settings as app_settings
from core.database import Base, engine

# Import every model module so Base.metadata knows about all tables
# before create_all runs. If you add a new models/*.py file, import it
# here too, or its table silently won't be created.
from models import environmental as _environmental_models  # noqa: F401
from models import gamification as _gamification_models  # noqa: F401
from models import governance as _governance_models  # noqa: F401
from models import scoring as _scoring_models  # noqa: F401
from models import settings as _settings_models  # noqa: F401
from models import shared as _shared_models  # noqa: F401
from models import social as _social_models  # noqa: F401

app = FastAPI(title=app_settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=app_settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(shared.router, prefix="/api")
app.include_router(environmental.router, prefix="/api")
app.include_router(governance.router, prefix="/api")
app.include_router(social.router, prefix="/api")
app.include_router(gamification.router, prefix="/api")
app.include_router(scoring.router, prefix="/api")
app.include_router(settings.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(reports.router, prefix="/api")


@app.on_event("startup")
def on_startup():
    # Hackathon speed: create_all instead of Alembic migrations. If you
    # change a model's columns after tables already exist, delete
    # ecosphere.db and restart rather than fighting SQLite's ALTER TABLE
    # limitations.
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": app_settings.APP_NAME}
