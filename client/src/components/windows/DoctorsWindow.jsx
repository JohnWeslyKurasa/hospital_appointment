import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useWindowManager } from '../../context/WindowManagerContext';
import { Search, RefreshCw, UserCheck, Calendar, Award, Clock, AlertCircle } from 'lucide-react';

export default function DoctorsWindow() {
  const { openWindow } = useWindowManager();

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docRes, deptRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/departments')
      ]);
      setDoctors(docRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      console.error('[DOCTORS MODULE ERROR]', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.departmentName && doc.departmentName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDept = selectedDept === '' || doc.departmentName === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls Header */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctor name, specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <button
            onClick={fetchData}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-medium text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
          <span>Loading Doctor Directory Database...</span>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="p-8 text-center text-xs font-medium text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center gap-2">
          <AlertCircle className="w-6 h-6 text-amber-500" />
          <span>No doctor records matching search criteria.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              className="p-4 bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between hover:shadow-md hover:border-blue-200 transition-all duration-200"
            >
              <div className="flex items-start gap-3.5 mb-3">
                <img
                  src={doc.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}
                  alt={doc.name}
                  className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {doc.name}
                  </h4>
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md mb-1 border border-blue-100">
                    {doc.departmentName || 'Specialist'}
                  </span>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    {doc.specialization}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 mb-3 border border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span className="font-semibold text-slate-400">Qualifications:</span>
                  <span className="font-medium text-slate-800">{doc.qualifications}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-semibold text-slate-400">Experience:</span>
                  <span className="font-medium text-slate-800">{doc.experience}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-semibold text-slate-400">Available:</span>
                  <span className="font-medium text-slate-800">{doc.availableDays?.join(', ') || 'MON-FRI'}</span>
                </div>
                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                  <span className="font-semibold text-slate-400">Consultation Fee:</span>
                  <span className="font-bold text-emerald-600">₹{doc.consultationFee}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => openWindow('doctorProfile', { doctorId: doc._id })}
                  className="flex-1 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Profile</span>
                </button>
                <button
                  onClick={() => openWindow('booking', { doctorId: doc._id, departmentName: doc.departmentName })}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
