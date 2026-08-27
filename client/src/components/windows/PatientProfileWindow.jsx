import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import api from '../../services/api';
import { User, ShieldCheck, Mail, Phone, Calendar, MapPin, Edit3, KeyRound, LogOut, Lock } from 'lucide-react';

export default function PatientProfileWindow() {
  const { user, setUser, logout } = useAuth();
  const { openWindow, closeWindow } = useWindowManager();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    address: user?.address || '',
    gender: user?.gender || 'Male'
  });
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm text-slate-800">No Active Session</h4>
        <p className="text-xs text-slate-500 font-medium">Please login to view or update your profile.</p>
        <button
          onClick={() => openWindow('login')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          Log In Now
        </button>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put(`/patients/${user._id}`, formData);
      setUser({ ...user, ...res.data });
      setIsEditing(false);
      alert('Profile updated successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile Header Card */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20 shrink-0">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">{user.name}</h3>
            <div className="inline-block px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-mono font-bold rounded-md mt-0.5 shadow-2xs">
              ID: {user.patientId || `PAT-${user._id.slice(-6).toUpperCase()}`}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Role: <span className="font-bold text-slate-700 uppercase">{user.role}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Details View or Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSave} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address:
            </span>
            <strong className="text-slate-800">{user.email}</strong>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-500 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number:
            </span>
            <strong className="text-slate-800">{user.phone || 'Not Specified'}</strong>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date of Birth:
            </span>
            <strong className="text-slate-800">{user.dob || 'Not Specified'}</strong>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Address:
            </span>
            <strong className="text-slate-800">{user.address || 'Not Specified'}</strong>
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        )}

        <button
          onClick={() => alert('MEDICARE Security: Password change verification link sent to registered email.')}
          className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
        >
          <KeyRound className="w-3.5 h-3.5 text-slate-400" />
          <span>Change Password</span>
        </button>

        <button
          onClick={() => {
            logout();
            closeWindow('patientProfile');
          }}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout Session</span>
        </button>
      </div>
    </div>
  );
}
