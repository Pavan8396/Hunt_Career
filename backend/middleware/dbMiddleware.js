const { getDb } = require('../config/db');

const ensureDb = (req, res, next) => {
  if (!getDb()) {
    return res.status(503).json({ message: "Database connection unavailable" });
  }
  next();
};

module.exports = { ensureDb };
