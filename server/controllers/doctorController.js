const Doctor = require('../models/Doctor');
const Department = require('../models/Department');
const User = require('../models/User');

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
    const { name, email, password, specialization, departmentId, qualifications, experience, consultationFee, availableDays, photoUrl } = req.body;

    if (!name || !specialization || !departmentId) {
      return res.status(400).json({ message: 'Doctor Name, Specialization, and Department are required' });
    }

    const dept = await Department.findById(departmentId);
    if (!dept) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    // Generate or use email/password for doctor login credentials
    const doctorEmail = email && email.trim() !== '' 
      ? email.trim().toLowerCase() 
      : `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@medicare.in`;

    const doctorPassword = password && password.trim() !== '' 
      ? password.trim() 
      : 'doctor123';

    // Check if user already exists
    let user = await User.findOne({ email: doctorEmail });
    if (user) {
      return res.status(400).json({ message: `A user account already exists with email: ${doctorEmail}` });
    }

    // Create User account with role 'doctor' (User model pre-save hook will hash the password)
    user = await User.create({
      name,
      email: doctorEmail,
      password: doctorPassword,
      role: 'doctor'
    });

    // Create Doctor Profile
    const doctor = await Doctor.create({
      name,
      specialization,
      department: departmentId,
      departmentName: dept.name,
      qualifications: qualifications || 'MD, MBBS',
      experience: experience || '5+ Years',
      consultationFee: consultationFee || 50,
      availableDays: availableDays || ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
      user: user._id
    });

    // Link doctor profile back to user
    user.doctorProfile = doctor._id;
    await user.save();

    res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      specialization: doctor.specialization,
      departmentName: doctor.departmentName,
      qualifications: doctor.qualifications,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      photoUrl: doctor.photoUrl,
      credentials: {
        email: doctorEmail,
        password: doctorPassword
      }
    });
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
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (doctor.user) {
      await User.findByIdAndDelete(doctor.user);
    }

    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor profile & login account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };
