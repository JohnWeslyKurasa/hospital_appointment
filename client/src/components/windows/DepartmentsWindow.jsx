import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useWindowManager } from '../../context/WindowManagerContext';

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
      {/* Header */}
      <div className="win95-inset p-3 bg-cream flex items-center gap-3 border border-olive-moss/40">
        <div className="text-3xl">💊</div>
        <div>
          <h3 className="font-pixel text-lg font-bold text-olive-moss">DEPARTMENTS.EXE</h3>
          <p className="text-xs text-olive-dark font-mono">CLINICAL SPECIALTIES & HOSPITAL DIVISIONS</p>
        </div>
      </div>

      {loading ? (
        <div className="win95-inset p-8 text-center font-mono text-xs text-olive-moss">
          ⏳ LOADING HOSPITAL DEPARTMENTS DIRECTORY...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="win95-box p-3 border-2 border-olive-moss bg-white flex flex-col justify-between hover:bg-cream-light transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{dept.icon}</span>
                  <h4 className="font-pixel text-base font-extrabold text-olive-moss uppercase">
                    {dept.name}
                  </h4>
                </div>
                <div className="text-[10px] font-mono font-bold text-accent-amber bg-olive-moss px-1.5 py-0.2 inline-block mb-1">
                  CODE: {dept.code} | {dept.location}
                </div>
                <p className="text-xs font-mono text-gray-600">
                  {dept.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-olive-dark/20 flex gap-2">
                <button
                  onClick={() => openWindow('doctors', { departmentName: dept.name })}
                  className="win95-btn flex-1 bg-accent/30 text-olive-moss font-pixel text-xs font-bold py-1"
                >
                  👨‍⚕️ [ VIEW PHYSICIANS ]
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
