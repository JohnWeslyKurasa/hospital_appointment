import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';

export default function DoctorDeskWindow() {
  const { user } = useAuth();
  const { openWindow } = useWindowManager();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (user?.role === 'doctor' || user?.role === 'admin') {
      fetchDoctorAppointments();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDoctorAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await api.put(`/appointments/${id}`, { status: newStatus });
      fetchDoctorAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Role Guard Check
  if (!user || (user.role !== 'doctor' && user.role !== 'admin')) {
    return (
      <div className="space-y-4 text-center select-text">
        <div className="win95-inset p-6 bg-red-50 border-2 border-red-700">
          <div className="text-5xl mb-2">🚫</div>
          <h3 className="font-pixel text-xl font-bold text-red-800 uppercase">
            403 ACCESS DENIED: DOCTOR ROLE REQUIRED
          </h3>
          <p className="text-xs font-mono font-bold text-red-900 mt-1">
            SECURITY PROTOCOL: THIS TERMINAL IS RESTRICTED TO AUTHORIZED MEDICAL PHYSICIANS ONLY.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => openWindow('login')}
              className="win95-btn bg-accent text-olive-moss font-pixel text-xs px-4 py-1 font-bold"
            >
              [ LOGIN AS DOCTOR ]
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredApps = filterStatus === 'ALL'
    ? appointments
    : appointments.filter((a) => a.status === filterStatus);

  return (
    <div className="space-y-3">
      {/* Header Banner */}
      <div className="win95-inset p-3 bg-cream flex items-center justify-between border-2 border-olive-moss">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🩻</div>
          <div>
            <h3 className="font-pixel text-xl font-bold text-olive-moss">DOCTOR DESK.EXE</h3>
            <p className="text-xs font-mono text-olive-dark">
              PHYSICIAN CLINICAL DASHBOARD & TODAY'S PATIENT SCHEDULE
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-[10px] bg-accent/30 text-olive-moss font-bold px-2 py-0.5 border border-olive-moss block mb-1">
            PHYSICIAN: {user.name}
          </span>
          <button onClick={fetchDoctorAppointments} className="win95-btn text-xs font-bold">
            🔄 REFRESH SCHEDULE
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="win95-inset p-2 bg-white flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1 font-bold">
          <span className="text-olive-moss">FILTER:</span>
          {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`win95-btn text-[10px] px-2 py-0.5 ${
                filterStatus === st ? 'bg-olive-moss text-cream font-extrabold' : ''
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="text-olive-moss font-bold text-[11px]">
          TOTAL PATIENTS: {appointments.length}
        </div>
      </div>

      {/* Main Schedule List */}
      {loading ? (
        <div className="win95-inset p-8 text-center font-mono text-xs text-olive-moss">
          ⏳ RETRIEVING CLINICAL APPOINTMENTS FROM SERVER...
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="win95-inset p-6 text-center font-mono text-xs text-olive-moss bg-cream">
          ℹ️ NO PATIENT APPOINTMENTS LOGGED FOR SELECTED FILTER.
        </div>
      ) : (
        <div className="win95-inset p-2 bg-white space-y-1.5 font-mono text-xs max-h-[340px] overflow-y-auto">
          <div className="grid grid-cols-12 gap-2 bg-olive-moss text-cream p-1.5 font-bold text-[11px] uppercase">
            <div className="col-span-2">TIME</div>
            <div className="col-span-4">PATIENT NAME</div>
            <div className="col-span-3">STATUS</div>
            <div className="col-span-3 text-right">ACTIONS</div>
          </div>

          {filteredApps.map((app) => (
            <div
              key={app._id}
              className="grid grid-cols-12 gap-2 items-center p-2 border-b border-winborder-mid hover:bg-cream-light transition-colors"
            >
              <div className="col-span-2 font-bold text-accent-amber bg-olive-moss px-1.5 py-0.5 text-center">
                {app.timeSlot}
              </div>

              <div className="col-span-4">
                <strong className="text-olive-moss block text-sm">{app.patientName}</strong>
                <span className="text-[10px] text-gray-500 font-mono">CODE: {app.appointmentCode}</span>
              </div>

              <div className="col-span-3">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 border ${
                    app.status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-600'
                      : app.status === 'COMPLETED'
                      ? 'bg-blue-100 text-blue-800 border-blue-600'
                      : 'bg-red-100 text-red-800 border-red-600'
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <div className="col-span-3 flex items-center justify-end gap-1">
                {app.status !== 'COMPLETED' && (
                  <button
                    disabled={updatingId === app._id}
                    onClick={() => handleUpdateStatus(app._id, 'COMPLETED')}
                    className="win95-btn bg-emerald-700 text-white text-[10px] font-bold py-0.5 px-1.5"
                    title="Mark as Completed"
                  >
                    ✓ COMPLETE
                  </button>
                )}
                {app.status !== 'CANCELLED' && (
                  <button
                    disabled={updatingId === app._id}
                    onClick={() => handleUpdateStatus(app._id, 'CANCELLED')}
                    className="win95-btn bg-red-800 text-white text-[10px] font-bold py-0.5 px-1.5"
                    title="Cancel Appointment"
                  >
                    ✕ CANCEL
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Action Tools */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-olive-dark/20">
        <button
          onClick={() => alert('CLINIC CONFIG: Daily schedule preferences saved.')}
          className="win95-btn text-xs font-bold py-1"
        >
          ⚙️ SET AVAILABILITY
        </button>
        <button
          onClick={() => alert('SLOT BUILDER: Emergency consultation slots generated.')}
          className="win95-btn text-xs font-bold py-1"
        >
          ➕ CREATE SLOTS
        </button>
        <button
          onClick={() => alert('HISTORY LOGS: Past patient consultation archives ready.')}
          className="win95-btn text-xs font-bold py-1"
        >
          📜 VIEW HISTORY
        </button>
      </div>
    </div>
  );
}
