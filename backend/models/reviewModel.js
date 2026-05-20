const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  employerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Employers',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'Reviews',
  timestamps: true,
});

const Employer = require('./employerModel');
const User = require('./userModel');

Review.belongsTo(Employer, { foreignKey: 'employerId', as: 'employer' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Employer.hasMany(Review, { foreignKey: 'employerId', as: 'reviews' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });

module.exports = Review;
