import React, { useState } from 'react';
import { useTradingStore } from '../stores/useTradingStore';
import { Search, Zap, Filter, ArrowUpRight, ArrowDownRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { OpportunitySignal } from '../types';

export const ScannerPage: React.FC = () => {
  const { opportunities, setSelectedSymbol, setActiveTab } = useTradingStore();
  const [filterSignal, setFilterSignal] = useState<string>('ALL');

  const filteredOpps = opportunities.filter(opp => {
    if (filterSignal === 'ALL') return true;
    return opp.signal_type === filterSignal;
  });

  const handleSelectToTrade = (symbol: string) => {
    setSelectedSymbol(symbol);
    setActiveTab('dashboard');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Scanner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100">AI OPPORTUNITY SCANNER</h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              MULTI-FACTOR EVALUATOR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuously scans supported instruments using multi-factor indicator confirmation and risk/reward modeling.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <span className="text-xs font-mono text-slate-400 px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['ALL', 'BUY CANDIDATE', 'WATCH', 'SELL CANDIDATE'].map((sig) => (
            <button
              key={sig}
              onClick={() => setFilterSignal(sig)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition ${
                filterSignal === sig ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sig}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpps.map((opp) => (
          <div
            key={opp.symbol}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition flex flex-col justify-between gap-4"
          >
            <div>
              
              {/* Card Top Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-100">{opp.symbol}</h3>
                  <span className="text-xs text-slate-400">{opp.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-slate-100">₹{opp.current_price.toFixed(2)}</span>
                  <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-emerald-400 mt-0.5">
                    CONFIDENCE: <span className="font-bold">{opp.confidence_pct}%</span>
                  </div>
                </div>
              </div>

              {/* Signal Badge */}
              <div className="my-3 flex items-center justify-between">
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border ${
                  opp.signal_type === 'BUY CANDIDATE'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : (opp.signal_type === 'WATCH' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30')
                }`}>
                  {opp.signal_type}
                </span>

                <span className="text-xs font-mono text-slate-400">
                  R:R Ratio <span className="text-white font-bold">1 : {opp.risk_reward_ratio}</span>
                </span>
              </div>

              {/* Reason Explanation */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs space-y-2">
                <p className="text-slate-300 font-mono text-[11px] leading-relaxed">{opp.reason}</p>
                <div className="space-y-1 pt-1 border-t border-slate-800">
                  {opp.technical_factors.map((factor, i) => (
                    <div key={i} className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Entry Zone & Stop/Target Levels */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 mt-3 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block">ENTRY ZONE</span>
                  <span className="text-slate-200">₹{opp.entry_zone_min} - ₹{opp.entry_zone_max}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">INVALIDATION (STOP)</span>
                  <span className="text-rose-400 font-bold">₹{opp.invalidation_stop}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">TARGET</span>
                  <span className="text-emerald-400 font-bold">₹{opp.target_price}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">TREND / VOLATILITY</span>
                  <span className="text-indigo-400">{opp.trend} ({opp.volatility})</span>
                </div>
              </div>

            </div>

            <button
              onClick={() => handleSelectToTrade(opp.symbol)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20"
            >
              LOAD CHART & EXECUTE ORDER <ArrowUpRight className="w-4 h-4" />
            </button>

          </div>
        ))}
      </div>

    </div>
  );
};
