const Department = require('../models/Department');

// @route GET /api/departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/departments (Admin)
const createDepartment = async (req, res) => {
  try {
    const { name, code, icon, description, location } = req.body;
    const dept = await Department.create({ name, code, icon, description, location });
    res.status(201).json(dept);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDepartments, createDepartment };
