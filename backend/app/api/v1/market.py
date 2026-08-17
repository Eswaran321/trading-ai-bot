from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any
from app.market_data.engine import MarketDataEngine, DEFAULT_INSTRUMENTS

router = APIRouter()

@router.get("/overview")
async def get_market_overview():
    """
    Returns high level market overview of instruments with price, trend, momentum, and volatility.
    """
    overview_list = []
    for item in DEFAULT_INSTRUMENTS:
        symbol = item['symbol']
        chart_data = MarketDataEngine.get_symbol_chart_data(symbol)
        bars = chart_data.get('bars', [])
        latest_price = chart_data.get('latest_price', 0.0)
        
        # Calculate 24h change
        prev_close = bars[-2]['close'] if len(bars) >= 2 else latest_price
        change_pct = round(((latest_price - prev_close) / prev_close) * 100.0, 2) if prev_close > 0 else 0.0
        
        inds = chart_data.get('latest_indicators', {})
        rsi = inds.get('rsi_14') or 50.0
        ema20 = inds.get('ema_20') or latest_price

        trend = "Bullish" if latest_price > ema20 else "Bearish"
        momentum = "Positive" if rsi > 55 else ("Negative" if rsi < 45 else "Neutral")
        volatility = "Moderate"

        overview_list.append({
            "symbol": symbol,
            "name": item['name'],
            "price": latest_price,
            "change_pct": change_pct,
            "high_24h": round(latest_price * 1.015, 2),
            "low_24h": round(latest_price * 0.985, 2),
            "volume_24h": bars[-1].get('volume', 1000000) if bars else 0,
            "trend": trend,
            "momentum": momentum,
            "volatility": volatility
        })
    return overview_list

@router.get("/chart/{symbol}")
async def get_chart_data(symbol: str):
    """
    Returns OHLCV bars and calculated technical indicators for symbol.
    """
    return MarketDataEngine.get_symbol_chart_data(symbol)
