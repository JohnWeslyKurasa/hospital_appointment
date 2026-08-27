const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
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

// Initialize DB and Seed
connectDB().then(() => {
  seedInitialData();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', system: 'MEDICARE.EXE v1.0.98', timestamp: new Date() });
});

// Root API handler
app.get('/', (req, res) => {
  res.send('MEDICARE.EXE Hospital Management API Server Running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  MEDICARE.EXE Hospital System Server Running       `);
  console.log(`  Port: ${PORT}                                    `);
  console.log(`  Environment: Windows 98 / Node ${process.version} `);
  console.log(`====================================================`);
});
