const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    icon: {
      type: String,
      default: '🏥'
    },
    description: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: 'Building A, Floor 2'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', departmentSchema);
