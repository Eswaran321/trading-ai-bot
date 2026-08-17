from typing import Dict, Any
from app.ai.scanner import AIScannerEngine
from app.execution.paper import paper_account

class AITradingAssistant:
    """
    Conversational AI Research & Assistant Engine.
    Provides explainable market analysis, signal diagnostics, and natural language query processing.
    """

    @classmethod
    def process_query(cls, user_query: str) -> Dict[str, Any]:
        query_lower = user_query.lower()
        
        # 1. Market Condition / Regime Query
        if "market condition" in query_lower or "market summary" in query_lower or "market trend" in query_lower:
            summary = AIScannerEngine.get_ai_market_summary()
            response_text = (
                f"**Market Overview Summary**\n\n"
                f"• **Condition**: {summary['condition']}\n"
                f"• **Regime**: {summary['market_regime']}\n"
                f"• **Trend Strength**: {summary['trend_strength_pct']}%\n"
                f"• **Volatility**: {summary['volatility_level']}\n"
                f"• **AI Confidence**: {summary['ai_confidence_pct']}%\n\n"
                f"_{summary['disclaimer']}_"
            )
            return {"query": user_query, "response": response_text, "category": "MARKET_SUMMARY"}

        # 2. Why Signal Generated Query
        elif "why" in query_lower and ("signal" in query_lower or "generated" in query_lower or "trade" in query_lower):
            opps = AIScannerEngine.get_all_opportunities()
            top_opp = opps[0] if opps else None
            if top_opp:
                factors_str = "\n".join([f"  ✓ {f}" for f in top_opp['technical_factors']])
                response_text = (
                    f"**Signal Diagnostic for {top_opp['symbol']} ({top_opp['signal_type']})**\n\n"
                    f"**Confidence**: {top_opp['confidence_pct']}%\n\n"
                    f"**Key Supporting Technical Indicators**:\n{factors_str}\n\n"
                    f"**Entry Zone**: ₹{top_opp['entry_zone_min']} - ₹{top_opp['entry_zone_max']}\n"
                    f"**Stop-Loss Invalidation**: ₹{top_opp['invalidation_stop']}\n"
                    f"**Target Price**: ₹{top_opp['target_price']}\n"
                    f"**Risk/Reward Ratio**: 1 : {top_opp['risk_reward_ratio']}"
                )
            else:
                response_text = "No active high-confidence signal found to analyze."
            return {"query": user_query, "response": response_text, "category": "SIGNAL_EXPLANATION"}

        # 3. High Momentum Instruments Query
        elif "high momentum" in query_lower or "opportunities" in query_lower or "gainers" in query_lower:
            opps = AIScannerEngine.get_all_opportunities()
            high_mom = [x for x in opps if x['momentum'] == 'Positive']
            items_str = "\n".join([f"• **{x['symbol']}** ({x['name']}) - Signal: {x['signal_type']}, Conf: {x['confidence_pct']}%" for x in high_mom[:4]])
            response_text = f"**Top High-Momentum Instruments Identified**:\n\n{items_str}"
            return {"query": user_query, "response": response_text, "category": "SCANNER"}

        # 4. Why Trade Rejected / Risk Engine Query
        elif "rejected" in query_lower or "reject" in query_lower:
            portfolio = paper_account.get_portfolio_summary()
            risk_prof = portfolio['risk_profile']
            response_text = (
                f"**Trade Rejection Diagnostic Checklist**:\n\n"
                f"If a trade was rejected by the system, it hit one of our hard safety gates:\n"
                f"1. **Emergency Kill Switch**: {'ACTIVE ❌' if risk_prof['emergency_kill_switch'] else 'Disabled (Normal) ✅'}\n"
                f"2. **Stop-Loss Required**: {'YES ✅' if risk_prof['require_stop_loss'] else 'NO'}\n"
                f"3. **Max Daily Loss Limit**: ${risk_prof['max_daily_loss_amount']}\n"
                f"4. **Max Open Position Limit**: {risk_prof['max_open_positions']} positions (Current: {portfolio['active_positions_count']})\n"
                f"5. **Available Cash Balance**: ${portfolio['cash_balance']:.2f}\n\n"
                f"Check your Risk Settings dashboard to adjust parameters or view exact rejection logs in Portfolio Order history."
            )
            return {"query": user_query, "response": response_text, "category": "RISK_DIAGNOSTIC"}

        # 5. Default General Trading Research Response
        else:
            response_text = (
                f"I am your Quantitative AI Research Assistant. I can explain market conditions, "
                f"diagnose why a signal was generated, list high-momentum opportunities, compare strategies, "
                f"or explain why a trade was rejected by our Risk Engine. What would you like to inspect?"
            )
            return {"query": user_query, "response": response_text, "category": "GENERAL"}
