const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Jobs',
      key: 'id',
    },
  },
  applicantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('Submitted', 'In Review', 'Interviewing', 'Offered', 'Rejected'),
    defaultValue: 'Submitted',
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Applications',
  timestamps: false, // Using 'date' as a custom timestamp
});

const Job = require('./jobModel');
const User = require('./userModel');

Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
Application.belongsTo(User, { foreignKey: 'applicantId', as: 'applicant' });
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });
User.hasMany(Application, { foreignKey: 'applicantId', as: 'applications' });

module.exports = Application;
