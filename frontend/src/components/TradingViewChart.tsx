import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { OHLCVBar } from '../types';
import { Eye, TrendingUp, Activity } from 'lucide-react';

interface ChartProps {
  symbol: string;
  bars: OHLCVBar[];
}

export const TradingViewChart: React.FC<ChartProps> = ({ symbol, bars }) => {
  const [showEMA, setShowEMA] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [showMACD, setShowMACD] = useState(false);
  const [showBB, setShowBB] = useState(false);
  const [showVWAP, setShowVWAP] = useState(true);

  if (!bars || bars.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex items-center justify-center text-slate-500 font-mono text-sm h-96">
        Loading chart bars for {symbol}...
      </div>
    );
  }

  const latest = bars[bars.length - 1];
  const first = bars[0];
  const priceDiff = latest.close - first.close;
  const priceChangePct = ((priceDiff / first.close) * 100).toFixed(2);
  const isPositive = priceDiff >= 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 shadow-xl">
      
      {/* Chart Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100">{symbol}</h2>
            <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
              isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {isPositive ? '+' : ''}{priceChangePct}%
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Latest Close: <span className="text-white font-bold">₹{latest.close.toFixed(2)}</span> | High: ₹{latest.high.toFixed(2)} | Low: ₹{latest.low.toFixed(2)}
          </p>
        </div>

        {/* Technical Indicators Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 px-2 uppercase">Indicators:</span>
          
          <button
            onClick={() => setShowEMA(!showEMA)}
            className={`px-2 py-1 rounded text-[11px] font-mono transition ${
              showEMA ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            EMA (20/50)
          </button>

          <button
            onClick={() => setShowVWAP(!showVWAP)}
            className={`px-2 py-1 rounded text-[11px] font-mono transition ${
              showVWAP ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            VWAP
          </button>

          <button
            onClick={() => setShowBB(!showBB)}
            className={`px-2 py-1 rounded text-[11px] font-mono transition ${
              showBB ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Bollinger
          </button>

          <button
            onClick={() => setShowRSI(!showRSI)}
            className={`px-2 py-1 rounded text-[11px] font-mono transition ${
              showRSI ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            RSI
          </button>

          <button
            onClick={() => setShowMACD(!showMACD)}
            className={`px-2 py-1 rounded text-[11px] font-mono transition ${
              showMACD ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            MACD
          </button>
        </div>

      </div>

      {/* Main Price & Indicators Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={bars} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 10 }} orientation="right" />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
              labelStyle={{ color: '#94a3b8' }}
            />

            {/* Price Line */}
            <Line type="monotone" dataKey="close" stroke="#38bdf8" strokeWidth={2} dot={false} name="Close Price" />

            {/* EMA Lines */}
            {showEMA && (
              <>
                <Line type="monotone" dataKey="ema_20" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="EMA 20" />
                <Line type="monotone" dataKey="ema_50" stroke="#ec4899" strokeWidth={1.5} dot={false} name="EMA 50" />
              </>
            )}

            {/* VWAP */}
            {showVWAP && (
              <Line type="monotone" dataKey="vwap" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="VWAP" />
            )}

            {/* Bollinger Bands */}
            {showBB && (
              <>
                <Line type="monotone" dataKey="bb_upper" stroke="#8b5cf6" strokeWidth={1} dot={false} name="BB Upper" />
                <Line type="monotone" dataKey="bb_lower" stroke="#8b5cf6" strokeWidth={1} dot={false} name="BB Lower" />
              </>
            )}

            {/* Volume Bar */}
            <Bar dataKey="volume" yAxisId={1} fill="#334155" opacity={0.3} name="Volume" />
            <YAxis yAxisId={1} hide domain={[0, 'auto']} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Sub-Chart: RSI or MACD if toggled */}
      {showRSI && (
        <div className="h-28 w-full border-t border-slate-800 pt-2">
          <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2">RSI (14) Indicator Sub-Chart</span>
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={bars} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 9 }} orientation="right" />
              <Line type="monotone" dataKey="rsi_14" stroke="#10b981" strokeWidth={1.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {showMACD && (
        <div className="h-28 w-full border-t border-slate-800 pt-2">
          <span className="text-[10px] font-mono text-blue-400 font-semibold px-2">MACD Histogram Sub-Chart</span>
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={bars} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 9 }} orientation="right" />
              <Bar dataKey="macd_hist" fill="#3b82f6" name="MACD Hist" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
};
