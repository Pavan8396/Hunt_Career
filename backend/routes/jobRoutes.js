const express = require('express');
const {
  getJobs,
  getJobById,
  createJob,
  getEmployerJobs,
  getApplicationForJob,
  updateJob,
  deleteJobs,
  getJobsByEmployerId,
} = require('../controllers/jobController');
const { ensureDb } = require('../middleware/dbMiddleware');
const { authenticateToken, isEmployer, isJobSeeker, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', ensureDb, getJobs);
router.get('/employers', ensureDb, authenticateToken, isEmployer, getEmployerJobs);
router.post('/', ensureDb, authenticateToken, isEmployer, createJob);
router.delete('/delete-all', ensureDb, authenticateToken, isAdmin, deleteJobs);
router.post('/delete-multiple', ensureDb, authenticateToken, isAdmin, deleteJobs);
router.get('/employer/:employerId', ensureDb, authenticateToken, isAdmin, getJobsByEmployerId);
router.get('/:id', ensureDb, getJobById);
router.put('/:id', ensureDb, authenticateToken, isEmployer, updateJob);
router.delete('/:id', ensureDb, authenticateToken, isEmployer, deleteJobs);
router.get('/:id/application', ensureDb, authenticateToken, isJobSeeker, getApplicationForJob);

module.exports = router;
