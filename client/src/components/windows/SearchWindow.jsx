import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useWindowManager } from '../../context/WindowManagerContext';

export default function SearchWindow() {
  const { openWindow, closeWindow } = useWindowManager();
  const [query, setQuery] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [results, setResults] = useState({ doctors: [], departments: [] });

  useEffect(() => {
    fetchSearchData();
  }, []);

  const fetchSearchData = async () => {
    try {
      const [docRes, deptRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/departments')
      ]);
      setDoctors(docRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const q = query.toLowerCase();

    const matchedDocs = doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.departmentName.toLowerCase().includes(q)
    );

    const matchedDepts = departments.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );

    setResults({ doctors: matchedDocs, departments: matchedDepts });
  };

  return (
    <div className="space-y-3 font-mono text-xs select-text">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="win95-inset p-3 bg-cream flex gap-2 border border-olive-moss/40">
        <input
          type="text"
          placeholder="Search doctors, departments, specializations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="win95-input flex-1 text-xs"
        />
        <button type="submit" className="win95-btn bg-accent text-olive-moss font-pixel text-xs font-bold px-4">
          [ SEARCH ]
        </button>
      </form>

      {/* Results view */}
      <div className="win95-inset p-3 bg-white space-y-3 max-h-[340px] overflow-y-auto">
        <div>
          <h4 className="font-pixel text-xs font-bold text-olive-moss border-b border-olive-dark/20 pb-1 mb-2">
            👨‍⚕️ MATCHING DOCTORS ({results.doctors.length})
          </h4>
          {results.doctors.length === 0 ? (
            <span className="text-gray-400 italic">No doctors matched.</span>
          ) : (
            <div className="space-y-1.5">
              {results.doctors.map((d) => (
                <div key={d._id} className="flex justify-between items-center p-1.5 win95-box bg-cream">
                  <div>
                    <strong className="text-olive-moss font-pixel">{d.name}</strong>
                    <div className="text-[10px] text-gray-600">{d.departmentName} - {d.specialization}</div>
                  </div>
                  <button
                    onClick={() => {
                      closeWindow('search');
                      openWindow('doctorProfile', { doctorId: d._id });
                    }}
                    className="win95-btn text-[10px] font-bold"
                  >
                    [ VIEW ]
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-pixel text-xs font-bold text-olive-moss border-b border-olive-dark/20 pb-1 mb-2">
            💊 MATCHING DEPARTMENTS ({results.departments.length})
          </h4>
          {results.departments.length === 0 ? (
            <span className="text-gray-400 italic">No departments matched.</span>
          ) : (
            <div className="space-y-1.5">
              {results.departments.map((dep) => (
                <div key={dep._id} className="flex justify-between items-center p-1.5 win95-box bg-cream">
                  <div>
                    <strong className="text-olive-moss font-pixel">{dep.icon} {dep.name} ({dep.code})</strong>
                    <div className="text-[10px] text-gray-600">{dep.description}</div>
                  </div>
                  <button
                    onClick={() => {
                      closeWindow('search');
                      openWindow('doctors', { departmentName: dep.name });
                    }}
                    className="win95-btn text-[10px] font-bold"
                  >
                    [ EXPLORE ]
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
