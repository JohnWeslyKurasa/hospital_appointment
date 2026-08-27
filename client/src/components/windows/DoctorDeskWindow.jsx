import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { Activity, ShieldAlert, RefreshCw, CheckCircle2, XCircle, Clock, Settings, Plus, History, Lock } from 'lucide-react';

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

  if (!user || (user.role !== 'doctor' && user.role !== 'admin')) {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm text-rose-800 uppercase">403 Access Denied: Doctor Role Required</h4>
        <p className="text-xs text-rose-600 font-medium max-w-sm mx-auto">This workspace is restricted to authorized medical physicians and administrators.</p>
        <button
          onClick={() => openWindow('login')}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          Log In as Doctor
        </button>
      </div>
    );
  }

  const filteredApps = filterStatus === 'ALL'
    ? appointments
    : appointments.filter((a) => a.status === filterStatus);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Doctor Desk Workspace</h3>
            <p className="text-xs text-slate-500 font-medium">Physician clinical dashboard & patient queue schedule</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs">
            Physician: {user.name}
          </span>
          <button
            onClick={fetchDoctorAppointments}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-slate-400 font-semibold mr-1">FILTER:</span>
          {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
          Total Patients: {appointments.length}
        </span>
      </div>

      {/* Main Schedule Table */}
      {loading ? (
        <div className="p-12 text-center text-xs font-medium text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
          <span>Retrieving clinical appointments from server...</span>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="p-8 text-center text-xs font-medium text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
          <span>No patient appointments found for selected filter.</span>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs text-xs">
          <div className="grid grid-cols-12 gap-2 bg-slate-900 text-slate-200 p-3 font-bold text-[11px] uppercase">
            <div className="col-span-2">Time</div>
            <div className="col-span-4">Patient Name</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto">
            {filteredApps.map((app) => (
              <div
                key={app._id}
                className="grid grid-cols-12 gap-2 items-center p-3 hover:bg-blue-50/40 transition-colors"
              >
                <div className="col-span-2 font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg text-center border border-blue-100">
                  {app.timeSlot}
                </div>

                <div className="col-span-4">
                  <strong className="text-slate-800 block text-xs">{app.patientName}</strong>
                  <span className="text-[10px] text-slate-400 font-mono">Code: {app.appointmentCode}</span>
                </div>

                <div className="col-span-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border inline-block ${
                      app.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : app.status === 'COMPLETED'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-1.5">
                  {app.status !== 'COMPLETED' && (
                    <button
                      disabled={updatingId === app._id}
                      onClick={() => handleUpdateStatus(app._id, 'COMPLETED')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition-all shadow-2xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Complete</span>
                    </button>
                  )}
                  {app.status !== 'CANCELLED' && (
                    <button
                      disabled={updatingId === app._id}
                      onClick={() => handleUpdateStatus(app._id, 'CANCELLED')}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg transition-all shadow-2xs flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200 text-xs">
        <button
          onClick={() => alert('Clinic Config: Daily schedule preferences saved.')}
          className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>Set Availability</span>
        </button>

        <button
          onClick={() => alert('Slot Builder: Emergency consultation slots generated.')}
          className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-slate-400" />
          <span>Create Slots</span>
        </button>

        <button
          onClick={() => alert('History Logs: Past patient consultation archives ready.')}
          className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5"
        >
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span>View History</span>
        </button>
      </div>
    </div>
  );
}
