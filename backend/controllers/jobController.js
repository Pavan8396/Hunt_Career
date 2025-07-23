const { escapeRegex } = require('../utils/regexUtils');
const jobService = require('../services/jobService');
const Job = require('../models/jobModel');

const getJobs = async (req, res) => {
  const { search, locations, jobTypes } = req.query;

  try {
    let query = {};
    if (search) {
      const searchLower = search.toLowerCase().trim();
      const escapedSearch = escapeRegex(searchLower); // Escape special characters
      query.$or = [
        { title: { $regex: escapedSearch, $options: 'i' } },
        { company: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
        { candidate_required_location: { $regex: escapedSearch, $options: 'i' } },
        { job_type: { $regex: escapedSearch, $options: 'i' } },
      ];
    }
    if (locations) {
      const locArray = locations.split(';').map(loc => loc.trim());
      query.candidate_required_location = {
        $in: locArray.map(loc => new RegExp(`^${escapeRegex(loc)}$`, 'i')) // Escape location values as well
      };
    }
    if (jobTypes) {
      const typeArray = jobTypes.split(',').map(type => type.trim());
      query.job_type = { $in: typeArray };
    }

    const jobs = await jobService.findAllJobs(query);
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Fetch jobs error:", err.message);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await jobService.findJobById(req.params.id);
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ error: "Job not found" });
    }
  } catch (err) {
    console.error("Fetch job error:", err.message);
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

const createJob = async (req, res) => {
  try {
    const newJob = new Job({
      ...req.body,
      employer: req.user.id, // from token
    });
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, getJobById, createJob, getEmployerJobs };
