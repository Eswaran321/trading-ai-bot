import React, { useState } from 'react';
import { useTradingStore } from '../stores/useTradingStore';
import { ShieldAlert, DollarSign, AlertTriangle, CheckCircle, Lock, Sliders, RefreshCw } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const { portfolio, orders, toggleKillSwitch, fetchPortfolio } = useTradingStore();

  const [maxRisk, setMaxRisk] = useState(portfolio?.risk_profile.max_risk_per_trade_pct ?? 2.0);
  const [maxDailyLoss, setMaxDailyLoss] = useState(portfolio?.risk_profile.max_daily_loss_amount ?? 2000);
  const [requireStopLoss, setRequireStopLoss] = useState(portfolio?.risk_profile.require_stop_loss ?? true);
  const [liveMode, setLiveMode] = useState(portfolio?.risk_profile.live_trading_enabled ?? false);

  if (!portfolio) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        Loading Portfolio & Risk Data...
      </div>
    );
  }

  const isKillSwitchActive = portfolio.risk_profile.emergency_kill_switch;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Portfolio Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <span className="text-xs font-mono text-slate-400">TOTAL PORTFOLIO VALUE</span>
          <div className="text-xl font-bold font-mono text-slate-100 mt-1">₹{portfolio.total_value.toFixed(2)}</div>
          <span className="text-[10px] text-slate-500 font-mono">Mode: {portfolio.mode} TRADING</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <span className="text-xs font-mono text-slate-400">AVAILABLE CASH BALANCE</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">₹{portfolio.cash_balance.toFixed(2)}</div>
          <span className="text-[10px] text-slate-500 font-mono">Invested: ₹{portfolio.invested_capital.toFixed(2)}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <span className="text-xs font-mono text-slate-400">REALIZED P&L</span>
          <div className={`text-xl font-bold font-mono mt-1 ${
            portfolio.realized_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {portfolio.realized_pnl >= 0 ? '+' : ''}₹{portfolio.realized_pnl.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Closed trades cumulative</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <span className="text-xs font-mono text-slate-400">UNREALIZED P&L</span>
          <div className={`text-xl font-bold font-mono mt-1 ${
            portfolio.unrealized_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {portfolio.unrealized_pnl >= 0 ? '+' : ''}₹{portfolio.unrealized_pnl.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Active positions mark-to-market</span>
        </div>

      </div>

      {/* Grid: Active Positions + Hard Risk Management Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Positions & Order History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Positions Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100">ACTIVE POSITIONS ({portfolio.positions.length})</h3>
              <button onClick={fetchPortfolio} className="text-slate-400 hover:text-slate-200">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {portfolio.positions.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-slate-500">
                No active positions held in portfolio.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2">SYMBOL</th>
                      <th className="py-2">QTY</th>
                      <th className="py-2">AVG ENTRY</th>
                      <th className="py-2">CURRENT</th>
                      <th className="py-2 text-right">UNREALIZED P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.positions.map((pos) => (
                      <tr key={pos.id} className="border-b border-slate-800/60 text-slate-200">
                        <td className="py-2.5 font-bold">{pos.symbol}</td>
                        <td className="py-2.5">{pos.quantity}</td>
                        <td className="py-2.5">₹{pos.avg_entry_price}</td>
                        <td className="py-2.5">₹{pos.current_price}</td>
                        <td className={`py-2.5 text-right font-bold ${
                          pos.unrealized_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {pos.unrealized_pnl >= 0 ? '+' : ''}₹{pos.unrealized_pnl.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Order Audit Trail Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-3">ORDER HISTORY & AUDIT TRAIL</h3>
            {orders.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-slate-500">
                No orders recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2">TIME</th>
                      <th className="py-2">SYMBOL</th>
                      <th className="py-2">SIDE</th>
                      <th className="py-2">QTY</th>
                      <th className="py-2">PRICE</th>
                      <th className="py-2">STATUS</th>
                      <th className="py-2">DETAILS / REJECTION REASON</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id} className="border-b border-slate-800/60 text-slate-200">
                        <td className="py-2.5 text-slate-500 text-[10px]">{ord.created_at.substring(11, 19)}</td>
                        <td className="py-2.5 font-bold">{ord.symbol}</td>
                        <td className={`py-2.5 font-bold ${ord.side === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>{ord.side}</td>
                        <td className="py-2.5">{ord.quantity}</td>
                        <td className="py-2.5">₹{ord.price}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.status === 'FILLED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-[11px] text-slate-400">{ord.rejection_reason || 'Filled at market price'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Hard Risk Management Settings */}
        <div className="space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-100">HARD RISK ENGINE SETTINGS</h3>
            </div>

            {/* Emergency Kill Switch */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-200 block">EMERGENCY KILL SWITCH</span>
                <span className="text-[11px] text-slate-400">Instantly blocks all trade execution</span>
              </div>
              <button
                onClick={toggleKillSwitch}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition ${
                  isKillSwitchActive ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isKillSwitchActive ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            {/* Parameters */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Max Risk Per Trade (%)</label>
                <input
                  type="number"
                  value={maxRisk}
                  onChange={(e) => setMaxRisk(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Max Daily Loss Limit (₹)</label>
                <input
                  type="number"
                  value={maxDailyLoss}
                  onChange={(e) => setMaxDailyLoss(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs font-mono text-slate-300">Require Hard Stop-Loss</span>
                <input
                  type="checkbox"
                  checked={requireStopLoss}
                  onChange={(e) => setRequireStopLoss(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 opacity-60">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-xs font-mono text-slate-300">Live Trading Safeguard</span>
                </div>
                <span className="text-[10px] font-mono text-rose-400 font-bold uppercase bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  DISABLED BY DEFAULT
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
