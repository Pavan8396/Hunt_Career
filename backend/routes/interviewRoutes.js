const express = require('express');
const {
  scheduleInterview,
  updateInterviewStatus,
  submitFeedback,
  getInterviewsForApplication,
  updateInterview,
} = require('../controllers/interviewController');
const { ensureDb } = require('../middleware/dbMiddleware');
const {
  authenticateToken,
  isEmployer,
} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/schedule', ensureDb, authenticateToken, isEmployer, scheduleInterview);
router.put('/:interviewId/status', ensureDb, authenticateToken, isEmployer, updateInterviewStatus);
router.put('/:interviewId', ensureDb, authenticateToken, isEmployer, updateInterview);
router.put('/:interviewId/feedback', ensureDb, authenticateToken, isEmployer, submitFeedback);
router.get('/application/:applicationId', ensureDb, authenticateToken, getInterviewsForApplication);

module.exports = router;
