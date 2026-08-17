import React, { useState } from 'react';
import { useTradingStore } from '../stores/useTradingStore';
import { TradingViewChart } from '../components/TradingViewChart';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Search, 
  DollarSign, 
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    selectedSymbol, 
    setSelectedSymbol, 
    chartBars, 
    marketItems, 
    aiSummary, 
    opportunities, 
    portfolio,
    submitPaperOrder 
  } = useTradingStore();

  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderQty, setOrderQty] = useState(10);
  const [stopLoss, setStopLoss] = useState(0);
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  const activeOpp = opportunities.find(o => o.symbol === selectedSymbol) || opportunities[0];
  const currentPrice = chartBars.length > 0 ? chartBars[chartBars.length - 1].close : 1000.0;

  const handleQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderFeedback(null);
    const sl = stopLoss > 0 ? stopLoss : (orderSide === 'BUY' ? currentPrice * 0.98 : currentPrice * 1.02);
    
    const res = await submitPaperOrder({
      symbol: selectedSymbol,
      side: orderSide,
      quantity: orderQty,
      price: currentPrice,
      stop_loss: sl
    });

    if (res.status === 'REJECTED') {
      setOrderFeedback(`❌ ${res.rejection_reason}`);
    } else {
      setOrderFeedback(`✅ Order FILLED: ${res.side} ${res.quantity} ${res.symbol} @ ₹${res.price}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top AI Market Summary Banner */}
      {aiSummary && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600/20 rounded-xl border border-indigo-500/30 text-indigo-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-100">AI MACRO MARKET SUMMARY</h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    REAL-TIME REGIME
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{aiSummary.disclaimer}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">CONDITION</span>
                <span className={`text-sm font-bold font-mono ${
                  aiSummary.condition === 'Bullish' ? 'text-emerald-400' : (aiSummary.condition === 'Bearish' ? 'text-rose-400' : 'text-amber-400')
                }`}>
                  {aiSummary.condition}
                </span>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">TREND STRENGTH</span>
                <span className="text-sm font-bold font-mono text-indigo-400">{aiSummary.trend_strength_pct}%</span>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">REGIME</span>
                <span className="text-sm font-bold font-mono text-slate-200">{aiSummary.market_regime}</span>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">AI CONFIDENCE</span>
                <span className="text-sm font-bold font-mono text-emerald-400">{aiSummary.ai_confidence_pct}%</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Market Overview Tickers Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {marketItems.map((item) => (
          <button
            key={item.symbol}
            onClick={() => setSelectedSymbol(item.symbol)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedSymbol === item.symbol
                ? 'bg-slate-800 border-indigo-500 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-200">{item.symbol}</span>
              <span className={`text-[10px] font-mono font-semibold ${
                item.change_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {item.change_pct >= 0 ? '+' : ''}{item.change_pct}%
              </span>
            </div>
            <div className="text-sm font-mono font-bold text-slate-100 mt-1">₹{item.price.toFixed(1)}</div>
            <div className="text-[10px] text-slate-500 truncate mt-0.5">{item.trend}</div>
          </button>
        ))}
      </div>

      {/* Main Chart + Quick Order Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Chart */}
        <div className="lg:col-span-2">
          <TradingViewChart symbol={selectedSymbol} bars={chartBars} />
        </div>

        {/* Right 1 Column: Trade Order Form & AI Opportunity Card */}
        <div className="space-y-6">
          
          {/* Quick Trade Execution Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-100">QUICK TRADE ORDER</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                RISK ENGINE GUARDED
              </span>
            </div>

            <form onSubmit={handleQuickOrder} className="space-y-3">
              
              {/* Side Selection */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderSide('BUY')}
                  className={`py-2 rounded-lg text-xs font-bold font-mono transition ${
                    orderSide === 'BUY' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  BUY / LONG
                </button>
                <button
                  type="button"
                  onClick={() => setOrderSide('SELL')}
                  className={`py-2 rounded-lg text-xs font-bold font-mono transition ${
                    orderSide === 'SELL' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  SELL / SHORT
                </button>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Target Symbol</label>
                <input
                  type="text"
                  value={selectedSymbol}
                  disabled
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={orderQty}
                    onChange={(e) => setOrderQty(Number(e.target.value))}
                    min={1}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Required Stop-Loss (₹)</label>
                  <input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(Number(e.target.value))}
                    placeholder={`e.g. ${(currentPrice * 0.98).toFixed(1)}`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-lg text-xs font-bold font-mono text-white transition shadow-lg ${
                  orderSide === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                }`}
              >
                SUBMIT PAPER ORDER
              </button>

            </form>

            {orderFeedback && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
                {orderFeedback}
              </div>
            )}
          </div>

          {/* AI Scanner Opportunity Signal Card for Active Symbol */}
          {activeOpp && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-300">AI SIGNAL DIAGNOSTIC</span>
                <span className="text-xs font-mono font-bold text-indigo-400">{activeOpp.confidence_pct}% CONFIDENCE</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Signal Recommendation</span>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeOpp.signal_type}
                </span>
              </div>

              <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <p className="font-mono">{activeOpp.reason}</p>
                <div className="mt-2 space-y-1">
                  {activeOpp.technical_factors.map((f, i) => (
                    <div key={i} className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <span>✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                <div>Stop Loss: <span className="text-rose-400 font-bold">₹{activeOpp.invalidation_stop}</span></div>
                <div>Target Price: <span className="text-emerald-400 font-bold">₹{activeOpp.target_price}</span></div>
                <div>Risk/Reward: <span className="text-white font-bold">1 : {activeOpp.risk_reward_ratio}</span></div>
                <div>Volatility: <span className="text-amber-400 font-bold">{activeOpp.volatility}</span></div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
