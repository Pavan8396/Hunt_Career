const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config/env');
const Employer = require('../models/employerModel');

const getEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user._id).select('-password');
    if (employer) {
      res.json(employer);
    } else {
      res.status(404).json({ message: 'Employer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employer profile' });
  }
};

const updateEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user._id);

    if (employer) {
      // Prevent email updates
      if (req.body.email && req.body.email !== employer.email) {
        return res.status(400).json({ message: 'Email address cannot be changed.' });
      }

      // Update fields if they are present in the request. The `in` operator is used
      // for safety as req.body from multer may not have hasOwnProperty.
      if ('companyName' in req.body) {
        employer.companyName = req.body.companyName;
      }
      if ('companyDescription' in req.body) {
        employer.companyDescription = req.body.companyDescription;
      }
      if ('website' in req.body) {
        employer.website = req.body.website;
      }

      if (req.file) {
        employer.companyLogo = req.file.path;
      }

      const updatedEmployer = await employer.save();

      res.json({
        _id: updatedEmployer._id,
        companyName: updatedEmployer.companyName,
        email: updatedEmployer.email,
        companyDescription: updatedEmployer.companyDescription,
        website: updatedEmployer.website,
        companyLogo: updatedEmployer.companyLogo,
        theme: updatedEmployer.theme,
      });
    } else {
      res.status(404).json({ message: 'Employer not found' });
    }
  } catch (error) {
    console.error('Failed to update employer profile', error);
    res.status(500).json({ message: 'Failed to update employer profile' });
  }
};

const registerEmployer = async (req, res) => {
  const { companyName, email, password } = req.body;

  if (!companyName || !email || !password) {
    return res.status(400).json({ message: "All fields are required: companyName, email, password" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  try {
    const existingEmployer = await Employer.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({ message: "Employer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employer = new Employer({
      companyName,
      email,
      password: hashedPassword,
    });

    await employer.save();

    res.status(201).json({ message: "Employer registered successfully" });
  } catch (err) {
    console.error("Error during employer registration:", err);
    res.status(500).json({ message: "Failed to register employer" });
  }
};

const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');
const Interview = require('../models/interviewModel');

const loginEmployer = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const employer = await Employer.findOne({ email });
    if (employer && await bcrypt.compare(password, employer.password)) {
      if (!employer.isActive) {
        return res.status(403).json({ message: "Your account has been suspended. Please contact support." });
      }
      const token = jwt.sign({ _id: employer._id, email: employer.email, type: 'employer' }, JWT_SECRET, { expiresIn: "1h" });
      res.json({
        token,
        employer: { _id: employer._id, name: employer.companyName, email: employer.email, theme: employer.theme }
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Error during employer login:", err);
    res.status(500).json({ message: "Failed to login" });
  }
};

const getEmployerApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id });
    const jobIds = jobs.map(job => job._id);
    const applications = await Application.find({ job: { $in: jobIds } });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getApplicationsOverTime = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id });
    const jobIds = jobs.map(job => job._id);
    const applications = await Application.find({ job: { $in: jobIds } });
    const data = applications.reduce((acc, app) => {
      const date = new Date(app.date).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    const formattedData = Object.keys(data).map(date => ({ date, count: data[date] }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobPostingsSummary = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id });
    const data = jobs.reduce((acc, job) => {
      if (job.job_type) {
        acc[job.job_type] = (acc[job.job_type] || 0) + 1;
      }
      return acc;
    }, {});
    const formattedData = Object.keys(data).map(type => ({ name: type, count: data[type] }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id });
    const jobIds = jobs.map(job => job._id);
    const applications = await Application.find({ job: { $in: jobIds } })
      .sort({ date: -1 })
      .limit(5)
      .populate('applicant', 'firstName lastName')
      .populate('job', 'title');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployerById = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (employer) {
      res.json({ name: employer.companyName });
    } else {
      res.status(404).json({ message: "Employer not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employer details" });
  }
};

const updateEmployerTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    if (!['light', 'dark'].includes(theme)) {
      return res.status(400).json({ message: 'Invalid theme' });
    }
    const employer = await Employer.findById(req.user._id);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    employer.theme = theme;
    await employer.save();
    res.status(200).json({ message: 'Theme updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update theme' });
  }
};

const getEmployerDashboardMetrics = async (req, res) => {
  try {
    const employerId = req.user._id;
    const jobs = await Job.find({ employer: employerId });
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } });
    const applicationIds = applications.map(app => app._id);

    const interviews = await Interview.find({ application: { $in: applicationIds } });

    // Active Candidates (Not rejected or dropped)
    const activeCandidatesCount = applications.filter(app =>
      !['Rejected', 'Dropped'].includes(app.status)
    ).length;

    // Active Requests (Open jobs)
    const activeRequestsCount = jobs.filter(job => job.status === 'Open').length;

    // Interview Metrics
    const interviewScheduled = interviews.filter(i => i.status === 'Scheduled').length;
    const interviewCompleted = interviews.filter(i => i.status === 'Completed').length;
    const feedbackGiven = interviews.filter(i => i.status === 'Completed' && i.feedback).length;
    const feedbackPending = interviews.filter(i => i.status === 'Completed' && !i.feedback).length;

    // Candidate Stage Summary
    const stageSummary = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    const formattedStageSummary = Object.keys(stageSummary).map(stage => ({
      name: stage,
      value: stageSummary[stage]
    }));

    res.json({
      totalJobs: jobs.length,
      totalApplications: applications.length,
      activeCandidates: activeCandidatesCount,
      activeRequests: activeRequestsCount,
      interviewScheduled,
      interviewCompleted,
      feedbackGiven,
      feedbackPending,
      stageSummary: formattedStageSummary
    });
  } catch (error) {
    console.error('Failed to fetch employer dashboard metrics', error);
    res.status(500).json({ message: 'Failed to fetch dashboard metrics' });
  }
};

module.exports = {
  registerEmployer,
  loginEmployer,
  getEmployerApplications,
  getApplicationsOverTime,
  getJobPostingsSummary,
  getRecentActivity,
  getEmployerById,
  getEmployerProfile,
  updateEmployerProfile,
  updateEmployerTheme,
  getEmployerDashboardMetrics,
};
