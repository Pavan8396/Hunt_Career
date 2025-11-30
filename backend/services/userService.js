const User = require('../models/userModel');

const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

const findUserForLogin = async (email) => {
  return User.findOne({ email });
};

const getUserProfile = async (email) => {
  return User.findOne({ email }).select('-password');
};

const getUserById = async (id) => {
  return User.findById(id).select('-password');
};

const updateUserProfile = async (userId, userData) => {
  const user = await User.findById(userId);

  if (!user) {
    return null;
  }

  // Prevent email updates
  if (userData.email && userData.email !== user.email) {
    throw new Error('Email address cannot be changed.');
  }

  // Dynamically update fields that are present in userData
  const fieldsToUpdate = ['firstName', 'lastName', 'phoneNumber', 'workExperience', 'education', 'skills', 'portfolioLinks'];

  fieldsToUpdate.forEach(field => {
    if (userData.hasOwnProperty(field)) {
      user[field] = userData[field];
    }
  });

  const updatedUser = await user.save();
  return updatedUser;
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserForLogin,
  getUserProfile,
  getUserById,
  updateUserProfile,
};
