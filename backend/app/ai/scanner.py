import pandas as pd
import numpy as np
from typing import List, Dict, Any
from app.market_data.engine import MarketDataEngine, DEFAULT_INSTRUMENTS
from app.market_data.indicators import TechnicalIndicators

class AIScannerEngine:
    """
    AI Scanner & Market Regime Classifier Engine.
    Scans supported instruments and derives analytical signals with confidence scores and reasoning.
    """

    @classmethod
    def analyze_instrument(cls, item: Dict[str, Any]) -> Dict[str, Any]:
        symbol = item['symbol']
        name = item['name']
        df = MarketDataEngine.fetch_historical_ohlcv(symbol, period="6mo")
        df_ind = TechnicalIndicators.compute_all(df)

        if len(df_ind) < 20:
            return {}

        latest = df_ind.iloc[-1]
        prev = df_ind.iloc[-2]

        close = float(latest['close'])
        sma20 = float(latest['sma_20']) if not pd.isna(latest['sma_20']) else close
        ema20 = float(latest['ema_20']) if not pd.isna(latest['ema_20']) else close
        ema50 = float(latest['ema_50']) if not pd.isna(latest['ema_50']) else close
        rsi = float(latest['rsi_14']) if not pd.isna(latest['rsi_14']) else 50.0
        macd_hist = float(latest['macd_hist']) if not pd.isna(latest['macd_hist']) else 0.0
        prev_macd_hist = float(prev['macd_hist']) if not pd.isna(prev['macd_hist']) else 0.0
        atr = float(latest['atr_14']) if not pd.isna(latest['atr_14']) else close * 0.015
        vwap = float(latest['vwap']) if not pd.isna(latest['vwap']) else close

        # Trend Determination
        if close > ema20 and ema20 > ema50:
            trend = "Bullish"
        elif close < ema20 and ema20 < ema50:
            trend = "Bearish"
        else:
            trend = "Neutral"

        # Momentum Determination
        if rsi > 55 and macd_hist > prev_macd_hist:
            momentum = "Positive"
        elif rsi < 45 and macd_hist < prev_macd_hist:
            momentum = "Negative"
        else:
            momentum = "Moderate"

        # Volatility Determination
        vol_pct = (atr / close) * 100.0
        if vol_pct > 2.5:
            volatility = "High"
        elif vol_pct < 1.0:
            volatility = "Low"
        else:
            volatility = "Moderate"

        # Signal Scoring & Reasoning
        factors = []
        confidence_points = 50.0

        if close > ema20:
            factors.append("Price is trading above 20 EMA")
            confidence_points += 10
        if ema20 > ema50:
            factors.append("20 EMA is above 50 EMA (Bullish Trend Confirmation)")
            confidence_points += 10
        if 45 <= rsi <= 65:
            factors.append("RSI is in healthy bullish accumulation zone (45-65)")
            confidence_points += 10
        elif rsi < 35:
            factors.append("RSI indicates oversold condition (Potential Mean Reversion)")
            confidence_points += 5
        if macd_hist > 0 and macd_hist > prev_macd_hist:
            factors.append("MACD histogram is positive and expanding")
            confidence_points += 10
        if close > vwap:
            factors.append("Price is trading above VWAP")
            confidence_points += 5

        confidence = min(92.0, max(40.0, confidence_points))

        # Classify Signal Type
        if confidence >= 70 and trend == "Bullish":
            signal_type = "BUY CANDIDATE"
        elif confidence >= 60 and trend == "Bullish":
            signal_type = "WATCH"
        elif trend == "Bearish" and confidence >= 70:
            signal_type = "SELL CANDIDATE"
        else:
            signal_type = "NEUTRAL"

        # Risk parameters
        invalidation_stop = round(close - (1.5 * atr), 2) if signal_type in ["BUY CANDIDATE", "WATCH"] else round(close + (1.5 * atr), 2)
        target_price = round(close + (3.0 * atr), 2) if signal_type in ["BUY CANDIDATE", "WATCH"] else round(close - (3.0 * atr), 2)
        risk_dist = abs(close - invalidation_stop)
        reward_dist = abs(target_price - close)
        rr_ratio = round(reward_dist / (risk_dist if risk_dist > 0 else 1.0), 2)

        reason_summary = f"Price ({close}) is above major moving averages with {momentum.lower()} momentum and {volatility.lower()} volatility."

        return {
            "symbol": symbol,
            "name": name,
            "current_price": close,
            "signal_type": signal_type,
            "confidence_pct": confidence,
            "trend": trend,
            "momentum": momentum,
            "volatility": volatility,
            "entry_zone_min": round(close * 0.995, 2),
            "entry_zone_max": round(close * 1.005, 2),
            "invalidation_stop": invalidation_stop,
            "target_price": target_price,
            "risk_reward_ratio": rr_ratio,
            "reason": reason_summary,
            "technical_factors": factors
        }

    @classmethod
    def get_all_opportunities(cls) -> List[Dict[str, Any]]:
        results = []
        for item in DEFAULT_INSTRUMENTS:
            res = cls.analyze_instrument(item)
            if res:
                results.append(res)
        return results

    @classmethod
    def get_ai_market_summary(cls) -> Dict[str, Any]:
        """
        Generates macro market regime overview summary.
        """
        all_opps = cls.get_all_opportunities()
        bulls = sum(1 for x in all_opps if x.get('trend') == 'Bullish')
        total = len(all_opps) if all_opps else 1
        bull_ratio = bulls / total

        if bull_ratio >= 0.6:
            condition = "Bullish"
            regime = "Trending Bull"
        elif bull_ratio <= 0.3:
            condition = "Bearish"
            regime = "Trending Bear"
        else:
            condition = "Neutral"
            regime = "Sideways / Consolidation"

        avg_conf = np.mean([x['confidence_pct'] for x in all_opps]) if all_opps else 68.0

        return {
            "condition": condition,
            "trend_strength_pct": round(bull_ratio * 100.0, 1),
            "volatility_level": "Moderate",
            "market_regime": regime,
            "ai_confidence_pct": round(avg_conf, 1),
            "disclaimer": "Analytical AI predictions carry inherent market risk. Signals must pass Risk Engine validation."
        }
