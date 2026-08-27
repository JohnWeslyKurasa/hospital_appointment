import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useWindowManager } from '../../context/WindowManagerContext';
import { UserCheck, Award, Clock, Calendar, RefreshCw, AlertCircle } from 'lucide-react';

export default function DoctorProfileWindow({ windowData }) {
  const doctorId = windowData?.props?.doctorId;
  const { openWindow, closeWindow } = useWindowManager();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/doctors/${doctorId}`);
      setDoctor(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!doctorId || loading) {
    return (
      <div className="p-12 text-center text-xs font-medium text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-2">
        <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
        <span>Loading physician profile...</span>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="p-8 text-center text-xs font-medium text-rose-600 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col items-center gap-2">
        <AlertCircle className="w-6 h-6 text-rose-600" />
        <span>Doctor dossier record not found in database.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl flex items-start gap-4">
        <img
          src={doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'}
          alt={doctor.name}
          className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-xs shrink-0"
        />
        <div className="flex-1 min-w-0">
          <span className="inline-block px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-mono font-bold rounded-md uppercase">
            ID: DOC-{doctor._id.slice(-6).toUpperCase()}
          </span>
          <h3 className="font-extrabold text-base text-slate-900 mt-1 truncate">
            {doctor.name}
          </h3>
          <p className="text-xs font-semibold text-blue-700 mt-0.5">
            Department of {doctor.departmentName || 'Medicine'}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {doctor.specialization}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
          <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Academic Credentials & Fee</span>
          </h4>
          <div>
            <span className="text-slate-400 font-semibold text-[11px] block">Qualifications:</span>
            <p className="font-bold text-slate-800">{doctor.qualifications}</p>
          </div>
          <div>
            <span className="text-slate-400 font-semibold text-[11px] block">Experience:</span>
            <p className="font-bold text-slate-800">{doctor.experience}</p>
          </div>
          <div>
            <span className="text-slate-400 font-semibold text-[11px] block">Consultation Fee:</span>
            <p className="font-extrabold text-emerald-600">₹{doctor.consultationFee}</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
          <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Schedule & Time Slots</span>
          </h4>
          <div>
            <span className="text-slate-400 font-semibold text-[11px] block mb-1">Available Days:</span>
            <div className="flex flex-wrap gap-1.5">
              {doctor.availableDays?.map((day) => (
                <span key={day} className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {day}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-semibold text-[11px] block mb-1">Time Slots:</span>
            <div className="flex flex-wrap gap-1.5">
              {doctor.timeSlots?.map((slot) => (
                <span key={slot} className="bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-slate-200">
                  {slot}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
        <button
          onClick={() => closeWindow('doctorProfile')}
          className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
        >
          Back to Directory
        </button>

        <button
          onClick={() => {
            closeWindow('doctorProfile');
            openWindow('booking', { doctorId: doctor._id, departmentName: doctor.departmentName });
          }}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Appointment Now</span>
        </button>
      </div>
    </div>
  );
}
