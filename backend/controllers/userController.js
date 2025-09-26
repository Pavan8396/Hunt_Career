const userService = require('../services/userService');
const Application = require('../models/applicationModel');

const getUserDetails = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Fetch user error:", err.message);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};

const getUserApplications = async (req, res) => {
  try {
    let applications = await Application.find({
      applicant: req.user._id,
    }).populate({
      path: 'job',
      populate: {
        path: 'employer',
        model: 'Employer',
      },
    });
    res.json(applications);
  } catch (error) {
    console.error('Failed to fetch user applications:', error);
    res.status(500).json({ message: 'Failed to fetch user applications' });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id }).populate('job');
    const appliedJobs = applications.map(app => app.job).filter(job => job != null);
    res.json(appliedJobs);
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    res.status(500).json({ message: 'Failed to fetch applied jobs' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};

module.exports = { getUserDetails, getUserApplications, getAppliedJobs, getUserById };
