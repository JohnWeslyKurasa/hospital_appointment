const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/', protect, authorizeRoles('admin'), createDoctor);
router.put('/:id', protect, authorizeRoles('admin', 'doctor'), updateDoctor);
router.delete('/:id', protect, authorizeRoles('admin'), deleteDoctor);

module.exports = router;
