import React, { useState } from 'react';
import { Sliders, Sparkles, Code, Play, CheckCircle, Save, BookOpen } from 'lucide-react';

export const BuilderPage: React.FC = () => {
  const [strategyName, setStrategyName] = useState('My Momentum Trend Strategy');
  const [aiPrompt, setAiPrompt] = useState('Create a momentum strategy using EMA20, EMA50, RSI and volume. Risk 1% of capital per trade.');
  const [generatedRules, setGeneratedRules] = useState<string | null>(null);

  const sampleLibrary = [
    { name: "EMA Trend Following", desc: "EMA20 > EMA50 with ADX > 25 confirmation", regime: "Trending Bull" },
    { name: "High Momentum Breakout", desc: "RSI > 60 + Volume > 1.5x 20-day Average", regime: "Trending Bull" },
    { name: "Mean Reversion Oversold", desc: "RSI < 30 + Price below Lower Bollinger Band", regime: "Sideways" },
    { name: "VWAP Intraday Momentum", desc: "Price > VWAP + MACD Histogram Positive", regime: "All Regimes" },
    { name: "ATR Volatility Expansion", desc: "ATR(14) > 1.5x SMA(ATR) Breakout", regime: "High Volatility" },
  ];

  const handleAIGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedRules(
      `IF RSI(14) < 35\nAND EMA(20) > EMA(50)\nAND Volume > AvgVolume(20)\nAND MarketRegime == "Trending Bull"\nTHEN BUY\n\nRISK MANAGEMENT:\nStop-Loss = Entry - 1.5 * ATR(14)\nTake-Profit = Entry + 3.0 * ATR(14)\nPosition Size = 1.0% of Capital`
    );
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100">STRATEGY BUILDER & AI GENERATOR</h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              NO-CODE / LOW-CODE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build custom strategies visually, generate rules via natural language prompts, or select from built-in quant examples.
          </p>
        </div>

        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20">
          <Save className="w-4 h-4" /> SAVE STRATEGY TO LIBRARY
        </button>
      </div>

      {/* Grid: AI Natural Language Generator + Visual Rule Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Natural Language Prompt Generator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-100">AI STRATEGY GENERATOR</h3>
          </div>

          <form onSubmit={handleAIGenerate} className="space-y-3">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Describe strategy in natural language:</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Sparkles className="w-4 h-4" /> CONVERT TO STRUCTURED RULES
            </button>
          </form>

          {generatedRules && (
            <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-indigo-400 font-bold border-b border-slate-800 pb-2">
                <span>AI GENERATED RULE STRUCTURE</span>
                <span>REQUIRE USER APPROVAL</span>
              </div>
              <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {generatedRules}
              </pre>
            </div>
          )}

        </div>

        {/* Built-In Example Quant Library */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-100">BUILT-IN QUANT STRATEGY LIBRARY</h3>
          </div>

          <div className="space-y-3">
            {sampleLibrary.map((item, i) => (
              <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-xs text-slate-200">{item.name}</h4>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-slate-800 text-indigo-300 border border-slate-700 flex-shrink-0">
                  {item.regime}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
