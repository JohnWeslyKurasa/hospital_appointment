const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'medicare_secret_key_1998', {
    expiresIn: '30d'
  });
};

// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, dob, gender, phone, address, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: password.trim(),
      dob: dob || '',
      gender: gender || 'Unspecified',
      phone: phone || '',
      address: address || '',
      role: 'patient' // Public registration forced to 'patient'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      patientId: user.patientId,
      dob: user.dob,
      phone: user.phone,
      address: user.address,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const user = await User.findOne({ email: cleanEmail }).populate('doctorProfile');
    
    if (user && (await user.matchPassword(cleanPassword))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        patientId: user.patientId,
        dob: user.dob,
        phone: user.phone,
        address: user.address,
        doctorProfile: user.doctorProfile,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('doctorProfile');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };
