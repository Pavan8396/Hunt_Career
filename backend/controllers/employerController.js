const mongoose = require('mongoose');
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

const Company = require('../models/companyModel');

const registerEmployer = async (req, res) => {
  const { firstName, lastName, companyName, email, password } = req.body;

  if (!firstName || !lastName || !companyName || !email || !password) {
    return res.status(400).json({ message: "All fields are required: firstName, lastName, companyName, email, password" });
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

    // Create Company first
    const company = new Company({
      name: companyName,
      email: email, // Use owner email as company email initially
    });
    await company.save();

    const employer = new Employer({
      firstName,
      lastName,
      companyName,
      company: company._id,
      email,
      password: hashedPassword,
      role: 'Owner'
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
        employer: {
          _id: employer._id,
          name: (employer.firstName && employer.lastName) ? `${employer.firstName} ${employer.lastName}` : employer.companyName,
          companyName: employer.companyName,
          companyId: employer.company,
          role: employer.role,
          email: employer.email,
          theme: employer.theme
        }
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
    const employer = await Employer.findById(req.user._id);
    const jobs = await Job.find({ company: employer.company });
    const jobIds = jobs.map(job => job._id);
    const applications = await Application.find({ job: { $in: jobIds } });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getApplicationsOverTime = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user._id);
    const jobs = await Job.find({ company: employer.company });
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
    const employer = await Employer.findById(req.user._id);
    const jobs = await Job.find({ company: employer.company });
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
    const employer = await Employer.findById(req.user._id);
    const jobs = await Job.find({ company: employer.company });
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
    const employer = await Employer.findById(req.user._id);
    const companyId = employer.company;

    const metrics = await Job.aggregate([
      { $match: { company: companyId } },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'job',
          as: 'applications'
        }
      },
      {
        $facet: {
          jobMetrics: [
            {
              $group: {
                _id: null,
                totalJobs: { $sum: 1 },
                activeRequests: { $sum: { $cond: [{ $eq: ['$status', 'Open'] }, 1, 0] } }
              }
            }
          ],
          applicationMetrics: [
            { $unwind: '$applications' },
            {
              $group: {
                _id: '$applications.status',
                count: { $sum: 1 }
              }
            }
          ],
          interviewMetrics: [
            { $unwind: '$applications' },
            {
              $lookup: {
                from: 'interviews',
                localField: 'applications._id',
                foreignField: 'application',
                as: 'interviews'
              }
            },
            { $unwind: '$interviews' },
            {
              $group: {
                _id: null,
                scheduled: { $sum: { $cond: [{ $eq: ['$interviews.status', 'Scheduled'] }, 1, 0] } },
                completed: { $sum: { $cond: [{ $eq: ['$interviews.status', 'Completed'] }, 1, 0] } },
                feedbackGiven: { $sum: { $cond: [{ $and: [{ $eq: ['$interviews.status', 'Completed'] }, { $ne: ['$interviews.feedback', null] }, { $ne: ['$interviews.feedback', ""] }] }, 1, 0] } },
                feedbackPending: { $sum: { $cond: [{ $and: [{ $eq: ['$interviews.status', 'Completed'] }, { $or: [{ $eq: ['$interviews.feedback', null] }, { $eq: ['$interviews.feedback', ""] }] }] }, 1, 0] } }
              }
            }
          ]
        }
      }
    ]);

    // Fallback for case-sensitive collections if standard ones are empty
    if (metrics[0].jobMetrics.length === 0) {
       const altMetrics = await mongoose.connection.db.collection('Jobs').aggregate([
        { $match: { company: companyId } },
        {
          $lookup: {
            from: 'Applications',
            localField: '_id',
            foreignField: 'job',
            as: 'applications'
          }
        },
        {
          $facet: {
            jobMetrics: [
              {
                $group: {
                  _id: null,
                  totalJobs: { $sum: 1 },
                  activeRequests: { $sum: { $cond: [{ $eq: ['$status', 'Open'] }, 1, 0] } }
                }
              }
            ],
            applicationMetrics: [
              { $unwind: '$applications' },
              {
                $group: {
                  _id: '$applications.status',
                  count: { $sum: 1 }
                }
              }
            ],
            interviewMetrics: [
              { $unwind: '$applications' },
              {
                $lookup: {
                  from: 'Interviews',
                  localField: 'applications._id',
                  foreignField: 'application',
                  as: 'interviews'
                }
              },
              { $unwind: '$interviews' },
              {
                $group: {
                  _id: null,
                  scheduled: { $sum: { $cond: [{ $eq: ['$interviews.status', 'Scheduled'] }, 1, 0] } },
                  completed: { $sum: { $cond: [{ $eq: ['$interviews.status', 'Completed'] }, 1, 0] } },
                  feedbackGiven: { $sum: { $cond: [{ $and: [{ $eq: ['$interviews.status', 'Completed'] }, { $ne: ['$interviews.feedback', null] }, { $ne: ['$interviews.feedback', ""] }] }, 1, 0] } },
                  feedbackPending: { $sum: { $cond: [{ $and: [{ $eq: ['$interviews.status', 'Completed'] }, { $or: [{ $eq: ['$interviews.feedback', null] }, { $eq: ['$interviews.feedback', ""] }] }] }, 1, 0] } }
                }
              }
            ]
          }
        }
      ]).toArray();
      if (altMetrics.length > 0) metrics[0] = altMetrics[0];
    }

    const jobData = metrics[0].jobMetrics[0] || { totalJobs: 0, activeRequests: 0 };
    const appData = metrics[0].applicationMetrics || [];
    const interviewData = metrics[0].interviewMetrics[0] || { scheduled: 0, completed: 0, feedbackGiven: 0, feedbackPending: 0 };

    const totalApplications = appData.reduce((sum, item) => sum + item.count, 0);
    const activeCandidates = appData
      .filter(item => !['Rejected', 'Dropped'].includes(item._id))
      .reduce((sum, item) => sum + item.count, 0);

    const stageSummary = appData.map(item => ({
      name: item._id,
      value: item.count
    }));

    res.json({
      totalJobs: jobData.totalJobs,
      totalApplications,
      activeCandidates,
      activeRequests: jobData.activeRequests,
      interviewScheduled: interviewData.scheduled,
      interviewCompleted: interviewData.completed,
      feedbackGiven: interviewData.feedbackGiven,
      feedbackPending: interviewData.feedbackPending,
      stageSummary
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
