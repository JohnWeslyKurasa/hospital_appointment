import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { FileText, Lock, Download, Eye, Printer, ShieldCheck } from 'lucide-react';

export default function RecordsWindow() {
  const { user } = useAuth();
  const { openWindow } = useWindowManager();

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900">Medical Records Archive</h3>
          <p className="text-xs text-slate-500 font-medium">Patient clinical history & lab result catalog</p>
        </div>
      </div>

      {!user ? (
        <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm text-slate-800">Secure Archive Access</h4>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">Patient authentication is required to access confidential health records and radiology files.</p>
          <button
            onClick={() => openWindow('login')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            Log In Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Clinical Records for {user.name}</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:bg-blue-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">Lab-Result-2026-A9.pdf</h5>
                    <p className="text-[11px] text-slate-500 font-medium">Blood work & cardiovascular panel</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Downloading File: Lab-Result-2026-A9.pdf')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:bg-blue-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">XRay-Chest-Scan.raw</h5>
                    <p className="text-[11px] text-slate-500 font-medium">Pulmonology radiology imaging</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Opening Image Viewer: XRay-Chest-Scan.raw')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Scan</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:bg-blue-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">Prescription-Med-042.txt</h5>
                    <p className="text-[11px] text-slate-500 font-medium">General medicine Rx pharmacology</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Printing Prescription Receipt')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print Rx</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
