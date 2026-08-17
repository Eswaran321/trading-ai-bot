# AI Algorithmic Trading Platform — Master Workstation

Production-grade, high-performance **AI Trading Platform** built for real-time market analysis, strategy creation, vector backtesting, paper trading, and hard risk management.

---

## 🌟 Key Features Implemented

1. **Real-Time Market Analysis & Charting**
   - Interactive financial charts featuring EMA (20/50), SMA (20), RSI (14), MACD Histogram, Bollinger Bands, and VWAP indicators.
   - Market overview cards with 24h price change, trend, momentum, and volatility classification.

2. **AI Market Regime Summary & Opportunity Scanner**
   - Real-time macro regime classifier (Trending Bull, Trending Bear, Sideways).
   - AI Opportunity Scanner with multi-factor technical confirmation, confidence scoring (0-100%), entry zones, invalidation stop-loss, target price, and risk/reward ratios.

3. **Hard Risk Management Engine (6 Safety Gates)**
   - **Gate 1**: Mode Check (Paper / Live safeguard).
   - **Gate 2**: Global Emergency Kill Switch (Instantly blocks all orders).
   - **Gate 3**: Maximum Daily Loss Limit enforcement.
   - **Gate 4**: Maximum Open Position Count check.
   - **Gate 5**: Hard Stop-Loss Requirement.
   - **Gate 6**: Capital & Per-Trade Risk % validation.

4. **Paper Trading & Order Audit Trail**
   - Simulated market order fills with real-time portfolio cash, invested capital, mark-to-market unrealized P&L, and audit trail of filled & rejected orders.

5. **Conversational AI Research Assistant**
   - Sliding drawer assistant explaining market conditions, signal diagnostics, trade rejections, and indicator explanations.

6. **Strategy Builder & Vectorized Backtester**
   - Natural language strategy prompt generator to structured rules.
   - Built-in Quant Example Strategy Library (EMA Trend Following, High Momentum Breakout, Oversold Mean Reversion, VWAP Intraday, ATR Volatility).
   - Vectorized backtester calculating Sharpe Ratio, Sortino Ratio, CAGR, Win Rate, Max Drawdown, and Equity Curve.

7. **System Health & Infrastructure Monitor**
   - Real-time latency & health monitor for market data feeds, risk gates, paper matching engine, AI scanner, database, and broker adapters.

---

## 🚀 Quick Start Guide

### 1. Start the Backend API (FastAPI)
```bash
cd backend
python -m uvicorn app.main:app --port 8000 --reload
```
- Interactive API Docs: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/api/v1/system/health`

### 2. Run Backend Unit Tests
```bash
cd backend
python run_tests.py
```

### 3. Start the Frontend Workspace (React + Vite)
```bash
cd frontend
npm run dev
```
- Open browser at: `http://localhost:5173`

---

## 🛡️ Safety & Safeguards
- **Live Trading**: Disabled by default (`PAPER` mode active).
- **Kill Switch**: Available at the top right header on all screens to immediately freeze execution.
- **AI Disclaimer**: AI predictions represent analytical probabilities, not guaranteed financial outcomes. All signals must strictly pass through the Risk Engine pipeline.
