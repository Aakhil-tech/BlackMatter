from contextlib import asynccontextmanager
import uvicorn  # Added for local execution

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.database import Base, engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    # CRITICAL CHECK: engine MUST be created with create_async_engine()
    # If it is a standard synchronous engine, this async block will fail.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

# The CORS Demon is banished here.
# Ensure settings.CORS_ORIGINS contains ["*"] in your config for Demo Day.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "app": settings.APP_NAME}

# --- ADDED: THE FALLBACK EXECUTION BLOCK ---
# This allows you to run `python main.py` directly on your host machine
# to test logic quickly without rebuilding the Podman container.
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
