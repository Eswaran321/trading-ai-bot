import uuid
from datetime import datetime
from typing import Dict, Any, List
from app.risk.engine import RiskEngine

class PaperExecutionEngine:
    """
    Paper Trading Execution & Portfolio Engine.
    Simulates realistic order matching, fills, slippage, and P&L tracking.
    """

    def __init__(self, initial_cash: float = 100000.0):
        self.portfolio_id = str(uuid.uuid4())
        self.cash_balance = initial_cash
        self.initial_cash = initial_cash
        self.realized_pnl = 0.0
        self.mode = "PAPER"
        self.positions: Dict[str, Dict[str, Any]] = {}
        self.orders: List[Dict[str, Any]] = []
        self.risk_profile = {
            "max_risk_per_trade_pct": 2.0,
            "max_daily_loss_amount": 2000.0,
            "max_portfolio_leverage": 1.0,
            "max_open_positions": 5,
            "require_stop_loss": True,
            "emergency_kill_switch": False,
            "live_trading_enabled": False
        }

    def get_portfolio_summary(self) -> Dict[str, Any]:
        invested_capital = 0.0
        unrealized_pnl = 0.0

        for symbol, pos in self.positions.items():
            qty = pos['quantity']
            avg_price = pos['avg_entry_price']
            curr_price = pos.get('current_price', avg_price)
            pos_unrealized = (curr_price - avg_price) * qty
            pos['unrealized_pnl'] = round(pos_unrealized, 2)
            invested_capital += (avg_price * qty)
            unrealized_pnl += pos_unrealized

        total_value = self.cash_balance + invested_capital + unrealized_pnl
        total_pnl = self.realized_pnl + unrealized_pnl
        today_pnl = total_pnl  # Simplification for session

        return {
            "portfolio_id": self.portfolio_id,
            "total_value": round(total_value, 2),
            "cash_balance": round(self.cash_balance, 2),
            "invested_capital": round(invested_capital, 2),
            "realized_pnl": round(self.realized_pnl, 2),
            "unrealized_pnl": round(unrealized_pnl, 2),
            "total_pnl": round(total_pnl, 2),
            "today_pnl": round(today_pnl, 2),
            "mode": self.mode,
            "active_positions_count": len(self.positions),
            "positions": list(self.positions.values()),
            "risk_profile": self.risk_profile
        }

    def submit_order(self, order_req: Dict[str, Any]) -> Dict[str, Any]:
        portfolio_state = self.get_portfolio_summary()
        
        # Risk Validation
        approved, reason = RiskEngine.validate_order(order_req, portfolio_state, self.risk_profile)

        order_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()
        symbol = order_req['symbol']
        side = order_req['side']
        qty = float(order_req['quantity'])
        price = float(order_req.get('price', 1000.0))

        order_record = {
            "id": order_id,
            "symbol": symbol,
            "side": side,
            "quantity": qty,
            "price": price,
            "stop_loss": order_req.get('stop_loss'),
            "take_profit": order_req.get('take_profit'),
            "mode": self.mode,
            "status": "FILLED" if approved else "REJECTED",
            "rejection_reason": None if approved else reason,
            "created_at": timestamp
        }

        if approved:
            # Simulate Fill
            trade_value = price * qty
            if side == "BUY":
                self.cash_balance -= trade_value
                if symbol in self.positions:
                    existing = self.positions[symbol]
                    old_qty = existing['quantity']
                    new_qty = old_qty + qty
                    new_avg = ((existing['avg_entry_price'] * old_qty) + trade_value) / new_qty
                    existing['quantity'] = new_qty
                    existing['avg_entry_price'] = round(new_avg, 2)
                    existing['current_price'] = price
                else:
                    self.positions[symbol] = {
                        "id": str(uuid.uuid4()),
                        "symbol": symbol,
                        "quantity": qty,
                        "avg_entry_price": price,
                        "current_price": price,
                        "unrealized_pnl": 0.0,
                        "side": "BUY"
                    }
            elif side == "SELL":
                if symbol in self.positions:
                    pos = self.positions[symbol]
                    fill_qty = min(pos['quantity'], qty)
                    pnl = (price - pos['avg_entry_price']) * fill_qty
                    self.realized_pnl += pnl
                    self.cash_balance += (price * fill_qty)
                    pos['quantity'] -= fill_qty
                    if pos['quantity'] <= 0:
                        del self.positions[symbol]

        self.orders.insert(0, order_record)
        return order_record

    def update_risk_profile(self, new_settings: Dict[str, Any]) -> Dict[str, Any]:
        for k, v in new_settings.items():
            if v is not None and k in self.risk_profile:
                self.risk_profile[k] = v
        return self.risk_profile

# Global singleton paper trading instance for dev demo
paper_account = PaperExecutionEngine(initial_cash=100000.0)
