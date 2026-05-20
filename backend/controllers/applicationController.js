const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');
const User = require('../models/userModel');

exports.applyForJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({
      where: {
        jobId: req.params.jobId,
        applicantId: req.user.id,
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    await Application.create({
      jobId: req.params.jobId,
      applicantId: req.user.id,
    });

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { applicationId } = req.params;

    const application = await Application.findByPk(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.json({ message: `Application status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { jobId: req.params.jobId },
      include: [{
        model: User,
        as: 'applicant',
        attributes: ['firstName', 'lastName', 'email'],
      }]
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
