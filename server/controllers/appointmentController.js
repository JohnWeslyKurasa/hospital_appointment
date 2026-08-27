const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @route GET /api/appointments
const getAppointments = async (req, res) => {
  try {
    let query = {};

    // Patient sees only their appointments
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    }
    // Doctor sees appointments for their doctor profile
    else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (doctor) {
        query.doctor = doctor._id;
      } else {
        // Find by name match if user profile isn't linked
        query.doctorName = new RegExp(req.user.name, 'i');
      }
    }
    // Admin sees all appointments

    const appointments = await Appointment.find(query)
      .populate('doctor')
      .populate('patient', 'name email phone patientId')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/appointments
const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, notes } = req.body;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: 'Doctor ID, Date, and Time Slot are required.' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // CHECK FOR DOUBLE-BOOKING PREVENTATIVE RULE
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: date,
      timeSlot: timeSlot,
      status: { $ne: 'CANCELLED' }
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: `SLOT CONFLIC: Dr. ${doctor.name} is already booked on ${date} at ${timeSlot}. Please select another slot.`
      });
    }

    const patient = await User.findById(req.user._id);

    const appointment = await Appointment.create({
      patient: req.user._id,
      patientName: patient ? patient.name : req.user.name,
      patientPhone: patient ? patient.phone : '',
      patientEmail: patient ? patient.email : '',
      doctor: doctorId,
      doctorName: doctor.name,
      departmentName: doctor.departmentName || 'General',
      date,
      timeSlot,
      notes: notes || '',
      status: 'CONFIRMED'
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/appointments/:id
const updateAppointment = async (req, res) => {
  try {
    const { status, notes, date, timeSlot } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    if (date) appointment.date = date;
    if (timeSlot) appointment.timeSlot = timeSlot;

    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/appointments/:id
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    appointment.status = 'CANCELLED';
    await appointment.save();
    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/appointments/booked-slots
const getBookedSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ message: 'doctorId and date query parameters required' });
    }

    const appointments = await Appointment.find({
      doctor: doctorId,
      date: date,
      status: { $ne: 'CANCELLED' }
    });

    const bookedSlots = appointments.map((app) => app.timeSlot);
    res.json({ doctorId, date, bookedSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getBookedSlots
};
