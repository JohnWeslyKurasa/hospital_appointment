import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useWindowManager } from '../../context/WindowManagerContext';

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
      console.error('[DOCTORS.EXE ERROR]', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = selectedDept === '' || doc.departmentName === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-3">
      {/* Search and Filter Controls Header */}
      <div className="win95-inset p-2.5 bg-cream flex flex-wrap items-center justify-between gap-2 border border-olive-moss/30">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <span className="font-bold text-xs text-olive-moss">SEARCH:</span>
          <input
            type="text"
            placeholder="Doctor name, specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="win95-input flex-1 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-olive-moss">DEPT:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="win95-input text-xs"
          >
            <option value="">[ ALL DEPARTMENTS ]</option>
            {departments.map((d) => (
              <option key={d._id} value={d.name}>
                {d.icon} {d.name}
              </option>
            ))}
          </select>

          <button onClick={fetchData} className="win95-btn text-xs font-bold">
            🔄 REFRESH
          </button>
        </div>
      </div>

      {loading ? (
        <div className="win95-inset p-8 text-center font-mono text-xs text-olive-moss">
          ⏳ INITIALIZING DOCTOR DIRECTORY DATABASE...
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="win95-inset p-6 text-center font-mono text-xs text-olive-moss bg-cream">
          ⚠️ NO DOCTOR RECORDS MATCHING SEARCH CRITERIA.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              className="win95-box p-3 border-2 border-olive-moss flex flex-col justify-between hover:bg-cream-light transition-colors"
            >
              <div className="flex items-start gap-3 mb-2">
                <img
                  src={doc.photoUrl}
                  alt={doc.name}
                  className="w-14 h-14 object-cover border-2 border-olive-moss rounded-none"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-pixel text-base font-bold text-olive-moss truncate">
                    {doc.name.toUpperCase()}
                  </h4>
                  <div className="text-[11px] font-bold text-accent-amber bg-olive-moss px-1.5 py-0.2 inline-block rounded-none mb-1">
                    {doc.departmentName || 'Specialist'}
                  </div>
                  <div className="text-[11px] text-olive-dark font-mono truncate">
                    {doc.specialization}
                  </div>
                </div>
              </div>

              <div className="win95-inset p-2 bg-cream text-[10px] font-mono space-y-0.5 mb-2">
                <div>
                  <strong>QUAL:</strong> {doc.qualifications}
                </div>
                <div>
                  <strong>EXPERIENCE:</strong> {doc.experience}
                </div>
                <div>
                  <strong>AVAILABLE:</strong> {doc.availableDays?.join(', ') || 'MON-FRI'}
                </div>
                <div>
                  <strong>FEE:</strong> ${doc.consultationFee} USD
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-1 border-t border-olive-dark/20">
                <button
                  onClick={() => openWindow('doctorProfile', { doctorId: doc._id })}
                  className="win95-btn flex-1 text-[11px] font-bold"
                >
                  [ VIEW PROFILE ]
                </button>
                <button
                  onClick={() => openWindow('booking', { doctorId: doc._id, departmentName: doc.departmentName })}
                  className="win95-btn flex-1 bg-accent/40 text-olive-moss text-[11px] font-bold"
                >
                  [ BOOK APPOINTMENT ]
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
