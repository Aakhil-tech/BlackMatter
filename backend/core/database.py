from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from core.config import settings

# 1. Use create_async_engine instead of standard create_engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,  # Set to True to see the raw SQL queries in your docker logs
)

# 2. Configure the sessionmaker to explicitly use the AsyncSession class
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

# 3. An async generator dependency to yield sessions to routers later
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
