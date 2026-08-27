import React from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';

export default function ConfirmationDialog({ windowData }) {
  const { closeWindow, openWindow } = useWindowManager();
  const app = windowData?.props?.appointment;

  const appointmentId = app?.appointmentCode || 'MC-2026-00124';
  const doctorName = app?.doctorName || 'Dr. Alex Johnson';
  const departmentName = app?.departmentName || 'Cardiology';
  const rawDate = app?.date || '2026-08-27';
  const timeSlot = app?.timeSlot || '10:00 AM';

  // Format date like: 27 August 2026
  const formatDateString = (str) => {
    try {
      const d = new Date(str);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return str;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 text-center select-text">
      {/* Dialog Header Icon */}
      <div className="win95-inset p-4 bg-cream flex flex-col items-center justify-center border-2 border-olive-moss">
        <div className="text-5xl mb-2 animate-bounce">✅</div>
        <h3 className="font-pixel text-xl font-extrabold text-olive-moss uppercase tracking-wider">
          APPOINTMENT CONFIRMED
        </h3>
        <p className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 mt-1 border border-emerald-600">
          STATUS: RESERVATION LOGGED IN MEDICARE CORE DATABASE
        </p>
      </div>

      {/* Printable Receipt Card */}
      <div className="win95-inset p-4 bg-white text-left font-mono text-xs space-y-2 border border-olive-moss/40 shadow-inner">
        <div className="flex justify-between border-b border-olive-dark/20 pb-1 font-bold text-olive-moss">
          <span>APPOINTMENT ID:</span>
          <span className="text-accent-amber bg-olive-moss px-1.5 py-0.2">{appointmentId}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <span className="text-gray-500 block text-[10px]">DOCTOR:</span>
            <strong className="text-olive-moss text-sm">{doctorName}</strong>
          </div>

          <div>
            <span className="text-gray-500 block text-[10px]">DEPARTMENT:</span>
            <strong className="text-olive-moss text-sm">{departmentName}</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-olive-dark/10">
          <div>
            <span className="text-gray-500 block text-[10px]">DATE:</span>
            <strong className="text-olive-dark text-sm">{formatDateString(rawDate)}</strong>
          </div>

          <div>
            <span className="text-gray-500 block text-[10px]">TIME:</span>
            <strong className="text-olive-dark text-sm">{timeSlot}</strong>
          </div>
        </div>

        <div className="pt-2 border-t border-dashed border-olive-dark/30 text-[10px] text-gray-500 text-center">
          PLEASE ARRIVE 15 MINUTES PRIOR TO APPOINTMENT WITH PATIENT ID.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={handlePrint}
          className="win95-btn bg-cream text-olive-moss font-pixel text-sm px-4 py-1 font-bold"
        >
          🖨️ [ PRINT RECEIPT ]
        </button>

        <button
          onClick={() => {
            closeWindow('confirmation');
            openWindow('myAppointments');
          }}
          className="win95-btn bg-accent text-olive-moss font-pixel text-sm px-6 py-1 font-bold"
        >
          [ VIEW MY APPOINTMENTS ]
        </button>

        <button
          onClick={() => closeWindow('confirmation')}
          className="win95-btn text-xs px-3 py-1 font-bold"
        >
          [ CLOSE ]
        </button>
      </div>
    </div>
  );
}
