import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { 
  Stethoscope, Calendar, CalendarCheck, Building2, 
  FileText, Activity, ShieldCheck, User, PhoneCall, 
  LogOut, LogIn, Search
} from 'lucide-react';

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
      className="fixed bottom-12 left-3 z-[9999] w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 select-none overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-extrabold text-sm">
            MC
          </div>
          <div>
            <h4 className="font-extrabold text-sm tracking-wide">MEDICARE OS</h4>
            <p className="text-[10px] text-blue-100 font-mono">CLINICAL COMPUTING SYSTEM</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-white/20 rounded font-bold">v1.2</span>
      </div>

      {/* User Info Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-800">{user ? user.name : 'Guest User'}</div>
            <div className="text-[10px] text-slate-500 font-mono">
              ROLE: {user ? user.role.toUpperCase() : 'UNAUTHENTICATED'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu Shortcuts */}
      <div className="p-2 space-y-1 text-xs">
        <button
          onClick={() => handleLaunch('doctors')}
          className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold flex items-center gap-2.5 transition-colors"
        >
          <Stethoscope className="w-4 h-4 text-blue-500" />
          <span>Doctors Directory</span>
        </button>

        <button
          onClick={() => handleLaunch('booking')}
          className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold flex items-center gap-2.5 transition-colors"
        >
          <Calendar className="w-4 h-4 text-sky-500" />
          <span>Appointments Booking</span>
        </button>

        <button
          onClick={() => handleLaunch('myAppointments')}
          className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold flex items-center gap-2.5 transition-colors"
        >
          <CalendarCheck className="w-4 h-4 text-emerald-500" />
          <span>My Appointments</span>
        </button>

        <button
          onClick={() => handleLaunch('departments')}
          className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold flex items-center gap-2.5 transition-colors"
        >
          <Building2 className="w-4 h-4 text-purple-500" />
          <span>Hospital Departments</span>
        </button>

        <button
          onClick={() => handleLaunch('records')}
          className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold flex items-center gap-2.5 transition-colors"
        >
          <FileText className="w-4 h-4 text-amber-500" />
          <span>Medical Records</span>
        </button>

        {/* Role-Restricted Shortcuts */}
        {(user?.role === 'doctor' || user?.role === 'admin') && (
          <div className="pt-1 mt-1 border-t border-slate-100 space-y-1">
            {user?.role === 'doctor' && (
              <button
                onClick={() => handleLaunch('doctorDesk')}
                className="w-full text-left px-3 py-2 rounded-xl bg-blue-50/50 hover:bg-blue-100 text-blue-700 font-bold flex items-center gap-2.5 transition-colors"
              >
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Doctor Desk Workspace</span>
              </button>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={() => handleLaunch('admin')}
                className="w-full text-left px-3 py-2 rounded-xl bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 font-bold flex items-center gap-2.5 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Admin System Control</span>
              </button>
            )}
          </div>
        )}

        {/* Contact & Auth */}
        <div className="pt-1 mt-1 border-t border-slate-100 space-y-1">
          <button
            onClick={() => handleLaunch('search')}
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-2.5 transition-colors"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Search System</span>
          </button>

          <button
            onClick={() => handleLaunch('contact')}
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-2.5 transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-slate-500" />
            <span>Contact & Support</span>
          </button>

          {user ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2.5 transition-colors mt-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Off ({user.name})</span>
            </button>
          ) : (
            <button
              onClick={() => handleLaunch('login')}
              className="w-full text-left px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold flex items-center gap-2.5 transition-colors mt-1 shadow-2xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In to MEDICARE</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
