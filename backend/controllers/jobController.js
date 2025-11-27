const mongoose = require('mongoose');
const Job = require('../models/jobModel');
const Employer = require('../models/employerModel');
const Application = require('../models/applicationModel');
const { escapeRegex } = require('../utils/regexUtils');

const getJobs = async (req, res) => {
  const { search, locations, jobTypes } = req.query;

  try {
    let query = {};
    if (search) {
      const searchLower = search.toLowerCase().trim();
      const escapedSearch = escapeRegex(searchLower);
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
        $in: locArray.map(loc => new RegExp(`^${escapeRegex(loc)}$`, 'i'))
      };
    }
    if (jobTypes) {
      const typeArray = jobTypes.split(',').map(type => type.trim());
      query.job_type = { $in: typeArray };
    }

    const jobs = await Job.find(query);
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Fetch jobs error:", err.message);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

const getJobById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid job ID" });
    }
    const job = await Job.findById(req.params.id);
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
    const { title, company } = req.body;
    const escapedTitle = escapeRegex(title);
    const escapedCompany = escapeRegex(company);

    const existingJob = await Job.findOne({
      title: { $regex: new RegExp(`^${escapedTitle}$`, 'i') },
      company: { $regex: new RegExp(`^${escapedCompany}$`, 'i') },
      employer: req.user._id,
    });

    if (existingJob) {
      return res.status(409).json({ message: 'A job with the same title and company already exists.' });
    }

    const newJob = new Job({
      ...req.body,
      employer: req.user._id,
    });
    const savedJob = await newJob.save();
    const employer = await Employer.findById(req.user._id);
    if (!employer) {
      await Job.findByIdAndDelete(savedJob._id);
      return res.status(404).json({ message: 'Employer not found.' });
    }
    employer.postedJobs.push(savedJob._id);
    await employer.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(400).json({ message: error.message });
  }
};

const getEmployerJobs = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user._id).populate('postedJobs');
    if (!employer) {
      return res.status(404).json({ message: "Employer not found." });
    }
    res.json(employer.postedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJobs = async (req, res) => {
  const { id } = req.params;
  const { jobIds } = req.body;

  try {
    const employer = await Employer.findById(req.user._id);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    let jobsToDelete = [];
    if (id) {
      jobsToDelete.push(id);
    } else if (jobIds) {
      jobsToDelete = [...jobIds];
    } else {
      // Delete all jobs
      await Job.deleteMany({ employer: req.user._id });
      employer.postedJobs = [];
      await employer.save();
      return res.json({ message: 'All jobs have been removed successfully' });
    }

    await Job.deleteMany({ _id: { $in: jobsToDelete }, employer: req.user._id });

    employer.postedJobs = employer.postedJobs.filter(
      (jobId) => !jobsToDelete.includes(jobId.toString())
    );
    await employer.save();

    res.json({ message: 'Selected jobs have been removed successfully' });
  } catch (error) {
    console.error('Error deleting jobs:', error);
    res.status(500).json({ message: 'An error occurred while deleting jobs' });
  }
};

const getApplicationForJob = async (req, res) => {
  //console.log(`[getApplicationForJob] Checking for job: ${req.params.id}, applicant: ${req.user._id}`);
  try {
    const application = await Application.findOne({
      job: req.params.id,
      applicant: req.user._id,
    });
    //console.log(`[getApplicationForJob] Found application:`, application);
    res.json(application);
  } catch (error) {
    console.error('[getApplicationForJob] Error fetching application for job:', error);
    res.status(500).json({ message: 'Failed to fetch application status' });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, company } = req.body;
    const escapedTitle = escapeRegex(title);
    const escapedCompany = escapeRegex(company);
    const existingJob = await Job.findOne({
      title: { $regex: new RegExp(`^${escapedTitle}$`, 'i') },
      company: { $regex: new RegExp(`^${escapedCompany}$`, 'i') },
      employer: req.user._id,
      _id: { $ne: id },
    });

    if (existingJob) {
      return res.status(409).json({ message: 'A job with the same title and company already exists.' });
    }

    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getJobs,
  getJobById,
  createJob,
  getEmployerJobs,
  deleteJobs,
  getApplicationForJob,
  updateJob,
};