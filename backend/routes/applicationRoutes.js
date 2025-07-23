const express = require('express');
const { getApplicationsForJob } = require('../controllers/applicationController');
const { authenticateToken, isEmployer } = require('../middleware/authMiddleware');
const { ensureDb } = require('../middleware/dbMiddleware');

const router = express.Router();

router.get('/job/:jobId', ensureDb, authenticateToken, isEmployer, getApplicationsForJob);

module.exports = router;
