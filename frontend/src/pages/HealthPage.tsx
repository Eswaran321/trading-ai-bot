import React from 'react';
import { useTradingStore } from '../stores/useTradingStore';
import { Activity, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

export const HealthPage: React.FC = () => {
  const { systemHealth, fetchHealth } = useTradingStore();

  if (!systemHealth) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        Loading System Health metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100">SYSTEM HEALTH & INFRASTRUCTURE</h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {systemHealth.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status monitor of data streams, risk gates, database, and broker interfaces.
          </p>
        </div>

        <button onClick={fetchHealth} className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Component Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemHealth.components.map((comp, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100">{comp.name}</h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 border ${
                comp.status === 'ONLINE' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : (comp.status === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20')
              }`}>
                {comp.status === 'ONLINE' && <CheckCircle className="w-3 h-3" />}
                {comp.status === 'WARNING' && <AlertTriangle className="w-3 h-3" />}
                {comp.status === 'ERROR' && <XCircle className="w-3 h-3" />}
                {comp.status}
              </span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="text-slate-400">Latency: <span className="text-white font-bold">{comp.latency_ms} ms</span></div>
              <p className="text-slate-300 text-[11px] leading-relaxed pt-1">{comp.details}</p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
