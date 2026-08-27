const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db.js');
const seedInitialData = require('./utils/seedData.js');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const patientRoutes = require('./routes/patientRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// DB Connection & Auto-Seed
connectDB().then((conn) => {
  if (conn) {
    seedInitialData();
  }
});

// Middleware to check DB Connection state before handling requests
app.use((req, res, next) => {
  // If accessing health check or root, continue
  if (req.path === '/' || req.path === '/api/health') return next();

  // If MongoDB is not connected (readyState 1 = connected)
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({
      message: 'DATABASE CONNECTION ERROR: Unable to reach MongoDB Atlas. Please ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.',
      dbState: mongoose.connection.readyState
    });
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    dbConnected: mongoose.connection.readyState === 1,
    dbHost: mongoose.connection.host || 'Disconnected',
    system: 'MEDICARE.EXE v1.0.98',
    timestamp: new Date()
  });
});

app.get('/', (req, res) => {
  res.send('MEDICARE.EXE Hospital Management API Server Running...');
});

// Global Error Handler Middleware to return helpful diagnostic JSON instead of unhandled 500
app.use((err, req, res, next) => {
  console.error('[MEDICARE SERVER ERROR LOG]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    errorStack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  MEDICARE.EXE Hospital System Server Running       `);
  console.log(`  Port: ${PORT}                                    `);
  console.log(`====================================================`);
});
