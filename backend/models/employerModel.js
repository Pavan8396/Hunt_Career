const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const Employer = sequelize.define('Employer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyLogo: {
    type: DataTypes.STRING,
  },
  companyDescription: {
    type: DataTypes.TEXT,
  },
  website: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  theme: {
    type: DataTypes.ENUM('light', 'dark'),
    defaultValue: 'light',
  },
}, {
  hooks: {
    beforeSave: async (employer) => {
      if (employer.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        employer.password = await bcrypt.hash(employer.password, salt);
      }
    },
  },
  tableName: 'Employers',
  timestamps: true,
});

Employer.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = Employer;
