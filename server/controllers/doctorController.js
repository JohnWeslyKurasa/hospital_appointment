const Doctor = require('../models/Doctor');
const Department = require('../models/Department');

// @route GET /api/doctors
const getDoctors = async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = {};

    if (department) {
      query.departmentName = new RegExp(department, 'i');
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { specialization: new RegExp(search, 'i') },
        { departmentName: new RegExp(search, 'i') }
      ];
    }

    const doctors = await Doctor.find(query).populate('department');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/doctors/:id
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('department');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor record not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/doctors (Admin only)
const createDoctor = async (req, res) => {
  try {
    const { name, specialization, departmentId, qualifications, experience, consultationFee, availableDays, photoUrl } = req.body;

    const dept = await Department.findById(departmentId);
    if (!dept) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      department: departmentId,
      departmentName: dept.name,
      qualifications: qualifications || 'MD, MBBS',
      experience: experience || '5+ Years',
      consultationFee: consultationFee || 50,
      availableDays: availableDays || ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/doctors/:id
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/doctors/:id (Admin only)
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor record purged successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };
