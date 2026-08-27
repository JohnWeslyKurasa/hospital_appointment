import React, { useState, useRef, useEffect } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';

export default function RetroWindow({ windowData, children }) {
  const { id, meta, zIndex, isMinimized, isMaximized } = windowData;
  const { closeWindow, minimizeWindow, toggleMaximizeWindow, focusWindow, activeWindowId } = useWindowManager();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [position, setPosition] = useState(() => {
    // Initial desktop staggered offsets
    const offsetMap = {
      login: { x: 30, y: 30 },
      doctors: { x: 40, y: 35 },
      booking: { x: 50, y: 40 },
      myAppointments: { x: 60, y: 45 },
      doctorDesk: { x: 45, y: 35 },
      admin: { x: 40, y: 30 },
    };
    return offsetMap[id] || { x: 30 + Math.random() * 30, y: 40 + Math.random() * 20 };
  });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  if (isMinimized) return null;

  const isActive = activeWindowId === id;

  const handleMouseDown = (e) => {
    focusWindow(id);
    if (!isMobile && e.target.closest('.win95-titlebar')) {
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

  // Mobile centered style calculation
  const getWindowStyles = () => {
    if (isMaximized) {
      return {
        zIndex,
        left: 0,
        top: 0,
        width: '100vw',
        height: 'calc(100vh - 40px)',
        maxWidth: '100vw',
        maxHeight: 'calc(100vh - 40px)'
      };
    }

    if (isMobile) {
      // Mobile: Center window in middle of phone screen
      return {
        zIndex,
        left: '50%',
        transform: 'translateX(-50%)',
        top: '65px',
        width: '94vw',
        maxWidth: '94vw',
        maxHeight: 'calc(100vh - 115px)'
      };
    }

    // Desktop: Staggered/Draggable positioning
    return {
      zIndex,
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: meta?.defaultWidth ? `${meta.defaultWidth}px` : '640px',
      height: meta?.defaultHeight ? `${meta.defaultHeight}px` : 'auto',
      maxWidth: '95vw',
      maxHeight: 'calc(100vh - 100px)'
    };
  };

  return (
    <div
      onClick={() => focusWindow(id)}
      onMouseDown={handleMouseDown}
      style={getWindowStyles()}
      className={`fixed win95-box flex flex-col shadow-2xl transition-all duration-75 select-none ${
        isActive ? 'ring-1 ring-olive-moss/40' : 'opacity-95'
      }`}
    >
      {/* Title bar */}
      <div
        className={`px-2 py-1.5 flex items-center justify-between ${
          isMobile ? 'cursor-default' : 'cursor-move'
        } select-none ${
          isActive ? 'win95-titlebar' : 'win95-titlebar-inactive'
        }`}
      >
        <div className="flex items-center gap-2 text-xs truncate">
          <span className="text-sm">{meta?.icon || '🖥️'}</span>
          <span className="font-pixel text-sm uppercase tracking-wide truncate">{meta?.title || `${id.toUpperCase()}.EXE`}</span>
        </div>

        {/* Mini Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            className="win95-btn px-1.5 py-0 text-[10px] h-4 font-bold text-olive-moss leading-none"
            title="Minimize"
          >
            _
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximizeWindow(id);
            }}
            className="win95-btn px-1 py-0 text-[9px] h-4 font-bold text-olive-moss leading-none"
            title="Maximize"
          >
            {isMaximized ? '❐' : '□'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            className="win95-btn-close ml-1"
            title="Close Application"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Body Container */}
      <div className="flex-1 p-2.5 sm:p-3 overflow-y-auto bg-winbg font-retro select-text">
        {children}
      </div>

      {/* Status Bar */}
      <div className="bg-winbg px-2 py-0.5 border-t border-winborder-mid text-[10px] font-mono text-olive-moss flex justify-between items-center">
        <span>PROC: {id.toUpperCase()}.EXE</span>
        <span>THREAD: READY</span>
      </div>
    </div>
  );
}
