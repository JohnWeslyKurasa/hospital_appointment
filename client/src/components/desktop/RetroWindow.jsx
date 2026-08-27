import React, { useState, useRef, useEffect } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { Minus, Square, Maximize2, X, Monitor } from 'lucide-react';

export default function RetroWindow({ windowData, children }) {
  const { id, meta, zIndex, isMinimized, isMaximized } = windowData;
  const { closeWindow, minimizeWindow, toggleMaximizeWindow, focusWindow, activeWindowId } = useWindowManager();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [position, setPosition] = useState(() => {
    const offsetMap = {
      login: { x: 120, y: 80 },
      doctors: { x: 140, y: 70 },
      booking: { x: 160, y: 75 },
      myAppointments: { x: 180, y: 80 },
      doctorDesk: { x: 150, y: 70 },
      admin: { x: 130, y: 65 },
    };
    return offsetMap[id] || { x: 100 + Math.random() * 40, y: 70 + Math.random() * 30 };
  });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  if (isMinimized) return null;

  const isActive = activeWindowId === id;
  const IconComponent = meta?.icon || Monitor;

  const handleMouseDown = (e) => {
    focusWindow(id);
    if (!isMobile && e.target.closest('.window-drag-handle')) {
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
      
      const handleMouseMove = (moveEvent) => {
        if (!isDragging.current) return;
        setPosition({
          x: Math.max(0, moveEvent.clientX - dragStart.current.x),
          y: Math.max(0, moveEvent.clientY - dragStart.current.y)
        });
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  };

  const getWindowStyles = () => {
    if (isMaximized) {
      return {
        zIndex,
        left: 0,
        top: 0,
        width: '100vw',
        height: 'calc(100vh - 44px)',
        maxWidth: '100vw',
        maxHeight: 'calc(100vh - 44px)',
        borderRadius: 0
      };
    }

    if (isMobile) {
      return {
        zIndex,
        left: '50%',
        transform: 'translateX(-50%)',
        top: '60px',
        width: '95vw',
        maxWidth: '95vw',
        maxHeight: 'calc(100vh - 120px)'
      };
    }

    return {
      zIndex,
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: meta?.defaultWidth ? `${meta.defaultWidth}px` : '720px',
      height: meta?.defaultHeight ? `${meta.defaultHeight}px` : 'auto',
      maxWidth: '92vw',
      maxHeight: 'calc(100vh - 110px)'
    };
  };

  return (
    <div
      onClick={() => focusWindow(id)}
      onMouseDown={handleMouseDown}
      style={getWindowStyles()}
      className={`fixed flex flex-col rounded-2xl overflow-hidden glass-panel border border-slate-200/90 shadow-2xl transition-all duration-150 select-none ${
        isActive ? 'ring-2 ring-blue-500/30 shadow-blue-900/10' : 'opacity-95'
      }`}
    >
      {/* Modern Window Titlebar */}
      <div
        className={`px-4 py-3 flex items-center justify-between glass-header window-drag-handle ${
          isMobile ? 'cursor-default' : 'cursor-move'
        } ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-800/90 text-slate-200'}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-blue-600/90 flex items-center justify-center text-white shadow-sm">
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs tracking-wider uppercase truncate">
              {meta?.title || id.toUpperCase()}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">ID: {id}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximizeWindow(id);
            }}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            title="Maximize"
          >
            {isMaximized ? <Square className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            className="w-7 h-7 rounded-lg bg-rose-500/20 hover:bg-rose-500 flex items-center justify-center text-rose-300 hover:text-white transition-colors ml-1"
            title="Close Application"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto bg-white/80 select-text">
        {children}
      </div>

      {/* Window Status Bar */}
      <div className="bg-slate-100/90 px-4 py-1.5 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex justify-between items-center">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          SYS.MODULE: {id.toUpperCase()}
        </span>
        <span className="font-semibold text-slate-400">MEDICARE OS v1.2</span>
      </div>
    </div>
  );
}
