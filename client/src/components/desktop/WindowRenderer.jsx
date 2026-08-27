import React from 'react';
import LoginWindow from '../windows/LoginWindow';
import RegisterWindow from '../windows/RegisterWindow';
import DoctorsWindow from '../windows/DoctorsWindow';
import DoctorProfileWindow from '../windows/DoctorProfileWindow';
import BookingWindow from '../windows/BookingWindow';
import ConfirmationDialog from '../windows/ConfirmationDialog';
import MyAppointmentsWindow from '../windows/MyAppointmentsWindow';
import PatientProfileWindow from '../windows/PatientProfileWindow';
import DoctorDeskWindow from '../windows/DoctorDeskWindow';
import AdminWindow from '../windows/AdminWindow';
import DepartmentsWindow from '../windows/DepartmentsWindow';
import RecordsWindow from '../windows/RecordsWindow';
import ContactWindow from '../windows/ContactWindow';
import SearchWindow from '../windows/SearchWindow';

export default function WindowRenderer({ windowData }) {
  const { id } = windowData;

  switch (id) {
    case 'login':
      return <LoginWindow windowData={windowData} />;
    case 'register':
      return <RegisterWindow windowData={windowData} />;
    case 'doctors':
      return <DoctorsWindow windowData={windowData} />;
    case 'doctorProfile':
      return <DoctorProfileWindow windowData={windowData} />;
    case 'booking':
      return <BookingWindow windowData={windowData} />;
    case 'confirmation':
      return <ConfirmationDialog windowData={windowData} />;
    case 'myAppointments':
      return <MyAppointmentsWindow windowData={windowData} />;
    case 'patientProfile':
      return <PatientProfileWindow windowData={windowData} />;
    case 'doctorDesk':
      return <DoctorDeskWindow windowData={windowData} />;
    case 'admin':
      return <AdminWindow windowData={windowData} />;
    case 'departments':
      return <DepartmentsWindow windowData={windowData} />;
    case 'records':
      return <RecordsWindow windowData={windowData} />;
    case 'contact':
      return <ContactWindow windowData={windowData} />;
    case 'search':
      return <SearchWindow windowData={windowData} />;
    default:
      return (
        <div className="win95-inset p-4 font-mono text-xs text-olive-moss">
          ⚠️ PROCESS EXECUTABLE [{id.toUpperCase()}.EXE] NOT RECOGNIZED BY SYSTEM CORE.
        </div>
      );
  }
}
