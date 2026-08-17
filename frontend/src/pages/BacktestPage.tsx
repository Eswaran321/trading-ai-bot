import React, { useState } from 'react';
import { History, Play, TrendingUp, Award, BarChart3, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const BacktestPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  // Mock Vectorized Backtest Equity Curve Result
  const equityCurve = [
    { date: 'Jan', equity: 100000 },
    { date: 'Feb', equity: 104200 },
    { date: 'Mar', equity: 102800 },
    { date: 'Apr', equity: 109500 },
    { date: 'May', equity: 114100 },
    { date: 'Jun', equity: 112000 },
    { date: 'Jul', equity: 119800 },
    { date: 'Aug', equity: 126400 },
  ];

  const handleRunBacktest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100">VECTORIZED BACKTESTING ENGINE</h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              ZERO LOOK-AHEAD BIAS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulates historical trade signals with customizable slippage, commissions, trailing stops, and walk-forward verification.
          </p>
        </div>

        <button
          onClick={handleRunBacktest}
          disabled={isRunning}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Play className="w-4 h-4 fill-white" /> {isRunning ? 'RUNNING SIMULATION...' : 'RUN BACKTEST'}
        </button>
      </div>

      {/* Performance Summary Metrics Grid */}
      {hasRun && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block">TOTAL RETURN</span>
            <span className="text-base font-bold font-mono text-emerald-400">+26.4%</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block">CAGR</span>
            <span className="text-base font-bold font-mono text-indigo-400">31.2%</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block">WIN RATE</span>
            <span className="text-base font-bold font-mono text-emerald-400">64.5%</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block">SHARPE RATIO</span>
            <span className="text-base font-bold font-mono text-indigo-400">2.14</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block">SORTINO RATIO</span>
            <span className="text-base font-bold font-mono text-indigo-400">2.88</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block">MAX DRAWDOWN</span>
            <span className="text-base font-bold font-mono text-rose-400">-5.2%</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block">PROFIT FACTOR</span>
            <span className="text-base font-bold font-mono text-emerald-400">2.41</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block">TOTAL TRADES</span>
            <span className="text-base font-bold font-mono text-white">142</span>
          </div>

        </div>
      )}

      {/* Equity Curve Chart */}
      {hasRun && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-100">SIMULATED EQUITY CURVE</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Initial Capital: ₹1,00,000 → Final: ₹1,26,400</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityCurve} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 11 }} orientation="right" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="equity" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#equityGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
};
