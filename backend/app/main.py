from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import engine
# CRITICAL IMPORT: Must import Base AND the specific models to register them
from app.models import Base, Project, AuditLog 
from app.routers import agent

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 CodeOps ULTRA Enterprise: Initializing Database...")
    try:
        async with engine.begin() as conn:
            # This creates the tables if they don't exist
            await conn.run_sync(Base.metadata.create_all)
        print("✅ Database Tables Verified")
    except Exception as e:
        print(f"❌ Database Init Failed: {e}")
    
    yield
    print("🛑 CodeOps ULTRA Enterprise: Systems Offline")

app = FastAPI(title="Code-OPS ULTRA API", version="2.5.0", lifespan=lifespan)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent.router, prefix="/api", tags=["Agent"])

@app.get("/")
async def root():
    return {"system": "Code-OPS ULTRA", "status": "operational"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}