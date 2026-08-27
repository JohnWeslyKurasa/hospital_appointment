import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { 
  LayoutDashboard, Stethoscope, Calendar, FileText, 
  Building2, Users, PhoneCall, ShieldCheck, Activity
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const { activeView, openWindow } = useWindowManager();

  const isDoctor = user?.role === 'doctor';
  const isAdmin = user?.role === 'admin';

  // Navigation Items according to prompt specs & role privileges
  const navItems = isDoctor
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, action: () => openWindow('dashboard') },
        { id: 'doctorDesk', label: 'Doctor Workspace', icon: Activity, action: () => openWindow('doctorDesk') },
        { id: 'medicalRecords', label: 'Records', icon: FileText, action: () => openWindow('medicalRecords') },
        { id: 'departments', label: 'Departments', icon: Building2, action: () => openWindow('departments') },
        { id: 'doctorProfile', label: 'Contact & Profile', icon: PhoneCall, action: () => openWindow('doctorProfile', { doctorId: user.doctorProfile?._id || user._id }) },
      ]
    : isAdmin
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, action: () => openWindow('dashboard') },
        { id: 'admin', label: 'Admin Control', icon: ShieldCheck, action: () => openWindow('admin') },
        { id: 'doctors', label: 'Doctors', icon: Stethoscope, action: () => openWindow('doctors') },
        { id: 'departments', label: 'Departments', icon: Building2, action: () => openWindow('departments') },
        { id: 'myAppointments', label: 'Appointments Ledger', icon: Calendar, action: () => openWindow('myAppointments') },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, action: () => openWindow('dashboard') },
        { id: 'doctors', label: 'Doctors', icon: Stethoscope, action: () => openWindow('doctors') },
        { id: 'booking', label: 'Appointments', icon: Calendar, action: () => openWindow('booking') },
        { id: 'myAppointments', label: 'Records', icon: FileText, action: () => openWindow('myAppointments') },
        { id: 'departments', label: 'Departments', icon: Building2, action: () => openWindow('departments') },
        { id: 'patientProfile', label: 'Patients', icon: Users, action: () => openWindow('patientProfile') },
        { id: 'contact', label: 'Contact', icon: PhoneCall, action: () => openWindow('contact') },
      ];

  return (
    <aside className="w-[270px] hidden md:flex flex-col justify-between bg-white border-r border-[#E6EAF2] p-6 shrink-0 min-h-screen sticky top-0 shadow-xs z-20 select-none">
      <div className="space-y-6">
        {/* Sidebar Brand Header */}
        <div 
          onClick={() => openWindow('dashboard')}
          className="flex items-center gap-3.5 cursor-pointer group p-1"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#4F46E5] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" rx="20" fill="transparent" />
              <path d="M50 18v64M18 50h64" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
              <path d="M26 50h12l5-12 7 24 7-18 5 6h12" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <div>
            <h2 className="font-extrabold text-base text-[#172033] tracking-tight group-hover:text-[#4F46E5] transition-colors">
              MEDICARE
            </h2>
            <p className="text-[10px] text-[#64748B] font-semibold tracking-wider uppercase">
              HEALTHCARE SYSTEM
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-3 mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id || (activeView === 'dashboard' && item.id === 'dashboard');

            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[13px] text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#4F46E5]/10 text-[#4F46E5] font-bold shadow-2xs'
                    : 'text-[#64748B] hover:bg-[#F7F8FC] hover:text-[#172033]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#4F46E5]' : 'text-[#64748B]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {/* Vertical Active Indicator Pill */}
                {isActive && (
                  <span className="w-1 h-5 bg-[#4F46E5] rounded-full shrink-0"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Healthcare Promotional Card */}
      <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-slate-50 to-blue-50/80 border border-[#E6EAF2] space-y-2 mt-6">
        {/* Subtle Decorative Wave Graphic */}
        <div className="absolute right-0 top-0 w-24 h-24 opacity-15 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#4F46E5]">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M10 50 Q 25 30, 40 50 T 70 50 T 100 50" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
          <span className="text-[10px] font-bold text-[#172033] tracking-wider uppercase">
            SECURE • RELIABLE • EFFICIENT
          </span>
        </div>
        <p className="text-xs text-[#64748B] font-medium leading-snug">
          Your health, our priority.
        </p>
      </div>
    </aside>
  );
}
