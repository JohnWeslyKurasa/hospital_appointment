import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';

export default function StartMenu({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { openWindow } = useWindowManager();

  if (!isOpen) return null;

  const handleLaunch = (windowId) => {
    openWindow(windowId);
    onClose();
  };

  return (
    <div
      className="fixed bottom-10 left-1 z-[9999] win95-box flex w-72 shadow-2xl border-2 border-olive-moss select-none animate-in fade-in duration-100"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Left Win98 Sidebar */}
      <div className="bg-olive-moss w-8 flex flex-col justify-end p-1 text-cream font-pixel font-bold text-lg tracking-widest writing-mode-vertical rotate-180 border-r border-cream/20">
        <span className="whitespace-nowrap uppercase">MEDICARE '98</span>
      </div>

      {/* Main Menu List */}
      <div className="flex-1 bg-winbg p-1 text-xs font-retro">
        {/* User Info Bar */}
        <div className="bg-cream p-2 mb-1 border-b border-olive-dark/20 flex items-center justify-between">
          <div>
            <div className="font-bold text-olive-moss">{user ? user.name : 'Unauthenticated'}</div>
            <div className="text-[10px] text-olive-dark font-mono">
              ROLE: {user ? user.role.toUpperCase() : 'GUEST'}
            </div>
          </div>
          <span className="text-xl">{user?.role === 'admin' ? '⚙️' : user?.role === 'doctor' ? '🩻' : '👤'}</span>
        </div>

        {/* Public & Patient Links */}
        <div className="space-y-0.5 border-b border-olive-dark/20 pb-1 mb-1">
          <button
            onClick={() => handleLaunch('doctors')}
            className="w-full text-left px-2 py-1 hover:bg-olive-moss hover:text-white flex items-center gap-2 font-bold"
          >
            <span>👨‍⚕️</span> DOCTORS.EXE
          </button>
          <button
            onClick={() => handleLaunch('booking')}
            className="w-full text-left px-2 py-1 hover:bg-olive-moss hover:text-white flex items-center gap-2 font-bold"
          >
            <span>📅</span> APPOINTMENT.EXE
          </button>
          <button
            onClick={() => handleLaunch('myAppointments')}
            className="w-full text-left px-2 py-1 hover:bg-olive-moss hover:text-white flex items-center gap-2 font-bold"
          >
            <span>📋</span> MY APPOINTMENTS.EXE
          </button>
          <button
            onClick={() => handleLaunch('departments')}
            className="w-full text-left px-2 py-1 hover:bg-olive-moss hover:text-white flex items-center gap-2 font-bold"
          >
            <span>💊</span> DEPARTMENTS.EXE
          </button>
          <button
            onClick={() => handleLaunch('records')}
            className="w-full text-left px-2 py-1 hover:bg-olive-moss hover:text-white flex items-center gap-2 font-bold"
          >
            <span>📁</span> RECORDS.EXE
          </button>
        </div>

        {/* Role-Restricted Shortcuts */}
        {(user?.role === 'doctor' || user?.role === 'admin') && (
          <div className="space-y-0.5 border-b border-olive-dark/20 pb-1 mb-1">
            {user?.role === 'doctor' && (
              <button
                onClick={() => handleLaunch('doctorDesk')}
                className="w-full text-left px-2 py-1 bg-olive-light/20 hover:bg-olive-moss hover:text-white flex items-center gap-2 font-bold text-olive-moss"
              >
                <span>🩻</span> DOCTOR DESK.EXE
              </button>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={() => handleLaunch('admin')}
                className="w-full text-left px-2 py-1 bg-accent/20 hover:bg-olive-moss hover:text-white flex items-center gap-2 font-bold text-olive-moss"
              >
                <span>⚙️</span> ADMIN.EXE (SYSTEM CONTROL)
              </button>
            )}
          </div>
        )}

        {/* Profile & Auth */}
        <div className="pt-0.5 space-y-0.5">
          {user && (
            <button
              onClick={() => handleLaunch('patientProfile')}
              className="w-full text-left px-2 py-1 hover:bg-olive-moss hover:text-white flex items-center gap-2 font-bold"
            >
              <span>👤</span> PATIENT PROFILE.EXE
            </button>
          )}

          <button
            onClick={() => handleLaunch('contact')}
            className="w-full text-left px-2 py-1 hover:bg-olive-moss hover:text-white flex items-center gap-2"
          >
            <span>📞</span> CONTACT & HELP
          </button>

          {user ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full text-left px-2 py-1 text-red-700 hover:bg-red-700 hover:text-white flex items-center gap-2 font-bold border-t border-olive-dark/10 mt-1 pt-1"
            >
              <span>🚪</span> LOG OFF {user.name}...
            </button>
          ) : (
            <button
              onClick={() => handleLaunch('login')}
              className="w-full text-left px-2 py-1 hover:bg-olive-moss hover:text-white flex items-center gap-2 font-bold text-olive-moss border-t border-olive-dark/10 mt-1 pt-1"
            >
              <span>🔑</span> LOG IN TO MEDICARE...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
