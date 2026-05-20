const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  candidate_required_location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  job_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Employers',
      key: 'id',
    },
  },
}, {
  tableName: 'Jobs',
  timestamps: true,
});

// Associations are usually defined in a separate file or at the end of all model definitions
// to avoid circular dependencies. For now, I'll define them here and ensure models are loaded correctly.
const Employer = require('./employerModel');
Job.belongsTo(Employer, { foreignKey: 'employerId', as: 'employer' });
Employer.hasMany(Job, { foreignKey: 'employerId', as: 'postedJobs' });

module.exports = Job;
