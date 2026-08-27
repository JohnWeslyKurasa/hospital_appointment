import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { LogIn, Mail, Lock, UserPlus, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginWindow() {
  const { login } = useAuth();
  const { openWindow, closeWindow } = useWindowManager();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      closeWindow('login');
      if (res.user.role === 'admin') openWindow('admin');
      else if (res.user.role === 'doctor') openWindow('doctorDesk');
      else openWindow('doctors');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
          <LogIn className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900">System Authentication</h3>
          <p className="text-xs text-slate-500 font-medium">Authenticate patient, doctor, or administrator credentials</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>EMAIL ADDRESS / USER ID</span>
          </label>
          <input
            type="text"
            required
            placeholder="user@medicare.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>PASSWORD</span>
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Log In'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              closeWindow('login');
              openWindow('register');
            }}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Create Patient Account</span>
          </button>
        </div>
      </form>

      {/* Demo Credentials Box */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 border-b border-slate-200/60 pb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Demo System Login Credentials:</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-600 font-mono">
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Patient:</span>
            <span>patient@medicare.exe / patient123</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Doctor:</span>
            <span>doctor@medicare.exe / doctor123</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Admin:</span>
            <span>admin@medicare.exe / admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
