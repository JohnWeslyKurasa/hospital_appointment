const express = require('express');
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getBookedSlots
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/booked-slots', getBookedSlots);
router.get('/', protect, getAppointments);
router.post('/', protect, createAppointment);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;
