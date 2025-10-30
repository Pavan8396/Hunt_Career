const express = require('express');
const {
  applyForJob,
  getApplicationsForJob,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { ensureDb } = require('../middleware/dbMiddleware');
const {
  authenticateToken,
  isEmployer,
} = require('../middleware/authMiddleware');

const router = express.Router();

// Route for a user to apply for a job
router.post('/apply/:jobId', ensureDb, authenticateToken, applyForJob);

// Route for an employer to get all applications for a specific job
router.get(
  '/job/:jobId',
  ensureDb,
  authenticateToken,
  isEmployer,
  getApplicationsForJob
);

// Route for an employer to update the status of an application
router.put(
  '/:applicationId/status',
  ensureDb,
  authenticateToken,
  isEmployer,
  updateApplicationStatus
);

module.exports = router;
