import React, { useState } from 'react';

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
      alert('MEDICARE HELPDESK: Inquiry dispatched to hospital administration queue.');
    }, 1000);
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="win95-inset p-3 bg-cream flex items-center gap-3 border border-olive-moss/40">
        <div className="text-3xl">📞</div>
        <div>
          <h3 className="font-pixel text-lg font-bold text-olive-moss">CONTACT.EXE</h3>
          <p className="text-xs text-olive-dark">HOSPITAL DISPATCH & HELPDESK TERMINAL</p>
        </div>
      </div>

      <div className="win95-inset p-3 bg-white space-y-2">
        <div className="font-pixel text-sm font-bold text-olive-moss border-b border-olive-dark/20 pb-1">
          🏥 MEDICARE CENTRAL HOSPITAL DIRECTORY
        </div>

        <div className="space-y-1 text-[11px] text-gray-700">
          <div><strong>EMERGENCY HOTLINE:</strong> 1-800-MEDICARE (911 EXT 4)</div>
          <div><strong>LOCATION:</strong> 1998 Y2K Boulevard, Medical District, Sector 7</div>
          <div><strong>AMBULANCE DISPATCH:</strong> Channel 14.22 MHz</div>
          <div><strong>EMAIL HELP:</strong> support@medicare.exe</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="win95-inset p-3 bg-cream space-y-2 border border-olive-moss/30">
        <h4 className="font-pixel text-sm font-bold text-olive-moss uppercase">
          ✉️ DISPATCH INQUIRY MESSAGE
        </h4>

        <div>
          <label className="block font-bold text-olive-moss mb-0.5">SUBJECT / TOPIC:</label>
          <input
            type="text"
            required
            placeholder="e.g. Appointment Reschedule Query"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="win95-input w-full"
          />
        </div>

        <div>
          <label className="block font-bold text-olive-moss mb-0.5">MESSAGE CONTENT:</label>
          <textarea
            rows="3"
            required
            placeholder="Describe your inquiry..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="win95-input w-full"
          />
        </div>

        <button
          type="submit"
          disabled={sent}
          className="win95-btn bg-accent text-olive-moss font-pixel text-xs font-bold px-4 py-1"
        >
          {sent ? 'TRANSMITTING...' : '[ TRANSMIT INQUIRY ]'}
        </button>
      </form>
    </div>
  );
}
