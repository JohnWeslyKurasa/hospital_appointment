import React, { useState, useEffect } from 'react';
import { useWindowManager, DEFAULT_WINDOWS } from '../../context/WindowManagerContext';
import StartMenu from './StartMenu';
import { LayoutGrid, Volume2, Monitor } from 'lucide-react';

export default function Taskbar() {
  const { openWindows, activeWindowId, focusWindow, minimizeWindow } = useWindowManager();
  const [startOpen, setStartOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      setDateStr(`${day}/${month}/${year}`);
      setTimeStr(time);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWindowTabClick = (w) => {
    if (w.id === activeWindowId && !w.isMinimized) {
      minimizeWindow(w.id);
    } else {
      focusWindow(w.id);
    }
  };

  return (
    <>
      <StartMenu isOpen={startOpen} onClose={() => setStartOpen(false)} />

      <footer className="fixed bottom-0 left-0 right-0 h-11 bg-slate-900 text-slate-100 border-t border-slate-800 flex items-center justify-between px-3 z-[9990] select-none shadow-lg">
        {/* Start Button & Active Windows */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setStartOpen(!startOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              startOpen 
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/50' 
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-blue-400" />
            <span className="tracking-wide uppercase">Start</span>
          </button>

          <div className="h-5 w-px bg-slate-800 mx-0.5 hidden sm:block"></div>

          {/* Active Floating Window Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-[50vw] py-0.5 no-scrollbar">
            {openWindows.map((w) => {
              const meta = w.meta || DEFAULT_WINDOWS[w.id] || { title: w.id.toUpperCase(), icon: Monitor };
              const IconComp = meta.icon || Monitor;
              const isActive = activeWindowId === w.id && !w.isMinimized;

              return (
                <button
                  key={w.id}
                  onClick={() => handleWindowTabClick(w)}
                  className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg max-w-[180px] truncate transition-colors border ${
                    isActive
                      ? 'bg-blue-600/90 text-white border-blue-500 font-bold shadow-xs'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{meta.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Windows-Style System Tray & Clock */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-800/90 text-slate-300 text-xs font-mono px-3 py-1 rounded-xl flex items-center gap-3 border border-slate-700/80 shadow-2xs">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ONLINE
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-semibold">{dateStr}</span>
            <span className="text-slate-600">|</span>
            <span className="font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded text-[11px]">
              {timeStr}
            </span>
            <Volume2 className="w-3.5 h-3.5 text-slate-400 hover:text-white cursor-pointer" />
          </div>
        </div>
      </footer>
    </>
  );
}
