import os
from typing import List

try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseSettings
    except ImportError:
        # Simple fallback class if pydantic version doesn't export BaseSettings directly
        from pydantic import BaseModel
        class BaseSettings(BaseModel):
            class Config:
                case_sensitive = True

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Algorithmic Trading Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "super-secret-key-change-in-production-ai-trading-bot-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./ai_trading.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]
    
    # Default Risk Limits
    MAX_RISK_PER_TRADE_PCT: float = 2.0  # Max 2% per trade
    MAX_DAILY_LOSS_AMOUNT: float = 1000.0  # Max $1000 daily loss
    MAX_PORTFOLIO_LEVERAGE: float = 1.0  # 1x leverage max
    REQUIRE_STOP_LOSS: bool = True
    LIVE_TRADING_ENABLED: bool = False  # Hard default OFF

settings = Settings()
