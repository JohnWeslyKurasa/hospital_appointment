import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';

export default function DesktopHeader() {
  const { user } = useAuth();
  const { openWindow } = useWindowManager();

  return (
    <header className="w-full flex flex-col items-center justify-center pt-4 pb-2 px-4 select-none">
      <div className="win95-box px-6 py-3 text-center border-2 border-olive-moss bg-cream-light max-w-2xl w-full shadow-md">
        <div className="flex items-center justify-between mb-1 border-b border-olive-dark/20 pb-1">
          <span className="text-[10px] font-mono text-olive-moss uppercase tracking-widest font-bold">
            [ SYSTEM ID: MC-98-SYS-V1.0.9 ]
          </span>
          <span className="text-[10px] font-mono bg-olive-moss text-cream px-2 py-0.5 font-bold">
            STATUS: READY
          </span>
        </div>
        
        <h1 className="font-pixel text-3xl md:text-5xl font-extrabold tracking-wider text-olive-moss drop-shadow-sm flex items-center justify-center gap-2">
          <span>🏥</span> MEDICARE.EXE <span>🏥</span>
        </h1>
        
        <p className="font-mono text-xs md:text-sm font-bold text-olive-dark tracking-wide uppercase mt-0.5">
          HOSPITAL APPOINTMENT MANAGEMENT SYSTEM
        </p>

        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-olive-moss border-t border-olive-dark/20 pt-1">
          <div>
            <span>CURRENT USER: </span>
            <strong className="underline decoration-accent">
              {user ? `${user.name} (${user.role.toUpperCase()})` : 'GUEST / UNAUTHENTICATED'}
            </strong>
          </div>
          
          <div className="flex items-center gap-2">
            {!user ? (
              <button
                onClick={() => openWindow('login')}
                className="win95-btn text-[10px] text-olive-moss font-bold px-2 py-0.5"
              >
                [ LOGIN ]
              </button>
            ) : (
              <button
                onClick={() => openWindow(user.role === 'admin' ? 'admin' : user.role === 'doctor' ? 'doctorDesk' : 'patientProfile')}
                className="win95-btn text-[10px] text-olive-moss font-bold px-2 py-0.5"
              >
                [ DASHBOARD ]
              </button>
            )}
            <button
              onClick={() => openWindow('search')}
              className="win95-btn text-[10px] bg-accent/20 text-olive-moss font-bold px-2 py-0.5"
            >
              🔍 SEARCH SYSTEM
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
