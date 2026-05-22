const Interview = require('../models/interviewModel');
const Application = require('../models/applicationModel');

exports.scheduleInterview = async (req, res) => {
  try {
    const { applicationId, scheduledAt, interviewerName, location } = req.body;

    if (!applicationId || !scheduledAt) {
      return res.status(400).json({ message: 'Application ID and schedule time are required' });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const interview = new Interview({
      application: applicationId,
      scheduledAt,
      interviewerName,
      location,
      status: 'Scheduled'
    });

    await interview.save();

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

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.status = status;
    await interview.save();

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.feedback = feedback;
    interview.feedbackSubmittedAt = Date.now();
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
