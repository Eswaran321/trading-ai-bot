import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    mfa_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    portfolios = relationship("Portfolio", back_populates="owner")
    strategies = relationship("Strategy", back_populates="creator")


class Instrument(Base):
    __tablename__ = "instruments"

    id = Column(String, primary_key=True, default=generate_uuid)
    symbol = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    asset_type = Column(String, default="EQUITY")  # EQUITY, CRYPTO, FOREX, INDEX
    exchange = Column(String, default="NSE")
    currency = Column(String, default="INR")
    is_tradable = Column(Boolean, default=True)


class Strategy(Base):
    __tablename__ = "strategies"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    rules_json = Column(JSON, nullable=True)  # Visual Builder JSON rules
    script_code = Column(String, nullable=True)  # Python sandboxed code
    regime_scope = Column(String, default="ALL")  # TRENDING, SIDEWAYS, ALL
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("User", back_populates="strategies")
    signals = relationship("Signal", back_populates="strategy")


class Signal(Base):
    __tablename__ = "signals"

    id = Column(String, primary_key=True, default=generate_uuid)
    strategy_id = Column(String, ForeignKey("strategies.id"), nullable=True)
    symbol = Column(String, index=True, nullable=False)
    signal_type = Column(String, nullable=False)  # BUY, SELL, HOLD, WATCH
    confidence = Column(Float, nullable=False)  # 0.0 - 100.0 %
    entry_price = Column(Float, nullable=True)
    stop_loss = Column(Float, nullable=True)
    take_profit = Column(Float, nullable=True)
    risk_reward_ratio = Column(Float, nullable=True)
    reason_json = Column(JSON, nullable=True)  # Structured justification
    timestamp = Column(DateTime, default=datetime.utcnow)

    strategy = relationship("Strategy", back_populates="signals")


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, default="Primary Portfolio")
    cash_balance = Column(Float, default=100000.0)  # Initial ₹1,00,000 / $100,000
    invested_capital = Column(Float, default=0.0)
    realized_pnl = Column(Float, default=0.0)
    unrealized_pnl = Column(Float, default=0.0)
    mode = Column(String, default="PAPER")  # PAPER | LIVE
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="portfolios")
    positions = relationship("Position", back_populates="portfolio")
    orders = relationship("Order", back_populates="portfolio")
    risk_profile = relationship("RiskProfile", uselist=False, back_populates="portfolio")


class Position(Base):
    __tablename__ = "positions"

    id = Column(String, primary_key=True, default=generate_uuid)
    portfolio_id = Column(String, ForeignKey("portfolios.id"), nullable=False)
    symbol = Column(String, index=True, nullable=False)
    quantity = Column(Float, nullable=False)
    avg_entry_price = Column(Float, nullable=False)
    current_price = Column(Float, nullable=False)
    unrealized_pnl = Column(Float, default=0.0)
    side = Column(String, default="BUY")  # BUY (LONG) | SELL (SHORT)
    updated_at = Column(DateTime, default=datetime.utcnow)

    portfolio = relationship("Portfolio", back_populates="positions")


class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=generate_uuid)
    portfolio_id = Column(String, ForeignKey("portfolios.id"), nullable=False)
    symbol = Column(String, index=True, nullable=False)
    side = Column(String, nullable=False)  # BUY | SELL
    order_type = Column(String, default="MARKET")  # MARKET | LIMIT | STOP
    quantity = Column(Float, nullable=False)
    price = Column(Float, nullable=True)
    stop_loss = Column(Float, nullable=True)
    take_profit = Column(Float, nullable=True)
    status = Column(String, default="PENDING")  # PENDING | FILLED | CANCELLED | REJECTED
    mode = Column(String, default="PAPER")  # PAPER | LIVE
    rejection_reason = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    portfolio = relationship("Portfolio", back_populates="orders")


class RiskProfile(Base):
    __tablename__ = "risk_profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    portfolio_id = Column(String, ForeignKey("portfolios.id"), nullable=False)
    max_risk_per_trade_pct = Column(Float, default=2.0)
    max_daily_loss_amount = Column(Float, default=1000.0)
    max_portfolio_leverage = Column(Float, default=1.0)
    max_open_positions = Column(Integer, default=5)
    require_stop_loss = Column(Boolean, default=True)
    emergency_kill_switch = Column(Boolean, default=False)
    live_trading_enabled = Column(Boolean, default=False)

    portfolio = relationship("Portfolio", back_populates="risk_profile")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=True)
    action = Column(String, nullable=False)
    category = Column(String, default="SYSTEM")  # SYSTEM | RISK | ORDER | SIGNAL | AUTH
    details_json = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
