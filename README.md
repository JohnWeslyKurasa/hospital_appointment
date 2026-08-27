# MEDICARE.EXE - Windows 95/98 Hospital Appointment System

**MEDICARE.EXE** is a full-stack hospital appointment booking web application created with a nostalgic Windows 95/98 desktop UI and Y2K web design language, built using **React**, **Node.js**, **Express**, **MongoDB Atlas**, and **Tailwind CSS**.

---

## 🎨 Visual Aesthetics & Design

- **Windows 95/98 Desktop Interface**: Floating, draggable interactive windows with retro minimize (`_`), maximize (`□`), and close (`✕`) buttons.
- **Warm Engineering Paper Background**: Cream graph-paper desktop (`#f4f0e6`) with subtle grid lines.
- **Muted Olive Green UI**: Vintage titlebars (`#3d4f41`), warm off-white window bodies (`#f2efea`), and 3D bevel borders.
- **Windows 98 Taskbar & Start Menu**: Muted olive green taskbar with a functional `[ 🪟 START ]` menu, process tabs, and real-time clock.

---

## 🚀 Full-Stack Features

### 👤 Patient Portal
- **`PATIENT LOGIN.EXE` & `NEW PATIENT.EXE`**: Secure registration & login with JWT tokens and bcrypt password hashing.
- **`DOCTORS.EXE`**: Search & filter physicians by name, department, specialization, and availability.
- **`DOCTOR PROFILE.EXE`**: Detailed dossier with credentials, experience, fee, and direct booking button.
- **`APPOINTMENT.EXE`**: Interactive booking flow with department selector, doctor dropdown, date picker, slot grid (`09:00`, `09:30`, `10:00`, etc.), and **Double-Booking Prevention**.
- **`APPOINTMENT CONFIRMED`**: Retro printable ticket dialog displaying appointment ID (e.g. `MC-2026-26178`).
- **`MY APPOINTMENTS.EXE`**: Patient reservation ledger with `UPCOMING`, `COMPLETED`, and `CANCELLED` tabs.

### 🩻 Physician Suite (`DOCTOR DESK.EXE`)
- Visible **ONLY** to authenticated Doctor role users.
- Real-time today's appointment schedule with status updates (`✓ COMPLETE`, `✕ CANCEL`).

### ⚙️ System Administrator (`ADMIN.EXE`)
- Visible **ONLY** to authenticated Admin role users.
- Retro statistics panels (Total Patients, Total Doctors, Today's Appointments, Pending).
- Doctor management (add/remove), department oversight, and master appointment ledger.

---

## 🛠️ Tech Stack & Setup

### Frontend (`/client`)
- React 18 + Vite
- Tailwind CSS v4 + Custom Win95 Bevel CSS
- Axios API client

### Backend (`/server`)
- Node.js + Express.js
- MongoDB Atlas (Cloud Mongoose connection)
- JWT & bcrypt authentication

---

## 💻 Quick Start Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/JohnWeslyKurasa/hosipital_appionment.git
   cd hosipital_appionment
   ```

2. **Start Backend Server**:
   ```bash
   cd server
   npm install
   npm start
   ```

3. **Start Frontend Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. Open `http://localhost:5173/` in your browser!
