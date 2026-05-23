const Interview = require('../models/interviewModel');
const Application = require('../models/applicationModel');
const notificationService = require('../services/notificationService');
const AuditLog = require('../models/auditLogModel');

exports.scheduleInterview = async (req, res) => {
  try {
    const { applicationId, scheduledAt, interviewerName, location, round, roundName } = req.body;

    if (!applicationId || !scheduledAt) {
      return res.status(400).json({ message: 'Application ID and schedule time are required' });
    }

    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Authorization check
    if (application.job.employer.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to schedule interview for this application' });
    }

    const interview = new Interview({
      application: applicationId,
      scheduledAt,
      interviewerName,
      location,
      round,
      roundName,
      status: 'Scheduled'
    });

    await interview.save();

    // Log interview scheduling
    await AuditLog.create({
      application: application._id,
      actionBy: req.user._id,
      actionByModel: 'Employer',
      action: 'Interview Scheduled',
      details: `Round ${round}: ${roundName} scheduled for ${new Date(scheduledAt).toLocaleString()}`,
    });

    // Create notification for applicant
    await notificationService.createNotification({
      recipient: application.applicant,
      sender: req.user._id,
      senderModel: 'Employer',
      type: 'InterviewScheduled',
      content: `An interview has been scheduled for ${application.job.title} on ${new Date(scheduledAt).toLocaleString()}`,
      relatedId: interview._id,
      relatedModel: 'Interview',
      jobId: application.job._id,
    });

    // Update application status to Interviewing if it isn't already
    if (application.status !== 'Interviewing') {
      application.status = 'Interviewing';
      await application.save();
    }

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInterviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId).populate({
      path: 'application',
      populate: { path: 'job' }
    });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Authorization check
    if (interview.application.job.employer.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this interview status' });
    }

    interview.status = status;
    await interview.save();

    // No notification for interview status update as per user request (only scheduled and offered)

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId).populate({
      path: 'application',
      populate: { path: 'job' }
    });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Authorization check
    if (interview.application.job.employer.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to submit feedback for this interview' });
    }

    interview.feedback = feedback;
    interview.feedbackSubmittedAt = Date.now();
    // Logic fix: Ensure status is 'Completed' when feedback is submitted
    if (interview.status === 'Scheduled') {
      interview.status = 'Completed';
    }
    await interview.save();

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { scheduledAt, interviewerName, location, round, roundName } = req.body;

    const interview = await Interview.findById(interviewId).populate({
      path: 'application',
      populate: { path: 'job' }
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.application.job.employer.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this interview' });
    }

    if (scheduledAt) interview.scheduledAt = scheduledAt;
    if (interviewerName) interview.interviewerName = interviewerName;
    if (location) interview.location = location;
    if (round) interview.round = round;
    if (roundName) interview.roundName = roundName;

    await interview.save();
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInterviewsForApplication = async (req, res) => {
  try {
    const interviews = await Interview.find({ application: req.params.applicationId });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
