const express = require('express');
const router = express.Router();
const { getPatientById, getAllPatients, updatePatient } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', protect, authorizeRoles('admin', 'doctor'), getAllPatients);
router.get('/:id', protect, getPatientById);
router.put('/:id', protect, updatePatient);

module.exports = router;
