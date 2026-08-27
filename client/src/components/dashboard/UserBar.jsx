import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { LogIn, LogOut, Search } from 'lucide-react';

export default function UserBar() {
  const { user, logout } = useAuth();
  const { openWindow } = useWindowManager();

  return (
    <div className="w-full bg-white border border-[#E6EAF2] rounded-2xl p-4 sm:p-5 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
      {/* Left: User Status Display */}
      <div className="flex items-center gap-3 text-xs sm:text-sm font-mono text-[#64748B]">
        <span className="font-bold text-[#64748B]">CURRENT USER:</span>
        <span className="font-extrabold text-[#172033] bg-[#F7F8FC] px-3.5 py-1.5 rounded-xl border border-[#E6EAF2]">
          {user ? `${user.name.toUpperCase()} (${user.role.toUpperCase()})` : 'GUEST / UNAUTHENTICATED'}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {!user ? (
          <button
            onClick={() => openWindow('login')}
            className="px-4 py-2.5 bg-white hover:bg-[#F7F8FC] border border-[#E6EAF2] text-[#172033] text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-2"
          >
            <LogIn className="w-3.5 h-3.5 text-[#64748B]" />
            <span>LOGIN</span>
          </button>
        ) : (
          <button
            onClick={logout}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT</span>
          </button>
        )}

        {/* Primary Indigo Gradient Button */}
        <button
          onClick={() => openWindow('search')}
          className="px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-indigo-700 hover:to-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Search className="w-3.5 h-3.5" />
          <span>SEARCH SYSTEM</span>
        </button>
      </div>
    </div>
  );
}
