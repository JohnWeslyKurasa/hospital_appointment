const User = require('../models/User');

// @route GET /api/patients/:id
const getPatientById = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id).select('-password');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/patients (Admin only)
const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/patients/:id
const updatePatient = async (req, res) => {
  try {
    const { name, phone, dob, address, gender } = req.body;
    const patient = await User.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient record not found' });
    }

    if (name) patient.name = name;
    if (phone) patient.phone = phone;
    if (dob) patient.dob = dob;
    if (address) patient.address = address;
    if (gender) patient.gender = gender;

    await patient.save();
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPatientById, getAllPatients, updatePatient };
