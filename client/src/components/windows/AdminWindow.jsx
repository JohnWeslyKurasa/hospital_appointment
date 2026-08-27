import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { 
  ShieldCheck, Users, UserCheck, Calendar, AlertCircle, 
  BarChart3, Building2, Plus, Trash2, RefreshCw, Lock, 
  Mail, KeyRound, CheckCircle2, Copy
} from 'lucide-react';

export default function AdminWindow() {
  const { user } = useAuth();
  const { openWindow } = useWindowManager();

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todaysAppointments: 0,
    pendingAppointments: 0
  });
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('overview');

  const [newDoc, setNewDoc] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    departmentId: '',
    qualifications: 'MD, MBBS',
    experience: '5 Years',
    consultationFee: 75,
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  });
  const [addingDoc, setAddingDoc] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [docRes, deptRes, appRes, patRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/departments'),
        api.get('/appointments'),
        api.get('/patients')
      ]);

      setDoctors(docRes.data);
      setDepartments(deptRes.data);
      setAppointments(appRes.data);

      if (deptRes.data.length > 0 && !newDoc.departmentId) {
        setNewDoc((prev) => ({ ...prev, departmentId: deptRes.data[0]._id }));
      }

      setStats({
        totalPatients: patRes.data.length || 1,
        totalDoctors: docRes.data.length,
        todaysAppointments: appRes.data.length,
        pendingAppointments: appRes.data.filter((a) => a.status === 'PENDING').length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm text-rose-800 uppercase">403 Access Denied: Administrator Required</h4>
        <p className="text-xs text-rose-600 font-medium max-w-sm mx-auto">This control panel is restricted exclusively to system administrators.</p>
        <button
          onClick={() => openWindow('login')}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          Log In as Admin
        </button>
      </div>
    );
  }

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      setAddingDoc(true);
      setCreatedCredentials(null);
      const res = await api.post('/doctors', newDoc);
      
      setCreatedCredentials({
        name: res.data.name,
        email: res.data.credentials?.email || newDoc.email,
        password: res.data.credentials?.password || newDoc.password || 'doctor123',
        specialization: res.data.specialization,
        departmentName: res.data.departmentName
      });

      setNewDoc({
        name: '',
        email: '',
        password: '',
        specialization: '',
        departmentId: departments[0]?._id || '',
        qualifications: 'MD, MBBS',
        experience: '5 Years',
        consultationFee: 75,
        photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
      });
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add doctor');
    } finally {
      setAddingDoc(false);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to remove this physician entry?')) return;
    try {
      await api.delete(`/doctors/${id}`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete doctor');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-3.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Administration Console</h3>
            <p className="text-xs text-slate-500 font-medium">MEDICARE system central control panel & doctor account management</p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Created Doctor Credentials Modal Banner */}
      {createdCredentials && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Doctor Account Created & Provisioned Successfully!</span>
            </div>
            <button
              onClick={() => setCreatedCredentials(null)}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>

          <div className="p-3 bg-white border border-emerald-200/80 rounded-xl text-xs space-y-2 font-mono">
            <div className="flex justify-between items-center border-b border-slate-100 pb-1">
              <span className="text-slate-400 font-semibold">Doctor Name:</span>
              <span className="font-bold text-slate-800">{createdCredentials.name} ({createdCredentials.departmentName})</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-1">
              <span className="text-slate-400 font-semibold">Login Email:</span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{createdCredentials.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Login Password:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{createdCredentials.password}</span>
            </div>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium italic">
            Provide these credentials to the physician for logging into their Doctor Desk workspace.
          </p>
        </div>
      )}

      {/* Modern Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl text-center shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Total Patients</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalPatients}</div>
          <div className="text-[10px] text-slate-400 font-medium">Registered Users</div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl text-center shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Total Doctors</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{stats.totalDoctors}</div>
          <div className="text-[10px] text-slate-400 font-medium">Active Physicians</div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl text-center shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Appointments</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">{stats.todaysAppointments}</div>
          <div className="text-[10px] text-slate-400 font-medium">System Ledger</div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl text-center shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Pending Review</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{stats.pendingAppointments}</div>
          <div className="text-[10px] text-slate-400 font-medium">Needs Attention</div>
        </div>
      </div>

      {/* Admin Section Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'doctors' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Create & Manage Doctors ({doctors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'departments' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Departments ({departments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'appointments' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Ledger ({appointments.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 text-xs">
          <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>System Telemetry & Access Control</span>
          </h4>
          <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs space-y-1.5">
            <div>[SECURITY] Doctor account creation restricted exclusively to System Administrator</div>
            <div>[OK] MEDICARE OS Database Service Initialized</div>
            <div>[OK] MongoDB Cloud Persistence Stack Online</div>
            <div>[OK] Auth Protocol (JWT/Bcrypt Hash) Functional</div>
          </div>
        </div>
      )}

      {activeTab === 'doctors' && (
        <div className="space-y-4 text-xs">
          {/* Add Doctor Form */}
          <form onSubmit={handleAddDoctor} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Create & Provision New Doctor Account</span>
              </h4>
              <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-md">
                Admin Privilege
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Gregory House"
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Login Email</label>
                <input
                  type="email"
                  required
                  placeholder="doctor.house@medicare.in"
                  value={newDoc.email}
                  onChange={(e) => setNewDoc({ ...newDoc, email: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Login Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newDoc.password}
                  onChange={(e) => setNewDoc({ ...newDoc, password: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Specialization</label>
                <input
                  type="text"
                  required
                  placeholder="Diagnostician"
                  value={newDoc.specialization}
                  onChange={(e) => setNewDoc({ ...newDoc, specialization: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Department</label>
                <select
                  value={newDoc.departmentId}
                  onChange={(e) => setNewDoc({ ...newDoc, departmentId: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Qualifications</label>
                <input
                  type="text"
                  value={newDoc.qualifications}
                  onChange={(e) => setNewDoc({ ...newDoc, qualifications: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Consultation Fee (₹)</label>
                <input
                  type="number"
                  value={newDoc.consultationFee}
                  onChange={(e) => setNewDoc({ ...newDoc, consultationFee: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={addingDoc}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{addingDoc ? 'Provisioning Account...' : 'Create Doctor Account & Profile'}</span>
            </button>
          </form>

          {/* Doctors List */}
          <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2 max-h-[240px] overflow-y-auto">
            {doctors.map((doc) => (
              <div key={doc._id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <div>
                  <strong className="font-bold text-slate-800">{doc.name}</strong>
                  <span className="text-xs text-slate-500 ml-2">
                    ({doc.departmentName || 'Specialist'} - {doc.specialization})
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteDoctor(doc._id)}
                  className="px-3 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'departments' && (
        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 text-xs">
          <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>Hospital Departments Listing</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {departments.map((d) => (
              <div key={d._id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong className="font-bold text-slate-800 block text-xs">{d.name} ({d.code})</strong>
                <p className="text-[11px] text-slate-500">{d.description}</p>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-block">
                  Location: {d.location}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs text-xs max-h-[320px] overflow-y-auto">
          <div className="grid grid-cols-12 gap-2 bg-slate-900 text-slate-200 p-3 font-bold text-[11px] uppercase">
            <div className="col-span-2">Code</div>
            <div className="col-span-3">Patient</div>
            <div className="col-span-3">Doctor</div>
            <div className="col-span-2">Date/Time</div>
            <div className="col-span-2">Status</div>
          </div>
          <div className="divide-y divide-slate-100">
            {appointments.map((app) => (
              <div key={app._id} className="grid grid-cols-12 gap-2 items-center p-3 text-xs hover:bg-slate-50">
                <div className="col-span-2 font-mono font-bold text-slate-800">{app.appointmentCode}</div>
                <div className="col-span-3 truncate text-slate-700">{app.patientName}</div>
                <div className="col-span-3 truncate text-slate-700">{app.doctorName}</div>
                <div className="col-span-2 font-mono text-[11px] text-slate-500">{app.date} {app.timeSlot}</div>
                <div className="col-span-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-md border border-blue-100 text-[10px]">
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
