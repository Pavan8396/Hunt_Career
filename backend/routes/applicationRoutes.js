const express = require('express');
const { applyForJob, getApplicationsForJob, shortlistCandidate } = require('../controllers/applicationController');
const { ensureDb } = require('../middleware/dbMiddleware');
const { authenticateToken, isEmployer } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/apply/:jobId', ensureDb, authenticateToken, applyForJob);
router.get('/job/:jobId', ensureDb, authenticateToken, isEmployer, getApplicationsForJob);
router.post('/shortlist/:applicationId', ensureDb, authenticateToken, isEmployer, shortlistCandidate);

module.exports = router;
