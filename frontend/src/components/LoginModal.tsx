import React, { useState } from 'react';
import { X, Lock, Mail, UserCheck, Shield, Sparkles, LogIn } from 'lucide-react';
import { useTradingStore } from '../stores/useTradingStore';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setLoginModalOpen, loginUser } = useTradingStore();
  const [email, setEmail] = useState('valued.user@quantai.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginUser(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate login session');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickValuedUserLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginUser('valued.user@quantai.com', 'password123');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setLoginModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <UserCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">VALUED USER LOGIN SESSION</h2>
          <p className="text-xs text-slate-400">Authenticate session to access live algorithmic execution & risk controls.</p>
        </div>

        {/* Quick Valued Demo User Shortcut Banner */}
        <div className="bg-gradient-to-r from-indigo-950/80 to-slate-950 border border-indigo-500/30 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 animate-pulse" />
            <div>
              <span className="font-bold text-xs text-slate-200 block">Valued Pro User Account</span>
              <span className="text-[10px] text-slate-400 font-mono">valued.user@quantai.com</span>
            </div>
          </div>
          <button
            onClick={handleQuickValuedUserLogin}
            disabled={loading}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 shadow-lg shadow-indigo-600/20"
          >
            <LogIn className="w-3.5 h-3.5" /> INSTANT LOG IN
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Account Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Session Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-mono text-rose-400">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-bold transition shadow-lg shadow-indigo-600/20"
          >
            {loading ? 'AUTHENTICATING SESSION...' : 'START AUTHENTICATED SESSION'}
          </button>
        </form>

        <div className="text-center pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-center gap-1">
          <Shield className="w-3 h-3 text-indigo-400" /> SECURE JWT ENCRYPTED SESSION
        </div>

      </div>
    </div>
  );
};
