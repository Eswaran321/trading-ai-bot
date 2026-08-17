from typing import Dict, Any, Tuple
from app.core.config import settings

class RiskEngine:
    """
    Hard Safety & Risk Management Engine.
    Evaluates every order against strict quantitative safety gates.
    """

    @classmethod
    def validate_order(
        cls,
        order_data: Dict[str, Any],
        portfolio_state: Dict[str, Any],
        risk_profile: Dict[str, Any]
    ) -> Tuple[bool, str]:
        """
        Validates order against 6 hard risk gates.
        Returns (is_approved: bool, rejection_reason: str).
        """
        symbol = order_data.get('symbol')
        side = order_data.get('side', 'BUY')
        qty = float(order_data.get('quantity', 0.0))
        price = float(order_data.get('price', 0.0))
        stop_loss = order_data.get('stop_loss')
        mode = order_data.get('mode', 'PAPER')

        cash_balance = float(portfolio_state.get('cash_balance', 100000.0))
        realized_pnl = float(portfolio_state.get('realized_pnl', 0.0))
        unrealized_pnl = float(portfolio_state.get('unrealized_pnl', 0.0))
        active_positions_count = int(portfolio_state.get('active_positions_count', 0))

        # Gate 1: Mode Check
        live_enabled = risk_profile.get('live_trading_enabled', settings.LIVE_TRADING_ENABLED)
        if mode == "LIVE" and not live_enabled:
            return False, "REJECTED [Gate 1]: Live trading is disabled in risk profile settings."

        # Gate 2: Emergency Kill Switch
        if risk_profile.get('emergency_kill_switch', False):
            return False, "REJECTED [Gate 2]: Emergency Kill Switch is ACTIVE. All trading blocked."

        # Gate 3: Daily Loss Check
        max_daily_loss = float(risk_profile.get('max_daily_loss_amount', settings.MAX_DAILY_LOSS_AMOUNT))
        todays_loss = abs(min(0.0, realized_pnl + unrealized_pnl))
        if todays_loss >= max_daily_loss:
            return False, f"REJECTED [Gate 3]: Today's loss (${todays_loss:.2f}) reached max daily limit (${max_daily_loss:.2f})."

        # Gate 4: Maximum Position Count
        max_pos = int(risk_profile.get('max_open_positions', 5))
        if side == "BUY" and active_positions_count >= max_pos:
            return False, f"REJECTED [Gate 4]: Maximum open position count ({max_pos}) reached."

        # Gate 5: Required Stop-Loss Requirement
        require_sl = risk_profile.get('require_stop_loss', settings.REQUIRE_STOP_LOSS)
        if require_sl and (stop_loss is None or float(stop_loss) <= 0.0):
            return False, "REJECTED [Gate 5]: Hard risk policy requires a valid Stop-Loss price for every trade."

        # Gate 6: Available Capital & Per-Trade Risk Check
        order_cost = price * qty
        if side == "BUY" and order_cost > cash_balance:
            return False, f"REJECTED [Gate 6]: Insufficient cash balance. Order cost (${order_cost:.2f}) > Available (${cash_balance:.2f})."

        max_risk_pct = float(risk_profile.get('max_risk_per_trade_pct', settings.MAX_RISK_PER_TRADE_PCT))
        if stop_loss and price > 0:
            per_share_risk = abs(price - float(stop_loss))
            total_trade_risk = per_share_risk * qty
            max_allowed_risk = (cash_balance * max_risk_pct) / 100.0
            if total_trade_risk > max_allowed_risk:
                return False, f"REJECTED [Gate 6]: Trade risk (${total_trade_risk:.2f}) exceeds max allowed per-trade risk (${max_allowed_risk:.2f})."

        return True, "APPROVED: Order passed all hard risk gates."
