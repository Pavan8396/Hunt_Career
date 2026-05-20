const { sequelize } = require('../config/db');

const ensureDb = (req, res, next) => {
  if (!sequelize) {
    return res.status(503).json({ message: "Database connection unavailable" });
  }
  next();
};

module.exports = { ensureDb };
