import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';

export default function RecordsWindow() {
  const { user } = useAuth();
  const { openWindow } = useWindowManager();

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="win95-inset p-3 bg-cream flex items-center gap-3 border border-olive-moss/40">
        <div className="text-3xl">📁</div>
        <div>
          <h3 className="font-pixel text-lg font-bold text-olive-moss">RECORDS.EXE</h3>
          <p className="text-xs text-olive-dark">PATIENT MEDICAL RECORDS ARCHIVE & LAB RESULT CATALOG</p>
        </div>
      </div>

      {!user ? (
        <div className="win95-inset p-6 text-center font-mono text-xs text-olive-moss bg-cream">
          ⚠️ SECURE ARCHIVE: PATIENT AUTHENTICATION REQUIRED.
          <div className="mt-3">
            <button onClick={() => openWindow('login')} className="win95-btn font-pixel text-xs font-bold px-3 py-1">
              [ LOGIN ]
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="win95-inset p-3 bg-white space-y-2">
            <div className="font-pixel text-sm font-bold text-olive-moss border-b border-olive-dark/20 pb-1">
              📜 RECENT CLINICAL ARCHIVES FOR {user.name.toUpperCase()}
            </div>

            <div className="space-y-2">
              <div className="win95-box p-2 border border-olive-moss bg-cream flex justify-between items-center">
                <div>
                  <strong className="text-olive-moss font-pixel">LAB-RESULT-2026-A9.PDF</strong>
                  <div className="text-[10px] text-gray-500">BLOOD WORK & CARDIOVASCULAR PANEL</div>
                </div>
                <button onClick={() => alert('DOWNLOADING FILE: LAB-RESULT-2026-A9.PDF')} className="win95-btn text-[10px] font-bold">
                  💾 DOWNLOAD
                </button>
              </div>

              <div className="win95-box p-2 border border-olive-moss bg-cream flex justify-between items-center">
                <div>
                  <strong className="text-olive-moss font-pixel">XRAY-CHEST-SCAN.RAW</strong>
                  <div className="text-[10px] text-gray-500">PULMONOLOGY RADIOLOGY IMAGING</div>
                </div>
                <button onClick={() => alert('OPENING IMAGE VIEWER: XRAY-CHEST-SCAN.RAW')} className="win95-btn text-[10px] font-bold">
                  👁️ VIEW SCAN
                </button>
              </div>

              <div className="win95-box p-2 border border-olive-moss bg-cream flex justify-between items-center">
                <div>
                  <strong className="text-olive-moss font-pixel">PRESCRIPTION-MED-042.TXT</strong>
                  <div className="text-[10px] text-gray-500">GENERAL MEDICINE RX PHARMACOLOGY</div>
                </div>
                <button onClick={() => alert('PRINTING PRESCRIPTION RECEIPT')} className="win95-btn text-[10px] font-bold">
                  🖨️ PRINT RX
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
