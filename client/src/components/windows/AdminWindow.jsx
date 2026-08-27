import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';

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
    specialization: '',
    departmentId: '',
    qualifications: 'MD, MBBS',
    experience: '5 Years',
    consultationFee: 75,
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  });
  const [addingDoc, setAddingDoc] = useState(false);

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

  // Role Guard Check
  if (!user || user.role !== 'admin') {
    return (
      <div className="space-y-4 text-center select-text">
        <div className="win95-inset p-6 bg-red-50 border-2 border-red-700">
          <div className="text-5xl mb-2">⛔</div>
          <h3 className="font-pixel text-xl font-bold text-red-800 uppercase">
            403 ACCESS DENIED: SYSTEM ADMINISTRATOR REQUIRED
          </h3>
          <p className="text-xs font-mono font-bold text-red-900 mt-1">
            SECURITY PROTOCOL: THIS CONSOLE IS RESTRICTED TO SYSTEM ADMINISTRATORS ONLY.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => openWindow('login')}
              className="win95-btn bg-accent text-olive-moss font-pixel text-xs px-4 py-1 font-bold"
            >
              [ LOGIN AS ADMIN ]
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      setAddingDoc(true);
      await api.post('/doctors', newDoc);
      alert('NEW DOCTOR REGISTERED SUCCESSFULLY.');
      setNewDoc({
        name: '',
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
    if (!window.confirm('PURGE DOCTOR FROM SYSTEM DATABASE?')) return;
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
      <div className="win95-inset p-3 bg-cream flex items-center justify-between border-2 border-olive-moss">
        <div className="flex items-center gap-3">
          <div className="text-4xl">⚙️</div>
          <div>
            <h3 className="font-pixel text-xl font-bold text-olive-moss">ADMIN.EXE</h3>
            <p className="text-xs font-mono text-olive-dark">
              MEDICARE SYSTEM CENTRAL MANAGEMENT CONSOLE
            </p>
          </div>
        </div>

        <button onClick={fetchAdminData} className="win95-btn text-xs font-bold">
          🔄 REFRESH METRICS
        </button>
      </div>

      {/* Retro Statistics Panels */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="win95-box p-2.5 text-center border-2 border-olive-moss bg-cream">
          <div className="text-[10px] font-mono font-bold text-olive-dark uppercase">TOTAL PATIENTS</div>
          <div className="font-pixel text-3xl font-extrabold text-olive-moss mt-0.5">
            {stats.totalPatients}
          </div>
          <div className="text-[9px] font-mono text-gray-500">REGISTERED USERS</div>
        </div>

        <div className="win95-box p-2.5 text-center border-2 border-olive-moss bg-cream">
          <div className="text-[10px] font-mono font-bold text-olive-dark uppercase">TOTAL DOCTORS</div>
          <div className="font-pixel text-3xl font-extrabold text-olive-moss mt-0.5">
            {stats.totalDoctors}
          </div>
          <div className="text-[9px] font-mono text-gray-500">ACTIVE PHYSICIANS</div>
        </div>

        <div className="win95-box p-2.5 text-center border-2 border-olive-moss bg-cream">
          <div className="text-[10px] font-mono font-bold text-olive-dark uppercase">APPOINTMENTS</div>
          <div className="font-pixel text-3xl font-extrabold text-accent-amber bg-olive-moss inline-block px-2 rounded-none mt-0.5">
            {stats.todaysAppointments}
          </div>
          <div className="text-[9px] font-mono text-gray-500">SYSTEM LEDGER</div>
        </div>

        <div className="win95-box p-2.5 text-center border-2 border-olive-moss bg-cream">
          <div className="text-[10px] font-mono font-bold text-olive-dark uppercase">PENDING</div>
          <div className="font-pixel text-3xl font-extrabold text-red-700 mt-0.5">
            {stats.pendingAppointments}
          </div>
          <div className="text-[9px] font-mono text-gray-500">NEEDS REVIEW</div>
        </div>
      </div>

      {/* Admin Section Tabs */}
      <div className="flex items-center gap-1 border-b-2 border-olive-moss pb-1 text-xs font-pixel font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`win95-btn py-1 px-3 ${activeTab === 'overview' ? 'bg-accent text-olive-moss font-extrabold' : ''}`}
        >
          📊 OVERVIEW
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          className={`win95-btn py-1 px-3 ${activeTab === 'doctors' ? 'bg-accent text-olive-moss font-extrabold' : ''}`}
        >
          👨‍⚕️ MANAGE DOCTORS ({doctors.length})
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`win95-btn py-1 px-3 ${activeTab === 'departments' ? 'bg-accent text-olive-moss font-extrabold' : ''}`}
        >
          💊 DEPARTMENTS ({departments.length})
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`win95-btn py-1 px-3 ${activeTab === 'appointments' ? 'bg-accent text-olive-moss font-extrabold' : ''}`}
        >
          📅 APPOINTMENT LEDGER ({appointments.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="win95-inset p-3 bg-white space-y-3 font-mono text-xs">
          <h4 className="font-pixel text-sm font-bold text-olive-moss border-b border-olive-dark/20 pb-1">
            🖥️ SYSTEM HEALTH & EVENT LOGS
          </h4>
          <div className="bg-cream-light p-2 border border-olive-moss/30 font-mono text-[11px] space-y-1">
            <div>[STATUS] MEDICARE.EXE DATABASE INITIALIZED</div>
            <div>[DATABASE] CLOUD MONGO DB ATLAS CONNECTED</div>
            <div>[SECURITY] DOUBLE-BOOKING PREVENTION SUBSYSTEM: ACTIVE</div>
            <div>[ROLE AUTH] PATIENT / DOCTOR / ADMIN PERMISSION ENFORCEMENT: ONLINE</div>
          </div>
        </div>
      )}

      {activeTab === 'doctors' && (
        <div className="space-y-3 font-mono text-xs">
          {/* Add Doctor Form */}
          <form onSubmit={handleAddDoctor} className="win95-inset p-3 bg-cream space-y-2 border border-olive-moss/40">
            <h4 className="font-pixel text-sm font-bold text-olive-moss uppercase">
              ➕ ADD NEW DOCTOR ENTRY
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-olive-moss text-[11px]">DOCTOR NAME:</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Gregory House"
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                  className="win95-input w-full"
                />
              </div>

              <div>
                <label className="block font-bold text-olive-moss text-[11px]">SPECIALIZATION:</label>
                <input
                  type="text"
                  required
                  placeholder="Diagnostician"
                  value={newDoc.specialization}
                  onChange={(e) => setNewDoc({ ...newDoc, specialization: e.target.value })}
                  className="win95-input w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-olive-moss text-[11px]">DEPARTMENT:</label>
                <select
                  value={newDoc.departmentId}
                  onChange={(e) => setNewDoc({ ...newDoc, departmentId: e.target.value })}
                  className="win95-input w-full"
                >
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-olive-moss text-[11px]">QUALIFICATIONS:</label>
                <input
                  type="text"
                  value={newDoc.qualifications}
                  onChange={(e) => setNewDoc({ ...newDoc, qualifications: e.target.value })}
                  className="win95-input w-full"
                />
              </div>

              <div>
                <label className="block font-bold text-olive-moss text-[11px]">CONSULTATION FEE ($):</label>
                <input
                  type="number"
                  value={newDoc.consultationFee}
                  onChange={(e) => setNewDoc({ ...newDoc, consultationFee: Number(e.target.value) })}
                  className="win95-input w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={addingDoc}
              className="win95-btn bg-accent text-olive-moss font-pixel text-xs font-bold px-4 py-1"
            >
              {addingDoc ? 'ADDING...' : '[ REGISTER DOCTOR TO DATABASE ]'}
            </button>
          </form>

          {/* Doctors List */}
          <div className="win95-inset p-2 bg-white space-y-1 max-h-[220px] overflow-y-auto">
            {doctors.map((doc) => (
              <div key={doc._id} className="flex items-center justify-between p-1.5 border-b border-winborder-mid text-xs">
                <div>
                  <strong className="text-olive-moss font-pixel">{doc.name}</strong>
                  <span className="text-[10px] text-gray-500 font-mono ml-2">
                    ({doc.departmentName} - {doc.specialization})
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteDoctor(doc._id)}
                  className="win95-btn bg-red-100 text-red-800 text-[10px] font-bold px-2"
                >
                  🗑️ REMOVE
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'departments' && (
        <div className="win95-inset p-3 bg-white space-y-2 font-mono text-xs">
          <h4 className="font-pixel text-sm font-bold text-olive-moss border-b border-olive-dark/20 pb-1">
            🏥 HOSPITAL DEPARTMENTS LISTING
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {departments.map((d) => (
              <div key={d._id} className="win95-box p-2 border border-olive-moss bg-cream">
                <div className="font-pixel text-base font-bold text-olive-moss">
                  {d.icon} {d.name} ({d.code})
                </div>
                <div className="text-[10px] text-olive-dark mt-0.5">{d.description}</div>
                <div className="text-[9px] text-gray-500 mt-0.5 font-bold">LOC: {d.location}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="win95-inset p-2 bg-white font-mono text-xs max-h-[300px] overflow-y-auto">
          <div className="grid grid-cols-12 gap-1 bg-olive-moss text-cream p-1 font-bold text-[10px]">
            <div className="col-span-2">ID</div>
            <div className="col-span-3">PATIENT</div>
            <div className="col-span-3">DOCTOR</div>
            <div className="col-span-2">DATE/TIME</div>
            <div className="col-span-2">STATUS</div>
          </div>
          {appointments.map((app) => (
            <div key={app._id} className="grid grid-cols-12 gap-1 items-center p-1 border-b border-winborder-mid text-[11px]">
              <div className="col-span-2 font-bold">{app.appointmentCode}</div>
              <div className="col-span-3 truncate">{app.patientName}</div>
              <div className="col-span-3 truncate">{app.doctorName}</div>
              <div className="col-span-2">{app.date} {app.timeSlot}</div>
              <div className="col-span-2">
                <span className="bg-olive-moss/10 text-olive-moss font-bold px-1 text-[9px]">
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
