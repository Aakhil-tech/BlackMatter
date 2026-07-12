from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.database import Base, engine

# --- Import all models so Base.metadata.create_all() sees every table ---
import models.shared          # noqa: F401  Department, Employee, Category
import models.environmental   # noqa: F401
import models.social          # noqa: F401
import models.governance      # noqa: F401
import models.gamification    # noqa: F401
import models.scoring         # noqa: F401
import models.settings        # noqa: F401

# --- Routers ---
from api import (
    environmental,
    gamification,
    governance,
    notifications,
    reports,
    scoring,
    shared,
    social,
)
from api import settings as settings_api
from api.dashboard import router as dashboard_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# All routers under /api to match what the frontend calls
app.include_router(shared.router, prefix="/api")
app.include_router(environmental.router, prefix="/api")
app.include_router(social.router, prefix="/api")
app.include_router(governance.router, prefix="/api")
app.include_router(gamification.router, prefix="/api")
app.include_router(scoring.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(settings_api.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")


@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": settings.APP_NAME}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
