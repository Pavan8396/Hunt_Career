const { getDb } = require('../config/db.js');
const bcrypt = require('bcryptjs'); // bcrypt is needed for createUser's hashedPassword

const findUserByEmail = async (email) => {
  return getDb().collection("Users").findOne({ email });
};

const createUser = async (userData) => {
  // userData should already contain the hashedPassword
  const result = await getDb().collection("Users").insertOne(userData);
  return getDb().collection("Users").findOne({ _id: result.insertedId });
};

const findUserForLogin = async (email) => {
  return getDb().collection("Users").findOne({ email });
};

const getUserProfile = async (email) => {
  return getDb().collection("Users").findOne({ email: email }, { projection: { password: 0 } });
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserForLogin,
  getUserProfile,
};
