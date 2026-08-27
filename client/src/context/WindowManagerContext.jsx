import React, { createContext, useContext, useState } from 'react';
import { 
  KeyRound, UserPlus, Stethoscope, UserCheck, Calendar, 
  CalendarCheck, User, Activity, ShieldCheck, Building2, 
  FileText, PhoneCall, Search, CheckCircle2, Monitor
} from 'lucide-react';

const WindowManagerContext = createContext(null);

export const DEFAULT_WINDOWS = {
  dashboard: { id: 'dashboard', title: 'DASHBOARD OVERVIEW', icon: Monitor },
  login: { id: 'login', title: 'PATIENT LOGIN', icon: KeyRound },
  register: { id: 'register', title: 'NEW PATIENT REGISTRATION', icon: UserPlus },
  doctors: { id: 'doctors', title: 'DOCTORS DIRECTORY', icon: Stethoscope },
  doctorProfile: { id: 'doctorProfile', title: 'DOCTOR PROFILE', icon: UserCheck },
  booking: { id: 'booking', title: 'APPOINTMENT BOOKING', icon: Calendar },
  myAppointments: { id: 'myAppointments', title: 'MY APPOINTMENTS', icon: CalendarCheck },
  patientProfile: { id: 'patientProfile', title: 'PATIENT PROFILE', icon: User },
  doctorDesk: { id: 'doctorDesk', title: 'DOCTOR DESK', icon: Activity },
  admin: { id: 'admin', title: 'ADMINISTRATION PANEL', icon: ShieldCheck },
  departments: { id: 'departments', title: 'HOSPITAL DEPARTMENTS', icon: Building2 },
  records: { id: 'records', title: 'MEDICAL RECORDS', icon: FileText },
  contact: { id: 'contact', title: 'CONTACT MEDICARE', icon: PhoneCall },
  search: { id: 'search', title: 'SEARCH MEDICARE', icon: Search },
  confirmation: { id: 'confirmation', title: 'APPOINTMENT CONFIRMED', icon: CheckCircle2 }
};

export const WindowManagerProvider = ({ children }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [viewProps, setViewProps] = useState({});

  const openWindow = (viewId, extraProps = {}) => {
    setActiveView(viewId || 'dashboard');
    setViewProps(extraProps || {});
  };

  const closeWindow = () => {
    setActiveView('dashboard');
    setViewProps({});
  };

  return (
    <WindowManagerContext.Provider
      value={{
        activeView,
        viewProps,
        openWindow,
        closeWindow,
        setActiveView,
        setViewProps
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => useContext(WindowManagerContext);
