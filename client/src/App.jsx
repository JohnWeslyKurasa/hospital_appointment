import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WindowManagerProvider, useWindowManager } from './context/WindowManagerContext';
import DesktopHeader from './components/desktop/DesktopHeader';
import DesktopIcon from './components/desktop/DesktopIcon';
import Taskbar from './components/desktop/Taskbar';
import RetroWindow from './components/desktop/RetroWindow';
import WindowRenderer from './components/desktop/WindowRenderer';

function DesktopContent() {
  const { user } = useAuth();
  const { openWindows, openWindow } = useWindowManager();

  // Desktop shortcuts filtered by active user role
  const desktopIcons = [
    { id: 'doctors', label: 'DOCTORS', icon: '👨‍⚕️', windowId: 'doctors', roles: ['all'] },
    { id: 'booking', label: 'APPOINTMENTS', icon: '📅', windowId: 'booking', roles: ['all'] },
    { id: 'myAppointments', label: 'RECORDS', icon: '📋', windowId: 'myAppointments', roles: ['all'] },
    { id: 'departments', label: 'DEPARTMENTS', icon: '💊', windowId: 'departments', roles: ['all'] },
    { id: 'patientProfile', label: 'PATIENTS', icon: '👤', windowId: 'patientProfile', roles: ['all'] },
    { id: 'contact', label: 'CONTACT', icon: '📞', windowId: 'contact', roles: ['all'] },

    // DOCTOR DESK: Only visible for Doctor role
    ...(user?.role === 'doctor'
      ? [{ id: 'doctorDesk', label: 'DOCTOR DESK', icon: '🩻', windowId: 'doctorDesk', badge: 'DOC' }]
      : []),

    // ADMIN: Only visible for Admin role
    ...(user?.role === 'admin'
      ? [{ id: 'admin', label: 'ADMIN', icon: '⚙️', windowId: 'admin', badge: 'SYS' }]
      : []),
  ];

  return (
    <div className="min-h-screen pb-16 flex flex-col justify-between overflow-x-hidden relative">
      {/* Top Header */}
      <DesktopHeader />

      {/* Main Desktop Grid */}
      <main className="flex-1 px-3 sm:px-6 py-3 flex flex-col items-center justify-start select-none">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-4 max-w-5xl mx-auto w-full justify-items-center">
          {desktopIcons.map((item) => (
            <DesktopIcon
              key={item.id}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              onClick={() => openWindow(item.windowId)}
            />
          ))}
        </div>

        {/* Decorative Desktop Watermark Notice */}
        <div className="mt-6 text-center pointer-events-none opacity-40 select-none">
          <p className="font-pixel text-[11px] sm:text-xs text-olive-moss uppercase tracking-widest font-bold">
            MEDICARE.EXE — WINDOWS 98 CLINICAL COMPUTING ARCHITECTURE
          </p>
          <p className="font-mono text-[9px] sm:text-[10px] text-olive-dark">
            PROPERTY OF MEDICARE CENTRAL HEALTHCARE TRUST • RESPONSIVE MOBILE CORE
          </p>
        </div>
      </main>

      {/* Render Open Windows */}
      {openWindows.map((w) => (
        <RetroWindow key={w.id} windowData={w}>
          <WindowRenderer windowData={w} />
        </RetroWindow>
      ))}

      {/* Bottom Win98 Taskbar */}
      <Taskbar />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WindowManagerProvider>
        <DesktopContent />
      </WindowManagerProvider>
    </AuthProvider>
  );
}
