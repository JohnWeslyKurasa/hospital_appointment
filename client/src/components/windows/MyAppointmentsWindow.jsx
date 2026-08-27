import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { 
  CalendarCheck, RefreshCw, Clock, CheckCircle2, 
  XCircle, Plus, FileText, Lock, Eye, AlertCircle
} from 'lucide-react';

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
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
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
      <div className="space-y-4 text-center py-6">
        <div className="p-8 bg-slate-50 border border-slate-200/90 rounded-2xl max-w-md mx-auto space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-800">Patient Authentication Required</h3>
          <p className="text-xs text-slate-500 font-medium">Please login to access your personal appointment schedule and medical ledger.</p>
          <button
            onClick={() => openWindow('login')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-2"
          >
            <span>Log In Now</span>
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
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">My Appointments</h3>
            <p className="text-xs text-slate-500 font-medium">Patient reservation ledger & medical schedule</p>
          </div>
        </div>

        <button
          onClick={fetchAppointments}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'upcoming'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Upcoming ({upcomingList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed ({completedList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'cancelled'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Cancelled ({cancelledList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>All Records ({appointments.length})</span>
        </button>
      </div>

      {/* Appointment List Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs font-medium text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
          <span>Querying patient appointment records...</span>
        </div>
      ) : displayedList.length === 0 ? (
        <div className="p-8 text-center text-xs font-medium text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center gap-2">
          <AlertCircle className="w-6 h-6 text-slate-400" />
          <span>No appointments found in this category.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedList.map((app) => (
            <div
              key={app._id}
              className="p-4 bg-white border border-slate-200/90 rounded-2xl flex flex-wrap items-center justify-between gap-4 hover:shadow-md transition-all duration-200"
            >
              {/* Date & Time Badge */}
              <div className="p-2.5 bg-blue-50/80 border border-blue-100 rounded-xl text-center min-w-[100px]">
                <div className="text-xs font-extrabold text-blue-900 font-mono">
                  {app.date}
                </div>
                <div className="text-[10px] font-bold text-blue-700 font-mono mt-0.5">
                  {app.timeSlot}
                </div>
              </div>

              {/* Appointment Info */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    {app.doctorName}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                    {app.departmentName}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Code: <span className="font-bold text-slate-700">{app.appointmentCode}</span>
                </div>
                {app.notes && (
                  <p className="text-xs text-slate-600 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "{app.notes}"
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border inline-block ${
                    app.status === 'CONFIRMED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : app.status === 'COMPLETED'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200 line-through'
                  }`}
                >
                  {app.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openWindow('confirmation', { appointment: app })}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>View</span>
                </button>

                {app.status === 'CONFIRMED' && (
                  <button
                    disabled={cancellingId === app._id}
                    onClick={() => handleCancelAppointment(app._id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl transition-all"
                  >
                    {cancellingId === app._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book New Appointment Shortcut */}
      <div className="pt-2 border-t border-slate-200 flex justify-end">
        <button
          onClick={() => openWindow('booking')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>
    </div>
  );
}
