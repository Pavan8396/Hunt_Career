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

  const user = await db.collection("Users").findOne({ email: email });
  if (!user) {
    return null; // Or throw an error
  }

  // Prevent email updates
  if (userData.email && userData.email !== user.email) {
    throw new Error('Email address cannot be changed.');
  }
  delete userData.email; // Ensure email is not in the update set

  // Make sure not to update the _id
  delete userData._id;

  // Prepare the update object, allowing fields to be cleared
  const updateData = {};
  for (const key in userData) {
    if (userData.hasOwnProperty(key)) {
      updateData[key] = userData[key];
    }
  }

  const result = await db.collection("Users").findOneAndUpdate(
    { email: email },
    { $set: updateData },
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
