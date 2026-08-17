import React from 'react';
import { 
  BarChart2, 
  Search, 
  Sliders, 
  History, 
  ShieldAlert, 
  Activity, 
  Bot, 
  AlertTriangle,
  UserCheck,
  LogOut,
  LogIn
} from 'lucide-react';
import { useTradingStore } from '../stores/useTradingStore';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    portfolio, 
    toggleKillSwitch, 
    toggleAssistant,
    isAssistantOpen,
    currentUser,
    setLoginModalOpen,
    logoutUser
  } = useTradingStore();

  const isKillSwitchActive = portfolio?.risk_profile.emergency_kill_switch ?? false;
  const isLive = portfolio?.mode === 'LIVE';

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 p-2 rounded-xl border border-indigo-500/30 text-indigo-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-slate-100 tracking-tight">QUANT-AI TERMINAL</h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400">Production AI Algorithmic Trading & Risk Engine</p>
          </div>
        </div>

        {/* Center Tabs Navigation */}
        <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'scanner'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            AI Scanner
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'builder'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Strategy Builder
          </button>

          <button
            onClick={() => setActiveTab('backtest')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'backtest'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            Backtesting
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'portfolio'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Portfolio & Risk
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'health'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            System Health
          </button>
        </nav>

        {/* Right Status & Controls */}
        <div className="flex items-center gap-3">
          
          {/* User Session Badge */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-950 p-1 pr-2.5 rounded-xl border border-slate-800">
              <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-mono font-bold text-xs">
                {currentUser.full_name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-bold text-xs text-slate-200 block truncate max-w-[120px]">{currentUser.full_name}</span>
                <span className="text-[9px] font-mono text-emerald-400 block uppercase font-semibold">VALUED PRO SESSION</span>
              </div>
              <button
                onClick={logoutUser}
                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition ml-1"
                title="End Authenticated Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setLoginModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              SIGN IN
            </button>
          )}

          {/* Mode Pill */}
          <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 border ${
            isLive 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
            {isLive ? 'LIVE MODE' : 'PAPER MODE'}
          </div>

          {/* Emergency Kill Switch Button */}
          <button
            onClick={toggleKillSwitch}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all border shadow-sm ${
              isKillSwitchActive
                ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Emergency Kill Switch - Immediately blocks all trade execution"
          >
            <AlertTriangle className="w-4 h-4" />
            {isKillSwitchActive ? 'KILL SWITCH: ACTIVE' : 'KILL SWITCH'}
          </button>

          {/* AI Assistant Drawer Trigger */}
          <button
            onClick={toggleAssistant}
            className={`p-2 rounded-lg transition-all border ${
              isAssistantOpen
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Toggle AI Trading Assistant Drawer"
          >
            <Bot className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
