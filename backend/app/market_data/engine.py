import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
try:
    import yfinance as yf
    HAS_YFINANCE = True
except ImportError:
    yf = None
    HAS_YFINANCE = False
from app.market_data.indicators import TechnicalIndicators

DEFAULT_INSTRUMENTS = [
    {"symbol": "RELIANCE.NS", "name": "Reliance Industries Ltd", "type": "EQUITY", "base_price": 2980.0},
    {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "type": "EQUITY", "base_price": 4120.0},
    {"symbol": "HDFCBANK.NS", "name": "HDFC Bank Ltd", "type": "EQUITY", "base_price": 1640.0},
    {"symbol": "INFY.NS", "name": "Infosys Ltd", "type": "EQUITY", "base_price": 1820.0},
    {"symbol": "NIFTY50", "name": "Nifty 50 Index", "type": "INDEX", "base_price": 24500.0},
    {"symbol": "AAPL", "name": "Apple Inc", "type": "EQUITY", "base_price": 225.0},
    {"symbol": "NVDA", "name": "NVIDIA Corporation", "type": "EQUITY", "base_price": 128.0},
    {"symbol": "BTC-USD", "name": "Bitcoin USD", "type": "CRYPTO", "base_price": 62500.0},
]

class MarketDataEngine:
    """
    Market Data Abstraction Layer.
    Fetches OHLCV data from yfinance or generates realistic synthetic ticks.
    """

    @staticmethod
    def generate_synthetic_ohlcv(symbol: str, days: int = 100, base_price: float = 1000.0) -> pd.DataFrame:
        """
        Generates realistic random walk market bar sequence with volume and volatility.
        """
        np.random.seed(hash(symbol) % (2**32 - 1))
        end_date = datetime.now()
        dates = [end_date - timedelta(days=i) for i in range(days)]
        dates.reverse()

        returns = np.random.normal(loc=0.0005, scale=0.015, size=days)
        price_paths = base_price * np.cumprod(1 + returns)

        highs = price_paths * (1 + np.abs(np.random.normal(0, 0.008, days)))
        lows = price_paths * (1 - np.abs(np.random.normal(0, 0.008, days)))
        opens = lows + (highs - lows) * np.random.uniform(0.1, 0.9, days)
        volumes = np.random.randint(100000, 5000000, size=days)

        df = pd.DataFrame({
            'timestamp': [d.strftime('%Y-%m-%d') for d in dates],
            'open': np.round(opens, 2),
            'high': np.round(highs, 2),
            'low': np.round(lows, 2),
            'close': np.round(price_paths, 2),
            'volume': volumes
        })
        return df

    @classmethod
    def fetch_historical_ohlcv(cls, symbol: str, timeframe: str = "1d", period: str = "3mo") -> pd.DataFrame:
        """
        Fetches historical data with fallback to synthetic data if network fails.
        """
        if HAS_YFINANCE and yf is not None:
            try:
                ticker = yf.Ticker(symbol)
                df = ticker.history(period=period, interval=timeframe)
                if not df.empty and len(df) > 5:
                    df = df.reset_index()
                    date_col = 'Date' if 'Date' in df.columns else 'Datetime'
                    df['timestamp'] = df[date_col].dt.strftime('%Y-%m-%d %H:%M')
                    df = df.rename(columns={
                        'Open': 'open',
                        'High': 'high',
                        'Low': 'low',
                        'Close': 'close',
                        'Volume': 'volume'
                    })
                    return df[['timestamp', 'open', 'high', 'low', 'close', 'volume']]
            except Exception:
                pass

        # Fallback to high quality synthetic generator
        matched = next((item for item in DEFAULT_INSTRUMENTS if item['symbol'] == symbol), None)
        base = matched['base_price'] if matched else 1500.0
        return cls.generate_synthetic_ohlcv(symbol, days=90, base_price=base)

    @classmethod
    def get_symbol_chart_data(cls, symbol: str) -> Dict[str, Any]:
        """
        Returns OHLCV bars plus computed technical indicators.
        """
        df = cls.fetch_historical_ohlcv(symbol)
        df_ind = TechnicalIndicators.compute_all(df)
        
        # Format for JSON response
        bars = df_ind.to_dict(orient="records")
        latest = bars[-1] if bars else {}

        return {
            "symbol": symbol,
            "bars": bars,
            "latest_price": latest.get("close", 0.0),
            "latest_indicators": {
                "sma_20": latest.get("sma_20"),
                "ema_20": latest.get("ema_20"),
                "ema_50": latest.get("ema_50"),
                "rsi_14": latest.get("rsi_14"),
                "macd": latest.get("macd"),
                "macd_signal": latest.get("macd_signal"),
                "macd_hist": latest.get("macd_hist"),
                "bb_upper": latest.get("bb_upper"),
                "bb_middle": latest.get("bb_middle"),
                "bb_lower": latest.get("bb_lower"),
                "atr_14": latest.get("atr_14"),
                "vwap": latest.get("vwap"),
            }
        }
