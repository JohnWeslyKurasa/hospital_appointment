import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useWindowManager } from '../../context/WindowManagerContext';

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
      <div className="win95-inset p-8 text-center font-mono text-xs text-olive-moss">
        ⏳ LOADING DOCTOR DOSSIER...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="win95-inset p-6 text-center font-mono text-xs text-red-800 bg-red-50">
        ⚠️ ERROR: DOCTOR DOSSIER NOT FOUND IN DATABASE.
      </div>
    );
  }

  return (
    <div className="space-y-4 select-text">
      {/* Top Banner */}
      <div className="win95-inset p-3 bg-cream flex items-start gap-4 border border-olive-moss/40">
        <img
          src={doctor.photoUrl}
          alt={doctor.name}
          className="w-24 h-24 object-cover border-2 border-olive-moss shadow"
        />
        <div className="flex-1">
          <span className="text-[10px] font-mono bg-olive-moss text-cream px-2 py-0.5 font-bold uppercase">
            DOCTOR ID: DOC-{doctor._id.slice(-6).toUpperCase()}
          </span>
          <h3 className="font-pixel text-xl font-bold text-olive-moss mt-1 uppercase">
            {doctor.name}
          </h3>
          <p className="text-xs font-bold text-accent-amber bg-olive-moss/90 px-1.5 py-0.5 inline-block mt-0.5">
            DEPARTMENT OF {doctor.departmentName.toUpperCase()}
          </p>
          <p className="text-xs font-mono text-olive-dark mt-1 font-bold">
            {doctor.specialization}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="win95-inset p-3 bg-white space-y-2 text-xs font-mono">
          <h4 className="font-pixel text-sm font-bold text-olive-moss border-b border-olive-dark/20 pb-1">
            📜 ACADEMIC & CREDENTIALS
          </h4>
          <div>
            <strong>QUALIFICATIONS:</strong>
            <p className="text-olive-dark font-bold">{doctor.qualifications}</p>
          </div>
          <div>
            <strong>MEDICAL EXPERIENCE:</strong>
            <p className="text-olive-dark font-bold">{doctor.experience}</p>
          </div>
          <div>
            <strong>CONSULTATION FEE:</strong>
            <p className="text-olive-dark font-bold">${doctor.consultationFee} USD</p>
          </div>
        </div>

        <div className="win95-inset p-3 bg-white space-y-2 text-xs font-mono">
          <h4 className="font-pixel text-sm font-bold text-olive-moss border-b border-olive-dark/20 pb-1">
            🗓️ SCHEDULE & CLINIC HOURS
          </h4>
          <div>
            <strong>WORKING DAYS:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {doctor.availableDays?.map((day) => (
                <span key={day} className="bg-olive-moss text-cream text-[10px] font-bold px-1.5 py-0.5">
                  {day}
                </span>
              ))}
            </div>
          </div>
          <div>
            <strong>DAILY TIME SLOTS:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {doctor.timeSlots?.map((slot) => (
                <span key={slot} className="win95-box text-[9px] font-bold px-1.5 py-0.5">
                  {slot}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-olive-dark/20">
        <button
          onClick={() => closeWindow('doctorProfile')}
          className="win95-btn text-xs font-bold"
        >
          [ BACK TO DIRECTORY ]
        </button>

        <button
          onClick={() => {
            closeWindow('doctorProfile');
            openWindow('booking', { doctorId: doctor._id, departmentName: doctor.departmentName });
          }}
          className="win95-btn bg-accent/40 text-olive-moss font-pixel text-sm px-4 py-1 font-bold"
        >
          [ BOOK APPOINTMENT NOW ]
        </button>
      </div>
    </div>
  );
}
