const { getDb } = require('../config/db.js');

const findAllJobs = async (query) => {
  return getDb().collection("Jobs").find(query).toArray();
};

const findJobById = async (jobId) => {
  return getDb().collection("Jobs").findOne({ id: jobId });
};

module.exports = {
  findAllJobs,
  findJobById,
};
