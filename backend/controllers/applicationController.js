const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');
const User = require('../models/userModel');
const { getDb } = require('../config/db');
const notificationService = require('../services/notificationService');
const AuditLog = require('../models/auditLogModel');

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

    // Log the application
    await AuditLog.create({
      application: application._id,
      actionBy: req.user._id,
      actionByModel: 'User',
      action: 'Application Submitted',
      newStatus: 'Submitted',
    });

    // Create notification for employer
    await notificationService.createNotification({
      recipient: job.employer,
      sender: req.user._id,
      senderModel: 'User',
      type: 'NewApplication',
      content: `New application received for ${job.title}`,
      relatedId: job._id, // Use Job ID for navigation
      relatedModel: 'Job',
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

    const application = await Application.findById(applicationId).populate('job');
    const oldStatus = application.status;

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Authorization check: Ensure the user is the employer for this job or an admin
    if (application.job.employer.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this application status' });
    }

    application.status = status;
    await application.save();

    // Log status change
    await AuditLog.create({
      application: application._id,
      actionBy: req.user._id,
      actionByModel: req.user.type === 'employer' ? 'Employer' : 'User',
      action: 'Status Updated',
      oldStatus,
      newStatus: status,
    });

    // Create notification for applicant ONLY if status is 'Offered'
    if (status === 'Offered') {
      await notificationService.createNotification({
        recipient: application.applicant,
        sender: req.user._id,
        senderModel: 'Employer',
        type: 'ApplicationStatusUpdate',
        content: `Your application for ${application.job.title} is now ${status}`,
        relatedId: application._id,
        relatedModel: 'Application',
      });
    }

    res.json({ message: `Application status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId }).populate({
      path: 'applicant',
      select: 'firstName lastName email',
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
