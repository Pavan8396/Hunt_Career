const express = require('express');
const { registerEmployer, loginEmployer, getEmployerApplications, getApplicationsOverTime, getJobPostingsSummary, getRecentActivity, getShortlistedToHiredRatio, getEmployerById } = require('../controllers/employerController');
const { ensureDb } = require('../middleware/dbMiddleware');
const { authenticateToken, isEmployer } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', ensureDb, registerEmployer);
router.post('/login', ensureDb, loginEmployer);
router.get('/applications', ensureDb, authenticateToken, isEmployer, getEmployerApplications);
router.get('/stats/applications-over-time', ensureDb, authenticateToken, isEmployer, getApplicationsOverTime);
router.get('/stats/job-postings-summary', ensureDb, authenticateToken, isEmployer, getJobPostingsSummary);
router.get('/stats/recent-activity', ensureDb, authenticateToken, isEmployer, getRecentActivity);
router.get('/stats/shortlisted-to-hired-ratio', ensureDb, authenticateToken, isEmployer, getShortlistedToHiredRatio);
router.get('/:id', ensureDb, authenticateToken, getEmployerById);

module.exports = router;
