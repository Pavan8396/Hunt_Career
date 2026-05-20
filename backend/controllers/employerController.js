const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config/env');
const Employer = require('../models/employerModel');
const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');
const User = require('../models/userModel');
const { Op } = require('sequelize');

const getEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
    });
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
    const employer = await Employer.findByPk(req.user.id);

    if (employer) {
      // Prevent email updates
      if (req.body.email && req.body.email !== employer.email) {
        return res.status(400).json({ message: 'Email address cannot be changed.' });
      }

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

      await employer.save();

      res.json({
        id: employer.id,
        companyName: employer.companyName,
        email: employer.email,
        companyDescription: employer.companyDescription,
        website: employer.website,
        companyLogo: employer.companyLogo,
        theme: employer.theme,
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
    const existingEmployer = await Employer.findOne({ where: { email } });
    if (existingEmployer) {
      return res.status(400).json({ message: "Employer already exists" });
    }

    const employer = await Employer.create({
      companyName,
      email,
      password, // Hashing handled by model hook
    });

    res.status(201).json({ message: "Employer registered successfully" });
  } catch (err) {
    console.error("Error during employer registration:", err);
    res.status(500).json({ message: "Failed to register employer" });
  }
};

const loginEmployer = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const employer = await Employer.findOne({ where: { email } });
    if (employer && await employer.matchPassword(password)) {
      if (!employer.isActive) {
        return res.status(403).json({ message: "Your account has been suspended. Please contact support." });
      }
      const token = jwt.sign({ id: employer.id, email: employer.email, type: 'employer' }, JWT_SECRET, { expiresIn: "1h" });
      res.json({
        token,
        employer: { id: employer.id, name: employer.companyName, email: employer.email, theme: employer.theme }
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
    const applications = await Application.findAll({
      include: [{
        model: Job,
        as: 'job',
        where: { employerId: req.user.id }
      }]
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getApplicationsOverTime = async (req, res) => {
  try {
    const applications = await Application.findAll({
      include: [{
        model: Job,
        as: 'job',
        where: { employerId: req.user.id }
      }]
    });
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
    const jobs = await Job.findAll({ where: { employerId: req.user.id } });
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
    const applications = await Application.findAll({
      limit: 5,
      order: [['date', 'DESC']],
      include: [
        {
          model: Job,
          as: 'job',
          where: { employerId: req.user.id },
          attributes: ['title']
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['firstName', 'lastName']
        }
      ]
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployerById = async (req, res) => {
  try {
    const employer = await Employer.findByPk(req.params.id);
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
    const employer = await Employer.findByPk(req.user.id);
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
};
