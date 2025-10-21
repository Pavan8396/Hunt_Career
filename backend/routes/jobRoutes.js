const express = require('express');
const {
  getJobs,
  getJobById,
  createJob,
  getEmployerJobs,
  deleteJob,
  getApplicationForJob,
  updateJob,
  deleteAllJobs,
  deleteMultipleJobs,
} = require('../controllers/jobController');
const { ensureDb } = require('../middleware/dbMiddleware');
const { authenticateToken, isEmployer, isJobSeeker } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', ensureDb, getJobs);
router.get('/employer', ensureDb, authenticateToken, isEmployer, getEmployerJobs);
router.post('/', ensureDb, authenticateToken, isEmployer, createJob);
router.delete('/delete-all', ensureDb, authenticateToken, isEmployer, deleteAllJobs);
router.post('/delete-multiple', ensureDb, authenticateToken, isEmployer, deleteMultipleJobs);
router.get('/:id', ensureDb, getJobById);
router.put('/:id', ensureDb, authenticateToken, isEmployer, updateJob);
router.delete('/:id', ensureDb, authenticateToken, isEmployer, deleteJob);
router.get('/:id/application', ensureDb, authenticateToken, isJobSeeker, getApplicationForJob);

module.exports = router;
