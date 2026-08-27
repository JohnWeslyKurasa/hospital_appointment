import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';

export default function BookingWindow({ windowData }) {
  const { user } = useAuth();
  const { openWindow, closeWindow } = useWindowManager();

  const initialDocId = windowData?.props?.doctorId || '';
  const initialDept = windowData?.props?.departmentName || '';

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDocId);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');

  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDepartmentsAndDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      fetchBookedSlots();
    }
  }, [selectedDoctorId, selectedDate]);

  const fetchDepartmentsAndDoctors = async () => {
    try {
      const [deptRes, docRes] = await Promise.all([
        api.get('/departments'),
        api.get('/doctors')
      ]);
      setDepartments(deptRes.data);
      setDoctors(docRes.data);

      if (!selectedDoctorId && docRes.data.length > 0) {
        setSelectedDoctorId(docRes.data[0]._id);
        setSelectedDept(docRes.data[0].departmentName);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookedSlots = async () => {
    try {
      const res = await api.get(`/appointments/booked-slots?doctorId=${selectedDoctorId}&date=${selectedDate}`);
      setBookedSlots(res.data.bookedSlots || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeptChange = (deptName) => {
    setSelectedDept(deptName);
    const docInDept = doctors.find((d) => !deptName || d.departmentName === deptName);
    if (docInDept) {
      setSelectedDoctorId(docInDept._id);
    }
    setSelectedSlot('');
  };

  const handleDoctorChange = (docId) => {
    setSelectedDoctorId(docId);
    const doc = doctors.find((d) => d._id === docId);
    if (doc) {
      setSelectedDept(doc.departmentName);
    }
    setSelectedSlot('');
  };

  const currentDoctor = doctors.find((d) => d._id === selectedDoctorId);
  const filteredDoctors = doctors.filter((d) => !selectedDept || d.departmentName === selectedDept);

  const availableSlots = currentDoctor?.timeSlots || [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('PATIENT NOT AUTHENTICATED. PLEASE LOGIN FIRST.');
      openWindow('login');
      return;
    }

    if (!selectedDoctorId || !selectedDate || !selectedSlot) {
      setError('PLEASE SELECT A DOCTOR, DATE, AND TIME SLOT.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/appointments', {
        doctorId: selectedDoctorId,
        date: selectedDate,
        timeSlot: selectedSlot,
        notes
      });

      setLoading(false);
      closeWindow('booking');

      // Open retro confirmation dialog with returned appointment details!
      openWindow('confirmation', { appointment: res.data });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'APPOINTMENT BOOKING FAILED.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="win95-inset p-2.5 bg-cream flex items-center gap-3 border border-olive-moss/40">
        <div className="text-3xl">📅</div>
        <div>
          <h3 className="font-pixel text-lg font-bold text-olive-moss">APPOINTMENT.EXE</h3>
          <p className="text-xs text-olive-dark font-mono">SCHEDULE HOSPITAL CONSULTATION & RESERVE TIME SLOT</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-700 text-red-800 p-2 text-xs font-mono font-bold">
          ⚠️ BOOKING ERROR: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Department Selection */}
          <div>
            <label className="block font-bold text-olive-moss mb-1">
              DEPARTMENT:
            </label>
            <select
              value={selectedDept}
              onChange={(e) => handleDeptChange(e.target.value)}
              className="win95-input w-full font-bold"
            >
              <option value="">[ ALL DEPARTMENTS ]</option>
              {departments.map((d) => (
                <option key={d._id} value={d.name}>
                  {d.icon} {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block font-bold text-olive-moss mb-1">
              DOCTOR:
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => handleDoctorChange(e.target.value)}
              className="win95-input w-full font-bold"
            >
              {filteredDoctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.departmentName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Doctor Summary Box */}
        {currentDoctor && (
          <div className="win95-inset p-2 bg-cream text-[11px] font-mono flex items-center justify-between">
            <div>
              <strong>SELECTED PHYSICIAN:</strong> {currentDoctor.name} ({currentDoctor.qualifications})
            </div>
            <div className="font-bold text-olive-moss bg-accent/20 px-2 py-0.5 border border-olive-moss">
              FEE: ₹{currentDoctor.consultationFee}
            </div>
          </div>
        )}

        {/* Date Selection */}
        <div>
          <label className="block font-bold text-olive-moss mb-1">
            CONSULTATION DATE:
          </label>
          <input
            type="date"
            required
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot('');
            }}
            className="win95-input w-full font-mono text-sm"
          />
        </div>

        {/* Available Time Slots Grid */}
        <div>
          <label className="block font-bold text-olive-moss mb-1">
            AVAILABLE TIME SLOTS (CLICK TO SELECT):
          </label>

          <div className="win95-inset p-3 bg-white">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {availableSlots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedSlot === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`win95-btn py-1.5 font-mono text-xs font-bold transition-all ${
                      isBooked
                        ? 'opacity-40 line-through bg-gray-200 text-gray-500 cursor-not-allowed border-gray-400'
                        : isSelected
                        ? 'bg-accent font-extrabold text-olive-moss border-2 border-olive-moss shadow-inner'
                        : 'bg-cream text-olive-moss hover:bg-cream-light'
                    }`}
                  >
                    {slot} {isBooked ? '❌' : isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-olive-dark/20 text-[10px] font-mono text-olive-moss">
              <span>✓ AVAILABLE</span>
              <span className="text-accent font-bold">★ SELECTED: {selectedSlot || 'NONE'}</span>
              <span className="line-through opacity-60">❌ BOOKED / UNAVAILABLE</span>
            </div>
          </div>
        </div>

        {/* Medical Notes */}
        <div>
          <label className="block font-bold text-olive-moss mb-1">
            PATIENT NOTES / SYMPTOMS (OPTIONAL):
          </label>
          <textarea
            rows="2"
            placeholder="Brief reason for consultation..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="win95-input w-full"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-olive-dark/20">
          <button
            type="button"
            onClick={() => closeWindow('booking')}
            className="win95-btn text-xs font-bold"
          >
            [ CANCEL ]
          </button>

          <button
            type="submit"
            disabled={loading || !selectedSlot}
            className={`win95-btn font-pixel text-sm px-6 py-1.5 font-bold ${
              !selectedSlot
                ? 'opacity-50 cursor-not-allowed'
                : 'bg-accent text-olive-moss hover:bg-accent-amber'
            }`}
          >
            {loading ? 'PROCESSING RESERVATION...' : '[ CONFIRM APPOINTMENT ]'}
          </button>
        </div>
      </form>
    </div>
  );
}
