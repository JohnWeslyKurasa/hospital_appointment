import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useWindowManager } from '../../context/WindowManagerContext';
import { Search, Stethoscope, Building2, Eye, ArrowRight } from 'lucide-react';

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
      setResults({ doctors: docRes.data, departments: deptRes.data });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults({ doctors, departments });
      return;
    }

    const q = query.toLowerCase();

    const matchedDocs = doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        (d.departmentName && d.departmentName.toLowerCase().includes(q))
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
    <div className="space-y-4">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search doctors, departments, specializations..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value.trim()) {
                setResults({ doctors, departments });
              }
            }}
            className="w-full text-xs text-slate-800 focus:outline-none placeholder-slate-400"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          Search
        </button>
      </form>

      {/* Results View */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl space-y-4 max-h-[380px] overflow-y-auto">
        {/* Doctors Match */}
        <div>
          <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Stethoscope className="w-4 h-4 text-blue-600" />
            <span>Matching Doctors ({results.doctors.length})</span>
          </h4>
          {results.doctors.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">No matching doctor records found.</p>
          ) : (
            <div className="space-y-2 mt-2">
              {results.doctors.map((d) => (
                <div key={d._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center hover:bg-blue-50/50 transition-colors">
                  <div>
                    <strong className="font-bold text-xs text-slate-800">{d.name}</strong>
                    <p className="text-[11px] text-slate-500">{d.departmentName || 'Specialist'} • {d.specialization}</p>
                  </div>
                  <button
                    onClick={() => {
                      closeWindow('search');
                      openWindow('doctorProfile', { doctorId: d._id });
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>View</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Departments Match */}
        <div>
          <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>Matching Departments ({results.departments.length})</span>
          </h4>
          {results.departments.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">No matching department records found.</p>
          ) : (
            <div className="space-y-2 mt-2">
              {results.departments.map((dep) => (
                <div key={dep._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center hover:bg-purple-50/50 transition-colors">
                  <div>
                    <strong className="font-bold text-xs text-slate-800">{dep.name} ({dep.code})</strong>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{dep.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      closeWindow('search');
                      openWindow('doctors', { departmentName: dep.name });
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>Explore</span>
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
