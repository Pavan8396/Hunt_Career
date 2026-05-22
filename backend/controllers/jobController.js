const Job = require('../models/jobModel');
const Employer = require('../models/employerModel');
// const Application = require('../models/applicationModel');
const { Op } = require('sequelize');

const getJobs = async (req, res) => {
  const { search, locations, jobTypes } = req.query;

  try {
    let where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { company: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { candidate_required_location: { [Op.like]: `%${search}%` } },
        { job_type: { [Op.like]: `%${search}%` } },
      ];
    }
    if (locations) {
      const locArray = locations.split(';').map(loc => loc.trim());
      where.candidate_required_location = { [Op.in]: locArray };
    }
    if (jobTypes) {
      const typeArray = jobTypes.split(',').map(type => type.trim());
      where.job_type = { [Op.in]: typeArray };
    }

    const jobs = await Job.findAll({ where });
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Fetch jobs error:", err.message);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
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

    const existingJob = await Job.findOne({
      where: {
        title: { [Op.like]: title },
        company: { [Op.like]: company },
        employerId: req.user.id,
      }
    });

    if (existingJob) {
      return res.status(409).json({ message: 'A job with the same title and company already exists.' });
    }

    const newJob = await Job.create({
      ...req.body,
      employerId: req.user.id,
    });

    res.status(201).json(newJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(400).json({ message: error.message });
  }
};

const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({ where: { employerId: req.user.id } });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobsByEmployerId = async (req, res) => {
  try {
    const jobs = await Job.findAll({ where: { employerId: req.params.employerId } });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJobs = async (req, res) => {
  const { id } = req.params;
  const { jobIds } = req.body;

  try {
    if (req.user.isAdmin && id) {
        const job = await Job.findByPk(id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await job.destroy();
        return res.json({ message: 'Job deleted successfully by admin.' });
    }

    let jobsToDelete = [];
    if (id) {
      jobsToDelete.push(id);
    } else if (jobIds) {
      jobsToDelete = [...jobIds];
    } else {
      await Job.destroy({ where: { employerId: req.user.id } });
      return res.json({ message: 'All jobs have been removed successfully' });
    }

    await Job.destroy({
        where: {
            id: { [Op.in]: jobsToDelete },
            employerId: req.user.id
        }
    });

    res.json({ message: 'Selected jobs have been removed successfully' });
  } catch (error) {
    console.error('Error deleting jobs:', error);
    res.status(500).json({ message: 'An error occurred while deleting jobs' });
  }
};

const getApplicationForJob = async (req, res) => {
  // Application model not yet migrated
  res.status(501).json({ message: "Not implemented yet" });
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employerId !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, company } = req.body;
    const existingJob = await Job.findOne({
      where: {
        title: { [Op.like]: title },
        company: { [Op.like]: company },
        employerId: job.employerId,
        id: { [Op.ne]: id },
      }
    });

    if (existingJob) {
      return res.status(409).json({ message: 'A job with the same title and company already exists.' });
    }

    await job.update(req.body);
    res.json(job);
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
  getJobsByEmployerId,
};
