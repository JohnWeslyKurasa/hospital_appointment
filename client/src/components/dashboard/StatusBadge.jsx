import React from 'react';

export default function StatusBadge({ status = 'READY', label = 'STATUS: READY' }) {
  return (
    <div 
      className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E6EAF2] rounded-full text-[11px] font-extrabold text-[#172033] shadow-2xs select-none"
      title="System operational state"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
      </span>
      <span className="tracking-wider uppercase">{label}</span>
    </div>
  );
}
