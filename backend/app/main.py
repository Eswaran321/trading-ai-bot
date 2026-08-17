from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import init_db

from app.api.v1.health import router as health_router
from app.api.v1.market import router as market_router
from app.api.v1.scanner import router as scanner_router
from app.api.v1.portfolio import router as portfolio_router
from app.api.v1.assistant import router as assistant_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Database Tables
    await init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Router v1
app.include_router(health_router, prefix=f"{settings.API_V1_STR}/system", tags=["System"])
app.include_router(market_router, prefix=f"{settings.API_V1_STR}/market", tags=["Market Data"])
app.include_router(scanner_router, prefix=f"{settings.API_V1_STR}/scanner", tags=["AI Scanner"])
app.include_router(portfolio_router, prefix=f"{settings.API_V1_STR}/portfolio", tags=["Portfolio & Orders"])
app.include_router(assistant_router, prefix=f"{settings.API_V1_STR}/assistant", tags=["AI Assistant"])

@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "ONLINE",
        "docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
