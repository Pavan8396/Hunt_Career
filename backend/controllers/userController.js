const User = require('../models/userModel');
const userService = require('../services/userService');
const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');

const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.savedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch saved jobs' });
  }
};

const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }
    res.status(200).json({ message: 'Job saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save job' });
  }
};

const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.savedJobs.pull(jobId);
    await user.save();
    res.status(200).json({ message: 'Job unsaved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unsave job' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    // Admins can update any user by ID, otherwise users can only update their own profile.
    const targetUserId = (req.user.isAdmin && req.params.id) ? req.params.id : req.user._id;

    if (!targetUserId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    const updatedUser = await userService.updateUserProfile(targetUserId, req.body);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    // It's helpful to log the actual error on the server
    console.error("Update user profile error:", error);
    res.status(500).json({ message: error.message || 'Failed to update user profile' });
  }
};

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

const updateUserTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    if (!['light', 'dark'].includes(theme)) {
      return res.status(400).json({ message: 'Invalid theme' });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.theme = theme;
    await user.save();
    res.status(200).json({ message: 'Theme updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update theme' });
  }
};

module.exports = {
  getUserDetails,
  getUserApplications,
  getAppliedJobs,
  getUserById,
  getUserProfile,
  updateUserProfile,
  getSavedJobs,
  saveJob,
  unsaveJob,
  updateUserTheme,
};
