import pytest
import pandas as pd
import numpy as np
from app.market_data.indicators import TechnicalIndicators
from app.market_data.engine import MarketDataEngine
from app.ai.scanner import AIScannerEngine
from app.risk.engine import RiskEngine
from app.execution.paper import PaperExecutionEngine

def test_technical_indicators_calculation():
    dates = pd.date_range(start="2026-01-01", periods=30)
    prices = [100.0 + i + (i % 3) * 2 for i in range(30)]
    df = pd.DataFrame({
        'timestamp': dates.astype(str),
        'open': prices,
        'high': [p + 2.0 for p in prices],
        'low': [p - 2.0 for p in prices],
        'close': prices,
        'volume': [10000] * 30
    })

    df_ind = TechnicalIndicators.compute_all(df)
    
    assert 'sma_20' in df_ind.columns
    assert 'rsi_14' in df_ind.columns
    assert 'macd' in df_ind.columns
    assert 'bb_upper' in df_ind.columns
    assert 'atr_14' in df_ind.columns
    assert 'vwap' in df_ind.columns

    # Verify RSI is bounded 0-100
    last_rsi = df_ind['rsi_14'].iloc[-1]
    assert 0.0 <= last_rsi <= 100.0

def test_market_data_engine():
    chart_data = MarketDataEngine.get_symbol_chart_data("AAPL")
    assert chart_data["symbol"] == "AAPL"
    assert len(chart_data["bars"]) > 0
    assert chart_data["latest_price"] > 0

def test_ai_scanner_engine():
    summary = AIScannerEngine.get_ai_market_summary()
    assert summary["condition"] in ["Bullish", "Bearish", "Neutral"]
    assert 0.0 <= summary["ai_confidence_pct"] <= 100.0

    opps = AIScannerEngine.get_all_opportunities()
    assert len(opps) > 0
    top = opps[0]
    assert "signal_type" in top
    assert "risk_reward_ratio" in top
    assert "invalidation_stop" in top

def test_risk_engine_safety_gates():
    portfolio_state = {
        "cash_balance": 10000.0,
        "realized_pnl": 0.0,
        "unrealized_pnl": 0.0,
        "active_positions_count": 0
    }
    risk_profile = {
        "max_risk_per_trade_pct": 2.0,
        "max_daily_loss_amount": 500.0,
        "max_open_positions": 5,
        "require_stop_loss": True,
        "emergency_kill_switch": False,
        "live_trading_enabled": False
    }

    # Test Valid Paper Order with Stop Loss
    valid_order = {
        "symbol": "AAPL",
        "side": "BUY",
        "quantity": 10,
        "price": 100.0,
        "stop_loss": 98.0,
        "mode": "PAPER"
    }
    approved, reason = RiskEngine.validate_order(valid_order, portfolio_state, risk_profile)
    assert approved is True

    # Test Gate 5: Missing Stop Loss
    invalid_no_sl = {
        "symbol": "AAPL",
        "side": "BUY",
        "quantity": 10,
        "price": 100.0,
        "stop_loss": None,
        "mode": "PAPER"
    }
    approved, reason = RiskEngine.validate_order(invalid_no_sl, portfolio_state, risk_profile)
    assert approved is False
    assert "Gate 5" in reason

    # Test Gate 2: Emergency Kill Switch
    risk_profile_kill = dict(risk_profile, emergency_kill_switch=True)
    approved, reason = RiskEngine.validate_order(valid_order, portfolio_state, risk_profile_kill)
    assert approved is False
    assert "Gate 2" in reason

def test_paper_execution_engine():
    paper = PaperExecutionEngine(initial_cash=50000.0)
    order_req = {
        "symbol": "NVDA",
        "side": "BUY",
        "quantity": 5,
        "price": 100.0,
        "stop_loss": 95.0,
        "mode": "PAPER"
    }
    order_res = paper.submit_order(order_req)
    assert order_res["status"] == "FILLED"
    
    summary = paper.get_portfolio_summary()
    assert summary["cash_balance"] == 49500.0
    assert summary["active_positions_count"] == 1
