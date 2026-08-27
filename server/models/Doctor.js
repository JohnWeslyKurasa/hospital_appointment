const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    specialization: {
      type: String,
      required: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    },
    departmentName: {
      type: String,
      default: ''
    },
    qualifications: {
      type: String,
      default: 'MD, MBBS'
    },
    experience: {
      type: String,
      default: '5+ Years'
    },
    photoUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
    },
    consultationFee: {
      type: Number,
      default: 50
    },
    availableDays: {
      type: [String],
      default: ['MON', 'TUE', 'WED', 'THU', 'FRI']
    },
    timeSlots: {
      type: [String],
      default: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30']
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ON_LEAVE', 'INACTIVE'],
      default: 'ACTIVE'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
