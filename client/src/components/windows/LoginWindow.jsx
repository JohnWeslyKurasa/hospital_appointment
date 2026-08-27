import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';

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
      <div className="win95-inset p-3 bg-cream flex items-center gap-3 border border-olive-moss/30">
        <div className="text-4xl">🏥</div>
        <div>
          <h3 className="font-pixel text-lg font-bold text-olive-moss">SYSTEM LOGIN.EXE</h3>
          <p className="text-xs text-olive-dark font-mono">AUTHENTICATE PATIENT, DOCTOR, OR ADMIN CREDS</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-700 text-red-800 p-2 text-xs font-mono font-bold">
          ⚠️ AUTH ERROR: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-olive-moss uppercase mb-1">
            Email Address / User ID:
          </label>
          <input
            type="text"
            required
            placeholder="user@medicare.exe"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="win95-input w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-olive-moss uppercase mb-1">
            Password:
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="win95-input w-full"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-olive-dark/20">
          <button
            type="submit"
            disabled={loading}
            className="win95-btn bg-accent text-olive-moss font-pixel text-sm px-5 py-1 font-bold"
          >
            {loading ? 'AUTHENTICATING...' : '[ LOGIN ]'}
          </button>

          <button
            type="button"
            onClick={() => {
              closeWindow('login');
              openWindow('register');
            }}
            className="win95-btn text-xs font-bold"
          >
            [ CREATE PATIENT ACCOUNT ]
          </button>
        </div>
      </form>

      {/* Security Credentials Notice */}
      <div className="win95-inset p-2.5 bg-cream text-[11px] font-mono text-olive-moss border border-olive-moss/30 space-y-1">
        <strong className="block border-b border-olive-dark/20 pb-0.5 font-bold">
          🔒 DEFAULT SYSTEM ACCOUNTS FOR LOGIN:
        </strong>
        <div className="grid grid-cols-1 gap-0.5 text-[10px]">
          <div>• <strong>Patient:</strong> patient@medicare.exe / patient123</div>
          <div>• <strong>Doctor:</strong> doctor@medicare.exe / doctor123</div>
          <div>• <strong>Admin:</strong> admin@medicare.exe / admin123</div>
        </div>
      </div>
    </div>
  );
}
