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
  const db = getDb();
  let user = await db.collection("Users").findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
  if (user) {
    // It's a job seeker, return the user object which has firstName and lastName
    return user;
  }
  // If not found in Users, check Employers collection
  const employer = await db.collection("employers").findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
  if (employer) {
    // It's an employer, return an object with a 'name' field to match the user object structure
    return { ...employer, name: employer.companyName };
  }
  return null; // Return null if not found in either collection
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserForLogin,
  getUserProfile,
  getUserById,
};
