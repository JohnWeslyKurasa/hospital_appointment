import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WindowManagerProvider, useWindowManager, DEFAULT_WINDOWS } from './context/WindowManagerContext';

import Sidebar from './components/dashboard/Sidebar';
import Header from './components/dashboard/Header';
import UserBar from './components/dashboard/UserBar';
import FeatureCard from './components/dashboard/FeatureCard';
import HealthcareBanner from './components/dashboard/HealthcareBanner';

import DoctorsWindow from './components/windows/DoctorsWindow';
import BookingWindow from './components/windows/BookingWindow';
import MyAppointmentsWindow from './components/windows/MyAppointmentsWindow';
import DepartmentsWindow from './components/windows/DepartmentsWindow';
import PatientProfileWindow from './components/windows/PatientProfileWindow';
import ContactWindow from './components/windows/ContactWindow';
import LoginWindow from './components/windows/LoginWindow';
import RegisterWindow from './components/windows/RegisterWindow';
import SearchWindow from './components/windows/SearchWindow';
import DoctorDeskWindow from './components/windows/DoctorDeskWindow';
import AdminWindow from './components/windows/AdminWindow';
import DoctorProfileWindow from './components/windows/DoctorProfileWindow';
import ConfirmationDialog from './components/windows/ConfirmationDialog';
import RecordsWindow from './components/windows/RecordsWindow';

import { 
  Stethoscope, Calendar, FileText, 
  Building2, Users, PhoneCall, ShieldCheck, 
  Activity, ChevronRight, ArrowLeft
} from 'lucide-react';

