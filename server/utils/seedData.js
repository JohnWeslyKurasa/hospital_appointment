const Department = require('../models/Department');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

const seedInitialData = async () => {
  try {
    const deptCount = await Department.countDocuments();
    if (deptCount === 0) {
      console.log('[SEED] Seeding default hospital departments...');
      const depts = await Department.insertMany([
        { name: 'Cardiology', code: 'CARD', icon: '🫀', description: 'Heart and cardiovascular care', location: 'Building A, Floor 2' },
        { name: 'Neurology', code: 'NEUR', icon: '🧠', description: 'Brain, nerve, and spine health', location: 'Building B, Floor 4' },
        { name: 'Orthopedics', code: 'ORTH', icon: '🦴', description: 'Bones, joints, and musculoskeletal care', location: 'Building C, Floor 1' },
        { name: 'Ophthalmology', code: 'OPHT', icon: '👁️', description: 'Eye examinations, vision care & surgery', location: 'Building A, Floor 1' },
        { name: 'Pulmonology', code: 'PULM', icon: '🫁', description: 'Lung and respiratory care', location: 'Building B, Floor 3' },
        { name: 'General Medicine', code: 'GENM', icon: '🩺', description: 'Primary care, checkups and internal medicine', location: 'Building A, Ground Floor' },
        { name: 'Dentistry', code: 'DENT', icon: '🦷', description: 'Dental health, surgery, and oral care', location: 'Building D, Floor 1' },
        { name: 'Pediatrics', code: 'PEDI', icon: '👶', description: 'Comprehensive child healthcare', location: 'Building C, Floor 2' }
      ]);
      console.log(`[SEED] Created ${depts.length} departments.`);
    }

    // Seed default admin
    const adminUser = await User.findOne({ email: 'admin@medicare.exe' });
    if (!adminUser) {
      await User.create({
        name: 'System Administrator',
        email: 'admin@medicare.exe',
        password: 'admin123',
        role: 'admin',
        phone: '1-800-MEDICARE',
        dob: '1985-04-12',
        gender: 'Other',
        address: 'MEDICARE Central HQ, Server Room 01'
      });
      console.log('[SEED] Created default Admin (admin@medicare.exe / admin123)');
    }

    // Seed default test patient
    const testPatient = await User.findOne({ email: 'patient@medicare.exe' });
    let patientObj = testPatient;
    if (!testPatient) {
      patientObj = await User.create({
        name: 'John Doe',
        email: 'patient@medicare.exe',
        password: 'patient123',
        role: 'patient',
        phone: '+91 98765 43210',
        dob: '1990-08-15',
        gender: 'Male',
        address: '42 Retro Way, Y2K City'
      });
      console.log('[SEED] Created default Patient (patient@medicare.exe / patient123)');
    }

    // Seed default doctor account & profiles
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      console.log('[SEED] Seeding default hospital doctors...');
      const cardDept = await Department.findOne({ code: 'CARD' });
      const neurDept = await Department.findOne({ code: 'NEUR' });
      const orthDept = await Department.findOne({ code: 'ORTH' });
      const ophtDept = await Department.findOne({ code: 'OPHT' });
      const pulmDept = await Department.findOne({ code: 'PULM' });
      const genDept = await Department.findOne({ code: 'GENM' });

      // Create Doctor user account for Dr Alex Johnson
      const docUser = await User.create({
        name: 'Dr. Alex Johnson',
        email: 'doctor@medicare.exe',
        password: 'doctor123',
        role: 'doctor',
        phone: '+91 98765 12345',
        dob: '1982-11-20',
        gender: 'Male',
        address: 'Cardiology Dept Office #204'
      });

      const doctorsToInsert = [
        {
          name: 'Dr. Alex Johnson',
          specialization: 'Interventional Cardiology',
          department: cardDept ? cardDept._id : null,
          departmentName: 'Cardiology',
          qualifications: 'MD, FACC, AIIMS Delhi',
          experience: '8 Years',
          consultationFee: 800,
          availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
          timeSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30'],
          photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
          user: docUser._id
        },
        {
          name: 'Dr. Sarah Connor',
          specialization: 'Cognitive Neurology',
          department: neurDept ? neurDept._id : null,
          departmentName: 'Neurology',
          qualifications: 'MD, PhD Neuroscience',
          experience: '12 Years',
          consultationFee: 1000,
          availableDays: ['MON', 'WED', 'FRI'],
          timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
          photoUrl: 'https://images.unsplash.com/photo-1594824813566-78a99479b189?auto=format&fit=crop&q=80&w=300'
        },
        {
          name: 'Dr. Michael Chen',
          specialization: 'Orthopedic Joint Surgery',
          department: orthDept ? orthDept._id : null,
          departmentName: 'Orthopedics',
          qualifications: 'MS Orthopedics, FRCS',
          experience: '10 Years',
          consultationFee: 750,
          availableDays: ['TUE', 'THU', 'SAT'],
          timeSlots: ['09:30', '10:30', '11:30', '14:30', '15:30'],
          photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
        },
        {
          name: 'Dr. Emily Vance',
          specialization: 'Refractive Eye Surgery',
          department: ophtDept ? ophtDept._id : null,
          departmentName: 'Ophthalmology',
          qualifications: 'DO, Ophthalmology Specialist',
          experience: '6 Years',
          consultationFee: 600,
          availableDays: ['MON', 'TUE', 'THU', 'FRI'],
          timeSlots: ['09:00', '09:30', '10:00', '10:30', '11:00'],
          photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
        },
        {
          name: 'Dr. Robert Thorne',
          specialization: 'Pulmonary Care & Respiratory',
          department: pulmDept ? pulmDept._id : null,
          departmentName: 'Pulmonology',
          qualifications: 'MD Pulmonology, FCCP',
          experience: '15 Years',
          consultationFee: 900,
          availableDays: ['MON', 'WED', 'THU'],
          timeSlots: ['10:00', '10:30', '11:00', '14:00', '14:30'],
          photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300'
        },
        {
          name: 'Dr. Lisa Ray',
          specialization: 'Internal Medicine & Preventative',
          department: genDept ? genDept._id : null,
          departmentName: 'General Medicine',
          qualifications: 'MBBS, MD Internal Med',
          experience: '7 Years',
          consultationFee: 500,
          availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
          timeSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00'],
          photoUrl: 'https://images.unsplash.com/photo-1594824813566-78a99479b189?auto=format&fit=crop&q=80&w=300'
        }
      ];

      const insertedDocs = await Doctor.insertMany(doctorsToInsert);
      console.log(`[SEED] Created ${insertedDocs.length} doctor profiles.`);

      // Update Dr Alex Johnson doctor profile ID on docUser
      docUser.doctorProfile = insertedDocs[0]._id;
      await docUser.save();

      // Seed a sample appointment for test patient
      if (patientObj && insertedDocs[0]) {
        await Appointment.create({
          appointmentCode: 'MC-2026-00124',
          patient: patientObj._id,
          patientName: patientObj.name,
          patientPhone: patientObj.phone,
          patientEmail: patientObj.email,
          doctor: insertedDocs[0]._id,
          doctorName: insertedDocs[0].name,
          departmentName: insertedDocs[0].departmentName,
          date: '2026-08-27',
          timeSlot: '10:00',
          status: 'CONFIRMED',
          notes: 'Routine cardiovascular checkup.'
        });
        console.log('[SEED] Created initial sample appointment (MC-2026-00124)');
      }
    }
  } catch (error) {
    console.error(`[SEED ERROR] ${error.message}`);
  }
};

module.exports = seedInitialData;
