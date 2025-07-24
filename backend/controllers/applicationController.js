const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');
const { getDb } = require('../config/db');

exports.applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      job: req.params.jobId,
      applicant: req.user._id,
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.shortlistCandidate = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    application.status = 'shortlisted';
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
