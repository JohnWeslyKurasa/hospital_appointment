import React from 'react';

export default function DesktopIcon({ label, icon, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className="desktop-icon-btn flex flex-col items-center justify-center p-2 rounded w-24 h-24 transition-all group focus:outline-none select-none cursor-pointer"
      title={`Launch ${label}`}
    >
      <div className="relative w-12 h-12 flex items-center justify-center text-3xl mb-1 filter drop-shadow">
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-1 bg-accent text-olive-moss font-mono text-[9px] font-extrabold px-1 rounded border border-olive-moss">
            {badge}
          </span>
        )}
      </div>
      <span className="font-pixel text-xs font-bold text-olive-moss bg-cream/90 px-1 py-0.5 border border-olive-dark/30 text-center leading-tight tracking-wider shadow-sm group-hover:bg-olive-moss group-hover:text-cream">
        {label}
      </span>
    </button>
  );
}
