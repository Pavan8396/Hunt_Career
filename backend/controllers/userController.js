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
    const applications = await Application.find({ applicant: req.user.id });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user applications" });
  }
};

module.exports = { getUserDetails, getUserApplications };
