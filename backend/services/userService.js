const User = require('../models/userModel');
const Application = require('../models/applicationModel');

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

const getUserApplications = async (userId) => {
    return Application.find({
        applicant: userId,
    }).populate({
        path: 'job',
        populate: {
            path: 'employer',
            model: 'Employer',
        },
    });
};

const getAppliedJobs = async (userId) => {
    const applications = await Application.find({ applicant: userId }).populate('job');
    return applications.map(app => app.job).filter(job => job != null);
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserForLogin,
  getUserProfile,
  getUserById,
  getUserApplications,
  getAppliedJobs,
};