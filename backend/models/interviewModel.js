const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
  feedback: {
    type: String,
  },
  feedbackSubmittedAt: {
    type: Date,
  },
  interviewerName: {
    type: String,
  },
  location: {
    type: String,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Interview', interviewSchema);
