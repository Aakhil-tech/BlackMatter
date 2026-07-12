from contextlib import asynccontextmanager
import uvicorn  # Added for local execution

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.database import Base, engine
from models.core import Department, User, Category  # noqa: F401
from models.environmental import EmissionFactor, CarbonTransaction, EnvironmentalGoal  # noqa: F401
from models.social import CSRActivity, EmployeeParticipation  # noqa: F401
from models.governance import ESGPolicy, PolicyAcknowledgement, Audit, ComplianceIssue  # noqa: F401
from models.gamification import Challenge, ChallengeParticipation, Badge, UserBadge, Reward  # noqa: F401
from api import environmental, governance, shared

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

app.include_router(shared.router, prefix="/api")
app.include_router(environmental.router, prefix="/api")
app.include_router(governance.router, prefix="/api")

# Dev 2 adds these when their work is done:
# Yea man -- Dev 2
from api import social, gamification
app.include_router(social.router, prefix="/api")
app.include_router(gamification.router, prefix="/api")

from api.auth import router as auth_router
app.include_router(auth_router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok", "app": settings.APP_NAME}

# --- ADDED: THE FALLBACK EXECUTION BLOCK ---
# This allows you to run `python main.py` directly on your host machine
# to test logic quickly without rebuilding the Podman container.
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
