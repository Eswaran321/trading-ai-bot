export interface OHLCVBar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma_20?: number;
  ema_20?: number;
  ema_50?: number;
  rsi_14?: number;
  macd?: number;
  macd_signal?: number;
  macd_hist?: number;
  bb_upper?: number;
  bb_middle?: number;
  bb_lower?: number;
  atr_14?: number;
  vwap?: number;
}

export interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change_pct: number;
  high_24h: number;
  low_24h: number;
  volume_24h: number;
  trend: 'Bullish' | 'Bearish' | 'Neutral';
  momentum: 'Positive' | 'Negative' | 'Moderate' | 'Neutral';
  volatility: 'Low' | 'Moderate' | 'High';
}

export interface AIMarketSummary {
  condition: string;
  trend_strength_pct: number;
  volatility_level: string;
  market_regime: string;
  ai_confidence_pct: number;
  disclaimer: string;
}

export interface OpportunitySignal {
  symbol: string;
  name: string;
  current_price: number;
  signal_type: 'BUY CANDIDATE' | 'WATCH' | 'NEUTRAL' | 'SELL CANDIDATE';
  confidence_pct: number;
  trend: string;
  momentum: string;
  volatility: string;
  entry_zone_min: number;
  entry_zone_max: number;
  invalidation_stop: number;
  target_price: number;
  risk_reward_ratio: number;
  reason: string;
  technical_factors: string[];
}

export interface RiskProfile {
  max_risk_per_trade_pct: number;
  max_daily_loss_amount: number;
  max_portfolio_leverage: number;
  max_open_positions: number;
  require_stop_loss: boolean;
  emergency_kill_switch: boolean;
  live_trading_enabled: boolean;
}

export interface Position {
  id: string;
  symbol: string;
  quantity: number;
  avg_entry_price: number;
  current_price: number;
  unrealized_pnl: number;
  side: 'BUY' | 'SELL';
}

export interface Order {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  stop_loss?: number;
  take_profit?: number;
  mode: 'PAPER' | 'LIVE';
  status: 'FILLED' | 'REJECTED' | 'PENDING';
  rejection_reason?: string;
  created_at: string;
}

export interface PortfolioSummary {
  portfolio_id: string;
  total_value: number;
  cash_balance: number;
  invested_capital: number;
  realized_pnl: number;
  unrealized_pnl: number;
  total_pnl: number;
  today_pnl: number;
  mode: 'PAPER' | 'LIVE';
  active_positions_count: number;
  positions: Position[];
  risk_profile: RiskProfile;
}

export interface ComponentHealth {
  name: string;
  status: 'ONLINE' | 'WARNING' | 'ERROR';
  latency_ms: number;
  details: string;
}

export interface SystemHealth {
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  timestamp: string;
  components: ComponentHealth[];
}
