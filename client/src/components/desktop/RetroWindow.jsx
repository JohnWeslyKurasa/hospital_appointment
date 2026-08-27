import React, { useState, useRef } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';

export default function RetroWindow({ windowData, children }) {
  const { id, meta, zIndex, isMinimized, isMaximized } = windowData;
  const { closeWindow, minimizeWindow, toggleMaximizeWindow, focusWindow, activeWindowId } = useWindowManager();

  const [position, setPosition] = useState(() => {
    // Stagger window initial positions slightly
    const offsetMap = {
      login: { x: 40, y: 30 },
      doctors: { x: 70, y: 40 },
      booking: { x: 100, y: 50 },
      myAppointments: { x: 130, y: 60 },
      doctorDesk: { x: 60, y: 40 },
      admin: { x: 80, y: 30 },
    };
    return offsetMap[id] || { x: 50 + Math.random() * 40, y: 40 + Math.random() * 40 };
  });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  if (isMinimized) return null;

  const isActive = activeWindowId === id;

  const handleMouseDown = (e) => {
    focusWindow(id);
    if (e.target.closest('.win95-titlebar')) {
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

  return (
    <div
      onClick={() => focusWindow(id)}
      onMouseDown={handleMouseDown}
      style={{
        zIndex,
        left: isMaximized ? 0 : `${position.x}px`,
        top: isMaximized ? 0 : `${position.y}px`,
        width: isMaximized ? '100vw' : meta?.defaultWidth ? `${meta.defaultWidth}px` : '640px',
        height: isMaximized ? 'calc(100vh - 40px)' : meta?.defaultHeight ? `${meta.defaultHeight}px` : 'auto',
        maxWidth: isMaximized ? '100vw' : '95vw',
        maxHeight: isMaximized ? 'calc(100vh - 40px)' : 'calc(100vh - 100px)'
      }}
      className={`fixed win95-box flex flex-col shadow-2xl transition-all duration-75 select-none ${
        isActive ? 'ring-1 ring-olive-moss/40' : 'opacity-95'
      }`}
    >
      {/* Title bar */}
      <div
        className={`px-2 py-1.5 flex items-center justify-between cursor-move select-none ${
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
      <div className="flex-1 p-3 overflow-y-auto bg-winbg font-retro select-text">
        {children}
      </div>

      {/* Status Bar */}
      <div className="bg-winbg px-2 py-0.5 border-t border-winborder-mid text-[10px] font-mono text-olive-moss flex justify-between items-center">
        <span>MEDICARE PROCESS: {id.toUpperCase()}.EXE</span>
        <span>THREAD: READY</span>
      </div>
    </div>
  );
}
