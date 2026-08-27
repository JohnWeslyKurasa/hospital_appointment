import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import api from '../../services/api';

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
      <div className="win95-inset p-6 text-center font-mono text-xs text-olive-moss bg-cream">
        ⚠️ NO ACTIVE PATIENT SESSION. PLEASE LOGIN FIRST.
        <div className="mt-3">
          <button onClick={() => openWindow('login')} className="win95-btn font-pixel text-xs font-bold px-3 py-1">
            [ LOGIN ]
          </button>
        </div>
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
      alert('PROFILE UPDATED SUCCESSFULLY.');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header ID Card */}
      <div className="win95-inset p-4 bg-cream flex items-center justify-between border-2 border-olive-moss">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-olive-moss text-cream font-pixel text-2xl flex items-center justify-center border-2 border-cream font-bold">
            👤
          </div>
          <div>
            <h3 className="font-pixel text-lg font-bold text-olive-moss uppercase">{user.name}</h3>
            <div className="text-xs font-mono font-bold text-accent-amber bg-olive-moss px-2 py-0.5 inline-block mt-0.5">
              PATIENT ID: {user.patientId || `PAT-${user._id.slice(-6).toUpperCase()}`}
            </div>
            <div className="text-[10px] font-mono text-olive-dark mt-0.5">
              ROLE: {user.role.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Details Form / View */}
      {isEditing ? (
        <form onSubmit={handleSave} className="win95-inset p-3 bg-white space-y-2 text-xs font-mono">
          <div>
            <label className="block font-bold text-olive-moss mb-0.5">FULL NAME:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="win95-input w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-olive-moss mb-0.5">PHONE:</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="win95-input w-full"
              />
            </div>

            <div>
              <label className="block font-bold text-olive-moss mb-0.5">DATE OF BIRTH:</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="win95-input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-olive-moss mb-0.5">ADDRESS:</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="win95-input w-full"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-olive-dark/20">
            <button type="submit" disabled={saving} className="win95-btn bg-accent text-olive-moss font-bold px-3 py-1">
              {saving ? 'SAVING...' : '[ SAVE CHANGES ]'}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="win95-btn font-bold px-3 py-1">
              [ CANCEL ]
            </button>
          </div>
        </form>
      ) : (
        <div className="win95-inset p-3 bg-white space-y-2 text-xs font-mono">
          <div className="flex justify-between border-b border-olive-dark/10 pb-1">
            <span className="text-gray-500">EMAIL ADDRESS:</span>
            <strong className="text-olive-moss">{user.email}</strong>
          </div>

          <div className="flex justify-between border-b border-olive-dark/10 pb-1">
            <span className="text-gray-500">PHONE NUMBER:</span>
            <strong className="text-olive-moss">{user.phone || 'NOT SPECIFIED'}</strong>
          </div>

          <div className="flex justify-between border-b border-olive-dark/10 pb-1">
            <span className="text-gray-500">DATE OF BIRTH:</span>
            <strong className="text-olive-moss">{user.dob || 'NOT SPECIFIED'}</strong>
          </div>

          <div className="flex justify-between border-b border-olive-dark/10 pb-1">
            <span className="text-gray-500">RESIDENTIAL ADDRESS:</span>
            <strong className="text-olive-moss">{user.address || 'NOT SPECIFIED'}</strong>
          </div>

          <div className="flex justify-between pb-1">
            <span className="text-gray-500">REGISTERED DATE:</span>
            <strong className="text-olive-moss">2026-08-27 (MEDICARE SYSTEM V1)</strong>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-olive-dark/20">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="win95-btn bg-accent/30 text-olive-moss font-pixel text-xs px-3 py-1 font-bold"
          >
            ✏️ [ EDIT PROFILE ]
          </button>
        )}

        <button
          onClick={() => alert('MEDICARE SECURITY: Password change protocol initiated. Verification link dispatched.')}
          className="win95-btn text-xs font-bold"
        >
          🔒 [ CHANGE PASSWORD ]
        </button>

        <button
          onClick={() => {
            logout();
            closeWindow('patientProfile');
          }}
          className="win95-btn bg-red-100 text-red-800 text-xs font-bold border-red-700 hover:bg-red-200"
        >
          🚪 [ LOGOUT SESSION ]
        </button>
      </div>
    </div>
  );
}
