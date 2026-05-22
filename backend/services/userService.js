const User = require('../models/userModel');

const findUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

const createUser = async (userData) => {
  return User.create(userData);
};

const findUserForLogin = async (email) => {
  return User.findOne({ where: { email } });
};

const getUserProfile = async (email) => {
  return User.findOne({
    where: { email },
    attributes: { exclude: ['password'] }
  });
};

const getUserById = async (id) => {
  return User.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
};

const updateUserProfile = async (userId, userData) => {
  const user = await User.findByPk(userId);

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

  await user.save();
  return user;
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserForLogin,
  getUserProfile,
  getUserById,
  updateUserProfile,
};
