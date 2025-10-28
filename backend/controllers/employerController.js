const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config/env');
const Employer = require('../models/employerModel');

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

const loginEmployer = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const employer = await Employer.findOne({ email });
    if (employer && await bcrypt.compare(password, employer.password)) {
      const token = jwt.sign({ _id: employer._id, email: employer.email, type: 'employer' }, JWT_SECRET, { expiresIn: "1h" });
      res.json({
        token,
        employer: { _id: employer._id, name: employer.companyName, email: employer.email }
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

module.exports = { registerEmployer, loginEmployer, getEmployerApplications, getApplicationsOverTime, getJobPostingsSummary, getRecentActivity, getEmployerById };