function DashboardLayout() {
  const { user } = useAuth();
  const { activeView, viewProps, openWindow, closeWindow } = useWindowManager();

  const isDoctor = user?.role === 'doctor';
  const isAdmin = user?.role === 'admin';

  // Six Core Modules Configuration with Pastel Accent System
  const moduleCards = isDoctor
    ? [
        {
          id: 'doctorDesk',
          title: 'DOCTOR WORKSPACE',
          subtitle: 'View today’s appointments & clinical schedule',
          icon: Activity,
          accent: 'indigo',
          windowId: 'doctorDesk',
        },
        {
          id: 'clinicalRecords',
          title: 'CLINICAL RECORDS',
          subtitle: 'Access patient lab results & medical files',
          icon: FileText,
          accent: 'mint',
          windowId: 'medicalRecords',
        },
        {
          id: 'departments',
          title: 'HOSPITAL DEPARTMENTS',
          subtitle: 'Browse hospital departments & units',
          icon: Building2,
          accent: 'violet',
          windowId: 'departments',
        },
        {
          id: 'doctorProfile',
          title: 'PHYSICIAN PROFILE',
          subtitle: 'Manage availability, hours & account settings',
          icon: PhoneCall,
          accent: 'turquoise',
          windowId: 'doctorProfile',
        },
      ]
    : isAdmin
    ? [
        {
          id: 'adminControl',
          title: 'ADMIN CONTROL',
          subtitle: 'Manage system settings & provision accounts',
          icon: ShieldCheck,
          accent: 'indigo',
          windowId: 'admin',
        },
        {
          id: 'doctorAccounts',
          title: 'CREATE DOCTOR',
          subtitle: 'Register & provision new doctor login accounts',
          icon: Stethoscope,
          accent: 'cyan',
          windowId: 'admin',
        },
        {
          id: 'departments',
          title: 'DEPARTMENTS',
          subtitle: 'Configure hospital departments',
          icon: Building2,
          accent: 'violet',
          windowId: 'departments',
        },
        {
          id: 'appointmentsLedger',
          title: 'APPOINTMENTS LEDGER',
          subtitle: 'View overall patient appointment bookings',
          icon: Calendar,
          accent: 'mint',
          windowId: 'myAppointments',
        },
      ]
    : [
        {
          id: 'doctors',
          title: 'DOCTORS',
          subtitle: 'View and manage doctor information',
          icon: Stethoscope,
          accent: 'indigo',
          windowId: 'doctors',
        },
        {
          id: 'appointments',
          title: 'APPOINTMENTS',
          subtitle: 'Schedule and manage appointments',
          icon: Calendar,
          accent: 'cyan',
          windowId: 'booking',
        },
        {
          id: 'records',
          title: 'RECORDS',
          subtitle: 'Access and manage medical records',
          icon: FileText,
          accent: 'mint',
          windowId: 'myAppointments',
        },
        {
          id: 'departments',
          title: 'DEPARTMENTS',
          subtitle: 'Browse hospital departments',
          icon: Building2,
          accent: 'violet',
          windowId: 'departments',
        },
        {
          id: 'patients',
          title: 'PATIENTS',
          subtitle: 'View and manage patient information',
          icon: Users,
          accent: 'coral',
          windowId: 'patientProfile',
        },
        {
          id: 'contact',
          title: 'CONTACT',
          subtitle: 'Get in touch with us',
          icon: PhoneCall,
          accent: 'turquoise',
          windowId: 'contact',
        },
      ];

  const renderActiveView = () => {
    const dummyWindowData = { props: viewProps };

    switch (activeView) {
      case 'doctors':
        return <DoctorsWindow windowData={dummyWindowData} />;
      case 'booking':
        return <BookingWindow windowData={dummyWindowData} />;
      case 'myAppointments':
        return <MyAppointmentsWindow windowData={dummyWindowData} />;
      case 'departments':
        return <DepartmentsWindow windowData={dummyWindowData} />;
      case 'patientProfile':
        return <PatientProfileWindow windowData={dummyWindowData} />;
      case 'contact':
        return <ContactWindow windowData={dummyWindowData} />;
      case 'login':
        return <LoginWindow windowData={dummyWindowData} />;
      case 'register':
        return <RegisterWindow windowData={dummyWindowData} />;
      case 'search':
        return <SearchWindow windowData={dummyWindowData} />;
      case 'doctorDesk':
        return <DoctorDeskWindow windowData={dummyWindowData} />;
      case 'admin':
        return <AdminWindow windowData={dummyWindowData} />;
      case 'doctorProfile':
        return <DoctorProfileWindow windowData={dummyWindowData} />;
      case 'confirmation':
        return <ConfirmationDialog windowData={dummyWindowData} />;
      case 'medicalRecords':
        return <RecordsWindow windowData={dummyWindowData} />;
      default:
        return null;
    }
  };

  const meta = DEFAULT_WINDOWS[activeView] || { title: activeView.toUpperCase() };

  return (
    <div className="min-h-screen w-full flex bg-[#F7F8FC] text-[#172033] relative med-saas-bg selection:bg-[#4F46E5] selection:text-white">
      {/* 1. FIXED LEFT SIDEBAR (270px wide) */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col justify-between px-6 sm:px-10 py-8 max-w-[1400px] mx-auto w-full min-h-screen">
        <div>
          {/* 2. MEDICARE HEADER */}
          <Header />

          {/* 3. CURRENT USER & ACTIONS BAR */}
          <UserBar />

          {/* 4. DYNAMIC CONTENT AREA */}
          {activeView === 'dashboard' ? (
            /* OVERVIEW MODULE CARDS GRID & HEALTHCARE BANNER */
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Six Core Module Cards */}
              <section>
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${moduleCards.length > 4 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-5 sm:gap-6`}>
                  {moduleCards.map((card) => (
                    <FeatureCard
                      key={card.id}
                      title={card.title}
                      subtitle={card.subtitle}
                      icon={card.icon}
                      accentColor={card.accent}
                      onClick={() => openWindow(card.windowId)}
                    />
                  ))}
                </div>
              </section>

              {/* Information Healthcare Banner */}
              <HealthcareBanner />
            </div>
          ) : (
            /* INLINE WEB MODULE VIEW CONTAINER */
            <section className="mb-10 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="bg-white border border-[#E6EAF2] rounded-2xl p-6 sm:p-8 shadow-xs">
                {/* Module View Navigation Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E6EAF2]">
                  <div className="flex items-center gap-2 text-xs text-[#64748B] font-semibold">
                    <button 
                      onClick={() => closeWindow()}
                      className="hover:text-[#4F46E5] transition-colors flex items-center gap-1 font-bold text-[#172033]"
                    >
                      <span>Dashboard</span>
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                    <span className="text-[#4F46E5] font-extrabold uppercase">{meta.title}</span>
                  </div>

                  <button
                    onClick={() => closeWindow()}
                    className="px-3.5 py-2 bg-[#F7F8FC] hover:bg-slate-200/70 text-[#172033] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Dashboard</span>
                  </button>
                </div>

                {/* Render Selected View Component */}
                {renderActiveView()}
              </div>
            </section>
          )}
        </div>

        {/* 5. FOOTER & SYSTEM INFORMATION */}
        <footer className="mt-8 text-center space-y-1.5 py-6 select-none border-t border-[#E6EAF2]">
          <p className="text-[11px] font-mono font-extrabold text-[#64748B] tracking-widest uppercase">
            MEDICARE — CLINICAL COMPUTING SYSTEM
          </p>
          <p className="text-[9px] font-mono font-medium text-[#64748B] uppercase tracking-wide">
            PROPERTY OF MEDICARE CENTRAL HEALTHCARE TRUST • RESPONSIVE
          </p>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WindowManagerProvider>
        <DashboardLayout />
      </WindowManagerProvider>
    </AuthProvider>
  );
}
