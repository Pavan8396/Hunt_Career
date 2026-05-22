const Job = require('../models/jobModel');
const Employer = require('../models/employerModel');
const { Op } = require('sequelize');

const findAllJobs = async (filters = {}) => {
  const where = {};
  if (filters.search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${filters.search}%` } },
      { company: { [Op.like]: `%${filters.search}%` } },
      { description: { [Op.like]: `%${filters.search}%` } },
    ];
  }
  // Add other filters as needed (job_type, location, etc.)

  return Job.findAll({
    where,
    include: [{ model: Employer, as: 'employer', attributes: ['id', 'companyName', 'companyLogo'] }]
  });
};

const findJobById = async (jobId) => {
  return Job.findByPk(jobId, {
    include: [{ model: Employer, as: 'employer', attributes: ['id', 'companyName', 'companyLogo'] }]
  });
};

module.exports = {
  findAllJobs,
  findJobById,
};
