const express = require('express');
const { getJobs, getJobById, createJob, getEmployerJobs } = require('../controllers/jobController');
const { ensureDb } = require('../middleware/dbMiddleware');
const { authenticateToken, isEmployer } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', ensureDb, getJobs);
router.get('/employer', ensureDb, authenticateToken, isEmployer, getEmployerJobs);
router.get('/:id', ensureDb, getJobById);
router.post('/', ensureDb, authenticateToken, isEmployer, createJob);

module.exports = router;
