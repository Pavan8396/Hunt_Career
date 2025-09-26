const Job = require('../models/jobModel');
const Employer = require('../models/employerModel');
const Application = require('../models/applicationModel');
const { escapeRegex } = require('../utils/regexUtils');

const searchJobs = async (queryParams) => {
  const { search, locations, jobTypes } = queryParams;
  let query = {};

  if (search) {
    query.$text = { $search: search };
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

  return Job.find(query);
};

const findJobById = async (jobId) => {
  return Job.findById(jobId);
};

const createJob = async (jobData, employerId) => {
  const newJob = new Job({
    ...jobData,
    employer: employerId,
  });
  const savedJob = await newJob.save();

  const employer = await Employer.findById(employerId);
  if (!employer) {
    // Clean up the created job if the employer doesn't exist
    await Job.findByIdAndDelete(savedJob._id);
    throw new Error("Employer not found.");
  }

  employer.postedJobs.push(savedJob._id);
  await employer.save();

  return savedJob;
};

const getJobsByEmployer = async (employerId) => {
    const employer = await Employer.findById(employerId).populate('postedJobs');
    if (!employer) {
        throw new Error("Employer not found.");
    }
    return employer.postedJobs;
};

const deleteJob = async (jobId, employerId) => {
    const job = await Job.findById(jobId);
    if (!job) {
        throw new Error('Job not found');
    }
    if (job.employer.toString() !== employerId) {
        throw new Error('Not authorized');
    }
    await job.deleteOne();
};

const getApplicationForJob = async (jobId, applicantId) => {
    return Application.findOne({
        job: jobId,
        applicant: applicantId,
    });
};

module.exports = {
  searchJobs,
  findJobById,
  createJob,
  getJobsByEmployer,
  deleteJob,
  getApplicationForJob,
};