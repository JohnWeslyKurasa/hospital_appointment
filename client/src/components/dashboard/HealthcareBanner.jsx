import React from 'react';
import { Shield, Activity, Heart, Sparkles } from 'lucide-react';

export default function HealthcareBanner() {
  return (
    <div className="relative overflow-hidden w-full bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-indigo-700/50 mb-10 select-none">
      {/* Background Vector Graphic Illustrations (Shield, Cross, ECG, Abstract Circles) */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none hidden md:block">
        <svg viewBox="0 0 400 200" fill="none" className="w-full h-full text-indigo-300">
          {/* Abstract background circles */}
          <circle cx="300" cy="100" r="80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="300" cy="100" r="120" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          
          {/* Healthcare Cross */}
          <path d="M290 70 h20 v20 h20 v20 h-20 v20 h-20 v-20 h-20 v-20 h20 z" fill="currentColor" opacity="0.2" />

          {/* ECG Waveform */}
          <path d="M150 100 L 220 100 L 235 60 L 250 140 L 265 80 L 280 110 L 290 100 L 380 100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-[11px] font-bold text-indigo-200 uppercase tracking-wider backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
          <span>MEDICARE HEALTHCARE SAAS PLATFORM</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          BETTER CARE. SMARTER SYSTEM.
        </h2>

        <p className="text-xs sm:text-sm text-indigo-100/90 font-medium leading-relaxed max-w-xl">
          Streamline hospital operations and enhance patient experience with Medicare Hospital Management System.
        </p>

        {/* Feature Highlights */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-indigo-200">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Records</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Real-time Telemetry</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Patient-Centric Workflow</span>
          </div>
        </div>
      </div>
    </div>
  );
}
