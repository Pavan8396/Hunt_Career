const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false, // Set to console.log to see SQL queries
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // console.log('SQLite connection has been established successfully.');

    // Sync models
    // In production, you might want to use migrations
    await sequelize.sync({ force: false });
  } catch (error) {
    console.error('Unable to connect to the SQLite database:', error);
    throw error;
  }
};

module.exports = { sequelize, connectDB };
