import React, { createContext, useContext, useState } from 'react';

const WindowManagerContext = createContext(null);

export const DEFAULT_WINDOWS = {
  login: { id: 'login', title: 'PATIENT LOGIN.EXE', icon: '🔑', defaultWidth: 420, defaultHeight: 480 },
  register: { id: 'register', title: 'NEW PATIENT.EXE', icon: '📝', defaultWidth: 500, defaultHeight: 560 },
  doctors: { id: 'doctors', title: 'DOCTORS.EXE', icon: '👨‍⚕️', defaultWidth: 720, defaultHeight: 580 },
  doctorProfile: { id: 'doctorProfile', title: 'DOCTOR PROFILE.EXE', icon: '🩺', defaultWidth: 560, defaultHeight: 520 },
  booking: { id: 'booking', title: 'APPOINTMENT.EXE', icon: '📅', defaultWidth: 640, defaultHeight: 600 },
  myAppointments: { id: 'myAppointments', title: 'MY APPOINTMENTS.EXE', icon: '📋', defaultWidth: 700, defaultHeight: 540 },
  patientProfile: { id: 'patientProfile', title: 'PATIENT PROFILE.EXE', icon: '👤', defaultWidth: 480, defaultHeight: 520 },
  doctorDesk: { id: 'doctorDesk', title: 'DOCTOR DESK.EXE', icon: '🩻', defaultWidth: 800, defaultHeight: 600 },
  admin: { id: 'admin', title: 'ADMIN.EXE', icon: '⚙️', defaultWidth: 840, defaultHeight: 620 },
  departments: { id: 'departments', title: 'DEPARTMENTS.EXE', icon: '💊', defaultWidth: 720, defaultHeight: 540 },
  records: { id: 'records', title: 'RECORDS.EXE', icon: '📁', defaultWidth: 680, defaultHeight: 520 },
  contact: { id: 'contact', title: 'CONTACT.EXE', icon: '📞', defaultWidth: 460, defaultHeight: 440 },
  search: { id: 'search', title: 'SEARCH MEDICARE', icon: '🔍', defaultWidth: 580, defaultHeight: 480 },
  confirmation: { id: 'confirmation', title: 'APPOINTMENT CONFIRMED', icon: '✅', defaultWidth: 460, defaultHeight: 420 }
};

export const WindowManagerProvider = ({ children }) => {
  // Array of open window instances
  const [openWindows, setOpenWindows] = useState([
    { id: 'doctors', zIndex: 10, isMinimized: false, isMaximized: false, props: {} }
  ]);
  const [activeWindowId, setActiveWindowId] = useState('doctors');
  const [highestZ, setHighestZ] = useState(20);

  const openWindow = (windowId, extraProps = {}) => {
    const meta = DEFAULT_WINDOWS[windowId] || { id: windowId, title: `${windowId.toUpperCase()}.EXE`, icon: '🖥️' };
    
    setOpenWindows((prev) => {
      const existing = prev.find((w) => w.id === windowId);
      const nextZ = highestZ + 1;
      setHighestZ(nextZ);
      setActiveWindowId(windowId);

      if (existing) {
        return prev.map((w) =>
          w.id === windowId
            ? { ...w, isMinimized: false, zIndex: nextZ, props: { ...w.props, ...extraProps } }
            : w
        );
      } else {
        return [
          ...prev,
          {
            id: windowId,
            meta,
            zIndex: nextZ,
            isMinimized: false,
            isMaximized: false,
            props: extraProps
          }
        ];
      }
    });
  };

  const closeWindow = (windowId) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== windowId));
  };

  const minimizeWindow = (windowId) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w))
    );
  };

  const toggleMaximizeWindow = (windowId) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const focusWindow = (windowId) => {
    const nextZ = highestZ + 1;
    setHighestZ(nextZ);
    setActiveWindowId(windowId);
    setOpenWindows((prev) =>
      prev.map((w) =>
        w.id === windowId ? { ...w, zIndex: nextZ, isMinimized: false } : w
      )
    );
  };

  return (
    <WindowManagerContext.Provider
      value={{
        openWindows,
        activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        toggleMaximizeWindow,
        focusWindow
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => useContext(WindowManagerContext);
