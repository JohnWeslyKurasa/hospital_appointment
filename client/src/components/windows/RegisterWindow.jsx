import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { UserPlus, Mail, Lock, Phone, MapPin, Calendar, AlertCircle, LogIn } from 'lucide-react';

export default function RegisterWindow() {
  const { register } = useAuth();
  const { openWindow, closeWindow } = useWindowManager();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '1995-06-20',
    gender: 'Male',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      closeWindow('register');
      openWindow('doctors');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900">New Patient Registration</h3>
          <p className="text-xs text-slate-500 font-medium">Create personal patient account & medical record file</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Jane Smith"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              required
              value={formData.dob}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
          <input
            type="text"
            name="address"
            placeholder="123 Medical District, Suite 4B"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            placeholder="Create strong password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              closeWindow('register');
              openWindow('login');
            }}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-500" />
            <span>Already registered? Login</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Registering...' : 'Register Patient'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
