const express = require('express');
const { getUserDetails, getUserApplications, getAppliedJobs, getUserById } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { ensureDb } = require('../middleware/dbMiddleware');

const router = express.Router();

router.get('/', authenticateToken, ensureDb, getUserDetails);
router.get('/applications', authenticateToken, ensureDb, getUserApplications);
router.get('/applied-jobs', authenticateToken, ensureDb, getAppliedJobs);
router.get('/:userId', authenticateToken, ensureDb, getUserById);

module.exports = router;
