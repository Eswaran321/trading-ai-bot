from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Market Data Schemas
class OHLCVBar(BaseModel):
    timestamp: str
    open: float
    high: float
    low: float
    close: float
    volume: float

class IndicatorValues(BaseModel):
    sma_20: Optional[float] = None
    ema_20: Optional[float] = None
    ema_50: Optional[float] = None
    rsi_14: Optional[float] = None
    macd: Optional[float] = None
    macd_signal: Optional[float] = None
    macd_hist: Optional[float] = None
    bb_upper: Optional[float] = None
    bb_middle: Optional[float] = None
    bb_lower: Optional[float] = None
    atr_14: Optional[float] = None
    vwap: Optional[float] = None

class MarketOverviewItem(BaseModel):
    symbol: str
    name: str
    price: float
    change_pct: float
    high_24h: float
    low_24h: float
    volume_24h: float
    trend: str
    momentum: str
    volatility: str

class AIMarketSummary(BaseModel):
    condition: str  # Bullish | Bearish | Neutral
    trend_strength_pct: float  # e.g. 72.0
    volatility_level: str  # Low | Moderate | High
    market_regime: str  # Trending Bull | Trending Bear | Sideways
    ai_confidence_pct: float  # e.g. 68.0
    disclaimer: str = "Analytical predictions carry uncertainty. Not financial advice."

# Scanner Opportunity Schema
class OpportunitySignal(BaseModel):
    symbol: str
    name: str
    current_price: float
    signal_type: str  # BUY CANDIDATE | WATCH | NEUTRAL | SELL CANDIDATE
    confidence_pct: float
    trend: str
    momentum: str
    volatility: str
    entry_zone_min: float
    entry_zone_max: float
    invalidation_stop: float
    target_price: float
    risk_reward_ratio: float
    reason: str
    technical_factors: List[str]

# Order & Risk Schemas
class OrderCreate(BaseModel):
    symbol: str
    side: str  # BUY | SELL
    order_type: str = "MARKET"
    quantity: float
    price: Optional[float] = None
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None

class RiskProfileUpdate(BaseModel):
    max_risk_per_trade_pct: Optional[float] = None
    max_daily_loss_amount: Optional[float] = None
    max_portfolio_leverage: Optional[float] = None
    max_open_positions: Optional[int] = None
    require_stop_loss: Optional[bool] = None
    emergency_kill_switch: Optional[bool] = None
    live_trading_enabled: Optional[bool] = None

# System Health Schema
class ComponentHealth(BaseModel):
    name: str
    status: str  # ONLINE | WARNING | ERROR
    latency_ms: float
    details: str

class SystemHealthResponse(BaseModel):
    status: str  # ONLINE | DEGRADED | OFFLINE
    timestamp: str
    components: List[ComponentHealth]
