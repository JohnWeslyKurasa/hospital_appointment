import React, { useState } from 'react';
import { PhoneCall, MapPin, Mail, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ContactWindow() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSubject('');
      setMessage('');
      alert('MEDICARE Helpdesk: Inquiry dispatched to hospital administration queue.');
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-3.5 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
          <PhoneCall className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900">Hospital Contact & Helpdesk</h3>
          <p className="text-xs text-slate-500 font-medium">Get in touch with hospital support and emergency dispatch</p>
        </div>
      </div>

      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-xs">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>MEDICARE Central Hospital Directory</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Emergency Hotline</p>
              <p className="font-bold text-slate-800">1-800-MEDICARE</p>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Support Email</p>
              <p className="font-bold text-slate-800">support@medicare.in</p>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl sm:col-span-2 flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Hospital Address</p>
              <p className="font-semibold text-slate-800">1998 Healthcare Boulevard, Central Medical District, Sector 7</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
        <h4 className="font-bold text-slate-800 flex items-center gap-2">
          <Send className="w-4 h-4 text-teal-600" />
          <span>Dispatch Support Inquiry</span>
        </h4>

        <div>
          <label className="block font-semibold text-slate-600 mb-1">Subject / Topic</label>
          <input
            type="text"
            required
            placeholder="e.g., Appointment Reschedule Query"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-600 mb-1">Message Content</label>
          <textarea
            rows="3"
            required
            placeholder="Describe your inquiry..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={sent}
          className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{sent ? 'Transmitting Message...' : 'Transmit Inquiry'}</span>
        </button>
      </form>
    </div>
  );
}
