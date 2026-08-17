import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, HelpCircle, ShieldAlert } from 'lucide-react';
import { useTradingStore } from '../stores/useTradingStore';

export const AIAssistantDrawer: React.FC = () => {
  const { isAssistantOpen, toggleAssistant, assistantMessages, sendAssistantQuery } = useTradingStore();
  const [inputQuery, setInputQuery] = useState('');

  if (!isAssistantOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    const q = inputQuery;
    setInputQuery('');
    await sendAssistantQuery(q);
  };

  const handlePresetClick = (preset: string) => {
    sendAssistantQuery(preset);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col transition-all duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">AI Trading Assistant</h3>
            <p className="text-[11px] text-slate-400">Explainable Quant Research Engine</p>
          </div>
        </div>
        <button 
          onClick={toggleAssistant}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Preset Suggestions */}
      <div className="p-3 bg-slate-950/40 border-b border-slate-800 flex flex-wrap gap-1.5">
        <button
          onClick={() => handlePresetClick("What is current market condition?")}
          className="text-[11px] bg-slate-800/80 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 px-2.5 py-1 rounded-full border border-slate-700 transition"
        >
          📈 Market Condition
        </button>
        <button
          onClick={() => handlePresetClick("Why did AI generate this signal?")}
          className="text-[11px] bg-slate-800/80 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 px-2.5 py-1 rounded-full border border-slate-700 transition"
        >
          🔍 Signal Diagnostics
        </button>
        <button
          onClick={() => handlePresetClick("Why was my trade rejected?")}
          className="text-[11px] bg-slate-800/80 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 px-2.5 py-1 rounded-full border border-slate-700 transition"
        >
          🛡️ Trade Rejection
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {assistantMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none font-mono whitespace-pre-wrap'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Footer Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask AI about market, signals, or risks..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
