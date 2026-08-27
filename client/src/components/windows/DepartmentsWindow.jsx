import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useWindowManager } from '../../context/WindowManagerContext';
import { Building2, UserCheck, RefreshCw, Activity } from 'lucide-react';

export default function DepartmentsWindow() {
  const { openWindow } = useWindowManager();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900">Hospital Departments</h3>
          <p className="text-xs text-slate-500 font-medium">Clinical specialties & healthcare divisions</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-medium text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
          <span>Loading hospital departments directory...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="p-4 bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between hover:shadow-md hover:border-purple-200 transition-all duration-200"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 uppercase">
                      {dept.name}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                      Code: {dept.code} • {dept.location}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2">
                  {dept.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => openWindow('doctors', { departmentName: dept.name })}
                  className="w-full px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>View Department Physicians</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
