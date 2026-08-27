import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { Calendar, Clock, AlertCircle, CheckCircle2, XCircle, FileText, User, Building2 } from 'lucide-react';

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
      setError('Patient not authenticated. Please login first to continue.');
      openWindow('login');
      return;
    }

    if (!selectedDoctorId || !selectedDate || !selectedSlot) {
      setError('Please select a physician, consultation date, and available time slot.');
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
      openWindow('confirmation', { appointment: res.data });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Appointment booking failed.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900">Schedule Appointment</h3>
          <p className="text-xs text-slate-500 font-medium">Reserve consultation time slot with hospital physician</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Department Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>DEPARTMENT</span>
            </label>
            <select
              value={selectedDept}
              onChange={(e) => handleDeptChange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>PHYSICIAN</span>
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => handleDoctorChange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {filteredDoctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.departmentName || 'Specialist'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Doctor Summary */}
        {currentDoctor && (
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">{currentDoctor.name}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{currentDoctor.qualifications}</span>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 rounded-lg text-xs">
              Fee: ₹{currentDoctor.consultationFee}
            </span>
          </div>
        )}

        {/* Date Selection */}
        <div>
          <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>CONSULTATION DATE</span>
          </label>
          <input
            type="date"
            required
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot('');
            }}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Available Time Slots Grid */}
        <div>
          <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>AVAILABLE TIME SLOTS</span>
          </label>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
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
                    className={`py-2 px-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      isBooked
                        ? 'bg-slate-200 text-slate-400 line-through cursor-not-allowed border border-slate-300/50'
                        : isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-extrabold'
                        : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
                    }`}
                  >
                    <span>{slot}</span>
                    {isBooked ? (
                      <XCircle className="w-3 h-3 text-slate-400 shrink-0" />
                    ) : isSelected ? (
                      <CheckCircle2 className="w-3 h-3 text-white shrink-0" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 pt-2 border-t border-slate-200/80">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Available
              </span>
              <span className="font-bold text-blue-600">
                Selected: {selectedSlot || 'None'}
              </span>
              <span className="flex items-center gap-1 text-slate-400 line-through">
                <XCircle className="w-3 h-3" /> Booked
              </span>
            </div>
          </div>
        </div>

        {/* Symptoms / Notes */}
        <div>
          <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>PATIENT NOTES / SYMPTOMS (OPTIONAL)</span>
          </label>
          <textarea
            rows="2"
            placeholder="Brief description of consultation reason..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Form Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => closeWindow('booking')}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !selectedSlot}
            className={`px-6 py-2.5 font-bold text-xs rounded-xl transition-all flex items-center gap-2 ${
              !selectedSlot || loading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? 'Processing Reservation...' : 'Confirm Appointment'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
