const userService = require('../services/userService');

const getUserDetails = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const applications = await userService.getUserApplications(req.user._id);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user applications' });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const appliedJobs = await userService.getAppliedJobs(req.user._id);
    res.json(appliedJobs);
  } catch (error) {
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