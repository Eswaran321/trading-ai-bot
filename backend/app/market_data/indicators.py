import numpy as np
import pandas as pd
from typing import Dict, Any

class TechnicalIndicators:
    """
    High-performance technical indicator calculations using vectorized Pandas/NumPy.
    """

    @staticmethod
    def calculate_sma(series: pd.Series, period: int = 20) -> pd.Series:
        return series.rolling(window=period).mean()

    @staticmethod
    def calculate_ema(series: pd.Series, period: int = 20) -> pd.Series:
        return series.ewm(span=period, adjust=False).mean()

    @staticmethod
    def calculate_rsi(series: pd.Series, period: int = 14) -> pd.Series:
        delta = series.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        
        # Avoid division by zero
        loss = loss.replace(0, 1e-10)
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi

    @staticmethod
    def calculate_macd(series: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9) -> Dict[str, pd.Series]:
        ema_fast = series.ewm(span=fast, adjust=False).mean()
        ema_slow = series.ewm(span=slow, adjust=False).mean()
        macd_line = ema_fast - ema_slow
        signal_line = macd_line.ewm(span=signal, adjust=False).mean()
        histogram = macd_line - signal_line
        return {
            "macd": macd_line,
            "signal": signal_line,
            "hist": histogram
        }

    @staticmethod
    def calculate_bollinger_bands(series: pd.Series, period: int = 20, num_std: float = 2.0) -> Dict[str, pd.Series]:
        sma = series.rolling(window=period).mean()
        std = series.rolling(window=period).std()
        upper = sma + (std * num_std)
        lower = sma - (std * num_std)
        return {
            "upper": upper,
            "middle": sma,
            "lower": lower
        }

    @staticmethod
    def calculate_atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
        high = df['high']
        low = df['low']
        close = df['close']
        
        tr1 = high - low
        tr2 = (high - close.shift(1)).abs()
        tr3 = (low - close.shift(1)).abs()
        
        tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
        atr = tr.rolling(window=period).mean()
        return atr

    @staticmethod
    def calculate_vwap(df: pd.DataFrame) -> pd.Series:
        typical_price = (df['high'] + df['low'] + df['close']) / 3.0
        tp_volume = typical_price * df['volume']
        cumulative_tpv = tp_volume.cumsum()
        cumulative_vol = df['volume'].cumsum().replace(0, 1e-10)
        return cumulative_tpv / cumulative_vol

    @classmethod
    def compute_all(cls, df: pd.DataFrame) -> pd.DataFrame:
        """
        Appends all technical indicator columns to the OHLCV DataFrame.
        """
        data = df.copy()
        data['sma_20'] = cls.calculate_sma(data['close'], 20)
        data['ema_20'] = cls.calculate_ema(data['close'], 20)
        data['ema_50'] = cls.calculate_ema(data['close'], 50)
        data['rsi_14'] = cls.calculate_rsi(data['close'], 14)
        
        macd_dict = cls.calculate_macd(data['close'])
        data['macd'] = macd_dict['macd']
        data['macd_signal'] = macd_dict['signal']
        data['macd_hist'] = macd_dict['hist']

        bb_dict = cls.calculate_bollinger_bands(data['close'])
        data['bb_upper'] = bb_dict['upper']
        data['bb_middle'] = bb_dict['middle']
        data['bb_lower'] = bb_dict['lower']

        data['atr_14'] = cls.calculate_atr(data)
        data['vwap'] = cls.calculate_vwap(data)

        return data
