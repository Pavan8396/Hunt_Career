const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  candidate_required_location: { type: String, required: true },
  job_type: { type: String, required: true },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
}, {
  timestamps: true,
});

jobSchema.index({
  title: 'text',
  company: 'text',
  description: 'text',
  candidate_required_location: 'text',
  job_type: 'text',
});

const Job = mongoose.model('Job', jobSchema, 'Jobs');

module.exports = Job;
