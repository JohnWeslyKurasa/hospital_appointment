const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    appointmentCode: {
      type: String,
      unique: true,
      default: () => 'MC-2026-' + Math.floor(10000 + Math.random() * 90000)
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    patientName: { type: String, required: true },
    patientPhone: { type: String, default: '' },
    patientEmail: { type: String, default: '' },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    doctorName: { type: String, required: true },
    departmentName: { type: String, required: true },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true
    },
    timeSlot: {
      type: String, // Format: HH:MM (e.g. 10:00)
      required: true
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'],
      default: 'CONFIRMED'
    },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
