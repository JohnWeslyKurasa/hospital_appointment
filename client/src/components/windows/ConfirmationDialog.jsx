import React from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { CheckCircle2, Printer, CalendarCheck, X } from 'lucide-react';

export default function ConfirmationDialog({ windowData }) {
  const { closeWindow, openWindow } = useWindowManager();
  const app = windowData?.props?.appointment;

  const appointmentId = app?.appointmentCode || 'MC-2026-00124';
  const doctorName = app?.doctorName || 'Dr. Alex Johnson';
  const departmentName = app?.departmentName || 'Cardiology';
  const rawDate = app?.date || '2026-08-27';
  const timeSlot = app?.timeSlot || '10:00 AM';

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
    <div className="space-y-4 text-center">
      {/* Header Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
          Appointment Confirmed
        </h3>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200">
          Reservation Logged in MEDICARE Database
        </span>
      </div>

      {/* Printable Receipt Card */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl text-left text-xs space-y-3 shadow-xs">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="font-bold text-slate-500">APPOINTMENT ID:</span>
          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            {appointmentId}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Physician</span>
            <strong className="text-slate-800 text-sm">{doctorName}</strong>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Department</span>
            <strong className="text-slate-800 text-sm">{departmentName}</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Consultation Date</span>
            <strong className="text-slate-800 text-sm">{formatDateString(rawDate)}</strong>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Time Slot</span>
            <strong className="text-slate-800 text-sm">{timeSlot}</strong>
          </div>
        </div>

        <p className="pt-2 border-t border-dashed border-slate-200 text-[11px] text-slate-500 text-center font-medium">
          Please arrive 15 minutes prior to appointment with valid patient identification.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Print Receipt</span>
        </button>

        <button
          onClick={() => {
            closeWindow('confirmation');
            openWindow('myAppointments');
          }}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>View My Appointments</span>
        </button>

        <button
          onClick={() => closeWindow('confirmation')}
          className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}
