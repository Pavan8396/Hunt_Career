require('dotenv').config();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "MySuperSecretKey123!@#$%^&*()_+=123";

module.exports = {
  PORT,
  JWT_SECRET,
};
