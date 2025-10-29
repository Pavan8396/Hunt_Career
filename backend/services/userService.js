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

const getUserById = async (id) => {
  const { ObjectId } = require('mongodb');
  return getDb().collection("Users").findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
};

const updateUserProfile = async (email, userData) => {
  const { ObjectId } = require('mongodb');
  const db = getDb();

  // Make sure not to update the _id
  delete userData._id;

  const result = await db.collection("Users").findOneAndUpdate(
    { email: email },
    { $set: userData },
    { returnDocument: 'after', projection: { password: 0 } }
  );

  return result.value;
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserForLogin,
  getUserProfile,
  getUserById,
  updateUserProfile,
};
