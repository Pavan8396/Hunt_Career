const Chat = require('../models/chatModel');

const getApplicationsForJob = async (req, res) => {
  try {
    const applications = await Chat.find({ job: req.params.jobId, isShortlisted: false })
      .populate('jobSeeker', 'name email');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getApplicationsForJob };
