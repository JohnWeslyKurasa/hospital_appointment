import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';

export default function MyAppointmentsWindow() {
  const { user } = useAuth();
  const { openWindow } = useWindowManager();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'cancelled', 'all'
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
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

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('ARE YOU SURE YOU WANT TO CANCEL THIS APPOINTMENT?')) return;
    try {
      setCancellingId(id);
      await api.delete(`/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="space-y-4 text-center">
        <div className="win95-inset p-6 bg-cream border border-olive-moss/40">
          <div className="text-4xl mb-2">🔑</div>
          <h3 className="font-pixel text-lg font-bold text-olive-moss">PATIENT LOGIN REQUIRED</h3>
          <p className="text-xs font-mono text-olive-dark mt-1">PLEASE LOGIN TO ACCESS YOUR PERSONAL APPOINTMENT RECORDS.</p>
          <button
            onClick={() => openWindow('login')}
            className="win95-btn bg-accent text-olive-moss font-pixel text-sm px-4 py-1 font-bold mt-4"
          >
            [ LOGIN NOW ]
          </button>
        </div>
      </div>
    );
  }

  const upcomingList = appointments.filter((a) => a.status === 'CONFIRMED' || a.status === 'PENDING');
  const completedList = appointments.filter((a) => a.status === 'COMPLETED');
  const cancelledList = appointments.filter((a) => a.status === 'CANCELLED');

  const displayedList =
    activeTab === 'upcoming'
      ? upcomingList
      : activeTab === 'completed'
      ? completedList
      : activeTab === 'cancelled'
      ? cancelledList
      : appointments;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="win95-inset p-2.5 bg-cream flex items-center justify-between border border-olive-moss/40">
        <div className="flex items-center gap-3">
          <div className="text-3xl">📋</div>
          <div>
            <h3 className="font-pixel text-lg font-bold text-olive-moss">MY APPOINTMENTS.EXE</h3>
            <p className="text-xs text-olive-dark font-mono">PATIENT RESERVATION LEDGER & MEDICAL SCHEDULE</p>
          </div>
        </div>

        <button onClick={fetchAppointments} className="win95-btn text-xs font-bold">
          🔄 REFRESH LEDGER
        </button>
      </div>

      {/* Retro Navigation Tabs */}
      <div className="flex items-center gap-1 border-b-2 border-olive-moss pb-1 text-xs font-pixel font-bold">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`win95-btn py-1 px-3 ${activeTab === 'upcoming' ? 'bg-accent text-olive-moss border-2 border-olive-moss font-extrabold' : ''}`}
        >
          📅 UPCOMING ({upcomingList.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`win95-btn py-1 px-3 ${activeTab === 'completed' ? 'bg-emerald-700 text-white font-extrabold' : ''}`}
        >
          ✅ COMPLETED ({completedList.length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`win95-btn py-1 px-3 ${activeTab === 'cancelled' ? 'bg-red-800 text-white font-extrabold' : ''}`}
        >
          ❌ CANCELLED ({cancelledList.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`win95-btn py-1 px-3 ${activeTab === 'all' ? 'bg-olive-moss text-cream font-extrabold' : ''}`}
        >
          📜 ALL ({appointments.length})
        </button>
      </div>

      {/* Appointment Cards List */}
      {loading ? (
        <div className="win95-inset p-8 text-center font-mono text-xs text-olive-moss">
          ⏳ QUERYING PATIENT APPOINTMENT RECORDS...
        </div>
      ) : displayedList.length === 0 ? (
        <div className="win95-inset p-6 text-center font-mono text-xs text-olive-moss bg-cream">
          ℹ️ NO APPOINTMENTS FOUND IN THIS CATEGORY.
        </div>
      ) : (
        <div className="space-y-2">
          {displayedList.map((app) => (
            <div
              key={app._id}
              className="win95-box p-3 border-2 border-olive-moss flex flex-wrap items-center justify-between gap-3 bg-white"
            >
              {/* Date Badge */}
              <div className="win95-inset bg-cream p-2 text-center w-24 border border-olive-moss/40">
                <div className="font-pixel text-sm font-extrabold text-olive-moss uppercase">
                  {app.date}
                </div>
                <div className="text-xs font-mono font-bold text-accent-amber bg-olive-moss px-1 py-0.2 mt-0.5">
                  {app.timeSlot}
                </div>
              </div>

              {/* Appointment Info */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-base font-bold text-olive-moss uppercase">
                    {app.doctorName}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-olive-moss/10 font-bold border border-olive-moss/30">
                    {app.departmentName}
                  </span>
                </div>
                <div className="text-xs font-mono text-gray-600 mt-0.5">
                  ID: <span className="font-bold text-olive-dark">{app.appointmentCode}</span>
                </div>
                {app.notes && (
                  <div className="text-[11px] font-mono italic text-gray-500 mt-1">
                    "{app.notes}"
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div>
                <span
                  className={`text-[10px] font-mono font-extrabold px-2.5 py-1 border block text-center ${
                    app.status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-600'
                      : app.status === 'COMPLETED'
                      ? 'bg-blue-100 text-blue-800 border-blue-600'
                      : 'bg-red-100 text-red-800 border-red-600 line-through'
                  }`}
                >
                  {app.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openWindow('confirmation', { appointment: app })}
                  className="win95-btn text-xs font-bold"
                >
                  [ VIEW ]
                </button>
                {app.status === 'CONFIRMED' && (
                  <button
                    disabled={cancellingId === app._id}
                    onClick={() => handleCancelAppointment(app._id)}
                    className="win95-btn bg-red-100 text-red-800 text-xs font-bold border-red-700 hover:bg-red-200"
                  >
                    {cancellingId === app._id ? 'CANCELING...' : '[ CANCEL ]'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book New Shortcut */}
      <div className="pt-2 border-t border-olive-dark/20 flex justify-end">
        <button
          onClick={() => openWindow('booking')}
          className="win95-btn bg-accent text-olive-moss font-pixel text-xs px-4 py-1 font-bold"
        >
          ➕ [ BOOK NEW APPOINTMENT ]
        </button>
      </div>
    </div>
  );
}
