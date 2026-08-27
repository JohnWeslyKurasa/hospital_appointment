const express = require('express');
const router = express.Router();
const { getDepartments, createDepartment } = require('../controllers/departmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', getDepartments);
router.post('/', protect, authorizeRoles('admin'), createDepartment);

module.exports = router;
