const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  companyName: { // Deprecated: move to company model
    type: String,
    trim: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  role: {
    type: String,
    enum: ['Owner', 'Recruiter', 'HiringManager'],
    default: 'Owner',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
}, {
  timestamps: true,
});

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;
