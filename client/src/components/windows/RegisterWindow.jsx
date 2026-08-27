import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';

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
    <div className="space-y-3">
      <div className="win95-inset p-2.5 bg-cream flex items-center gap-3 border border-olive-moss/30">
        <div className="text-3xl">📝</div>
        <div>
          <h3 className="font-pixel text-lg font-bold text-olive-moss">NEW PATIENT.EXE</h3>
          <p className="text-xs text-olive-dark font-mono">PATIENT REGISTRATION FORM & MEDICAL RECORD INITIALIZATION</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-700 text-red-800 p-2 text-xs font-mono font-bold">
          ⚠️ REGISTRATION ERROR: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block font-bold text-olive-moss mb-0.5">FULL NAME:</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Jane Smith"
              value={formData.name}
              onChange={handleChange}
              className="win95-input w-full"
            />
          </div>

          <div>
            <label className="block font-bold text-olive-moss mb-0.5">EMAIL ADDRESS:</label>
            <input
              type="email"
              name="email"
              required
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
              className="win95-input w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block font-bold text-olive-moss mb-0.5">DATE OF BIRTH:</label>
            <input
              type="date"
              name="dob"
              required
              value={formData.dob}
              onChange={handleChange}
              className="win95-input w-full"
            />
          </div>

          <div>
            <label className="block font-bold text-olive-moss mb-0.5">GENDER:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="win95-input w-full"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-olive-moss mb-0.5">PHONE NUMBER:</label>
            <input
              type="text"
              name="phone"
              placeholder="+1 555-0199"
              value={formData.phone}
              onChange={handleChange}
              className="win95-input w-full"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-olive-moss mb-0.5">RESIDENTIAL ADDRESS:</label>
          <input
            type="text"
            name="address"
            placeholder="123 Y2K Blvd, Suite 4B"
            value={formData.address}
            onChange={handleChange}
            className="win95-input w-full"
          />
        </div>

        <div>
          <label className="block font-bold text-olive-moss mb-0.5">PASSWORD:</label>
          <input
            type="password"
            name="password"
            required
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            className="win95-input w-full"
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-olive-dark/20">
          <button
            type="button"
            onClick={() => {
              closeWindow('register');
              openWindow('login');
            }}
            className="win95-btn text-xs"
          >
            [ ALREADY REGISTERED? LOGIN ]
          </button>

          <button
            type="submit"
            disabled={loading}
            className="win95-btn bg-accent/40 text-olive-moss font-pixel text-sm px-4 py-1 font-bold"
          >
            {loading ? 'REGISTERING...' : '[ REGISTER PATIENT ]'}
          </button>
        </div>
      </form>
    </div>
  );
}
