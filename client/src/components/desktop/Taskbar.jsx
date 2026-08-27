import React, { useState, useEffect } from 'react';
import { useWindowManager, DEFAULT_WINDOWS } from '../../context/WindowManagerContext';
import StartMenu from './StartMenu';

export default function Taskbar() {
  const { openWindows, activeWindowId, focusWindow, minimizeWindow } = useWindowManager();
  const [startOpen, setStartOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Format 10:42 AM
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // Format 27/08/2026
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

      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-olive-dark text-cream border-t-2 border-cream flex items-center justify-between px-1 z-[9990] select-none font-retro shadow-lg">
        {/* Start Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStartOpen(!startOpen)}
            className={`win95-btn flex items-center gap-1.5 px-3 py-1 font-pixel font-bold text-sm ${
              startOpen ? 'border-t-2 border-l-2 border-olive-moss bg-cream-grid' : 'bg-cream text-olive-moss'
            }`}
          >
            <span className="text-base">🪟</span>
            <span>START</span>
          </button>

          <div className="h-6 w-0.5 bg-cream/30 mx-1"></div>

          {/* Active Window Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[55vw] py-0.5 no-scrollbar">
            {openWindows.map((w) => {
              const meta = w.meta || DEFAULT_WINDOWS[w.id] || { title: `${w.id.toUpperCase()}.EXE`, icon: '🖥️' };
              const isActive = activeWindowId === w.id && !w.isMinimized;

              return (
                <button
                  key={w.id}
                  onClick={() => handleWindowTabClick(w)}
                  className={`win95-btn flex items-center gap-1 text-[11px] px-2 py-1 max-w-[170px] truncate ${
                    isActive
                      ? 'border-t-2 border-l-2 border-olive-moss bg-cream-light font-bold text-olive-moss'
                      : 'bg-winbg text-olive-moss opacity-90'
                  }`}
                >
                  <span className="text-xs">{meta.icon}</span>
                  <span className="truncate">{meta.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* System Tray & Clock */}
        <div className="flex items-center gap-2">
          <div className="win95-inset bg-cream-light/90 text-olive-moss text-[10px] font-mono px-2 py-0.5 flex items-center gap-2 border border-olive-moss">
            <span className="flex items-center gap-1 font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              ONLINE
            </span>
            <span className="text-olive-moss/40">|</span>
            <span className="font-bold">{dateStr}</span>
            <span className="text-olive-moss/40">|</span>
            <span className="font-bold text-accent-amber bg-olive-moss px-1 py-0.2 rounded text-[9px]">
              {timeStr}
            </span>
            <span className="text-xs">🔊</span>
          </div>
        </div>
      </footer>
    </>
  );
}
