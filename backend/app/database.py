from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import os

# Get URL from env, default to local connection
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://ultra_admin:ultra_secure_password@db:5432/codeops_db")

# FIX: Force the URL to use the async driver (asyncpg) if it mistakenly uses the default (psycopg2)
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session