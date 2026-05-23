const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    index: true,
  },
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'actionByModel',
    required: true,
  },
  actionByModel: {
    type: String,
    required: true,
    enum: ['User', 'Employer'],
  },
  action: {
    type: String,
    required: true,
  },
  oldStatus: String,
  newStatus: String,
  details: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('AuditLog', auditLogSchema, 'AuditLogs');
