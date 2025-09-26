const mongoose = require('mongoose');
const jobService = require('../services/jobService');

const getJobs = async (req, res) => {
  try {
    const jobs = await jobService.searchJobs(req.query);
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

const getJobById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid job ID" });
    }
    const job = await jobService.findJobById(req.params.id);
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ error: "Job not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

const createJob = async (req, res) => {
  try {
    const savedJob = await jobService.createJob(req.body, req.user._id);
    res.status(201).json(savedJob);
  } catch (error) {
    if (error.message === "Employer not found.") {
        return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

const getEmployerJobs = async (req, res) => {
  try {
    const employerJobs = await jobService.getJobsByEmployer(req.user._id);
    res.json(employerJobs);
  } catch (error) {
    if (error.message === "Employer not found.") {
        return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    await jobService.deleteJob(req.params.id, req.user._id);
    res.json({ message: 'Job removed' });
  } catch (error) {
    if (error.message === 'Job not found') {
        return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Not authorized') {
        return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const getApplicationForJob = async (req, res) => {
  try {
    const application = await jobService.getApplicationForJob(req.params.id, req.user._id);
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch application status' });
  }
};

module.exports = { getJobs, getJobById, createJob, getEmployerJobs, deleteJob, getApplicationForJob };