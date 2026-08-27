import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import StatusBadge from './StatusBadge';
import { Bell, Settings, User } from 'lucide-react';

export default function Header() {
  const { user } = useAuth();
  const { openWindow } = useWindowManager();

  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 select-none">
      {/* Left Branding Container */}
      <div 
        onClick={() => openWindow('dashboard')}
        className="flex items-center gap-4 text-center md:text-left cursor-pointer group"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white shrink-0 group-hover:scale-105 transition-transform duration-200">
          <svg className="w-9 h-9" viewBox="0 0 100 100" fill="none">
            <rect width="100" height="100" rx="20" fill="transparent" />
            <path d="M50 18v64M18 50h64" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
            <path d="M26 50h12l5-12 7 24 7-18 5 6h12" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172033] tracking-tight flex items-center gap-2 group-hover:text-[#4F46E5] transition-colors">
            MEDICARE
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#64748B] uppercase mt-0.5">
            HOSPITAL APPOINTMENT MANAGEMENT SYSTEM
          </p>
        </div>
      </div>

      {/* Right Controls Container */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {/* Status Badge */}
        <StatusBadge />

        {/* Notification Button */}
        <button 
          onClick={() => openWindow('search')} 
          className="p-2.5 bg-white hover:bg-[#F7F8FC] border border-[#E6EAF2] rounded-xl text-[#64748B] hover:text-[#172033] transition-colors shadow-2xs"
          title="Notifications & System Search"
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
        </button>

        {/* Settings Button */}
        <button 
          onClick={() => openWindow(isAdmin ? 'admin' : isDoctor ? 'doctorProfile' : 'patientProfile')} 
          className="p-2.5 bg-white hover:bg-[#F7F8FC] border border-[#E6EAF2] rounded-xl text-[#64748B] hover:text-[#172033] transition-colors shadow-2xs"
          title="System Settings & Profile"
          aria-label="Settings"
        >
          <Settings className="w-4.5 h-4.5" />
        </button>

        {/* Account Control Button */}
        <button 
          onClick={() => openWindow(user ? (isAdmin ? 'admin' : isDoctor ? 'doctorDesk' : 'patientProfile') : 'login')}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#F7F8FC] border border-[#E6EAF2] rounded-xl text-[#172033] text-xs font-bold shadow-2xs transition-colors"
          title="Account details"
        >
          <div className="w-6 h-6 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-xs">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline">
            {user ? user.name : 'Account'}
          </span>
        </button>
      </div>
    </header>
  );
}
