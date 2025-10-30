const express = require('express');
const {
  getUserDetails,
  getUserApplications,
  getAppliedJobs,
  getUserById,
  updateUserProfile,
  getUserProfile,
} = require('../controllers/userController');
const { authenticateToken, isJobSeeker } = require('../middleware/authMiddleware');
const { ensureDb } = require('../middleware/dbMiddleware');

const router = express.Router();
router.get('/', authenticateToken, ensureDb, getUserDetails);
router.get('/profile', authenticateToken, ensureDb, isJobSeeker, getUserProfile);
router.put('/profile', authenticateToken, ensureDb, isJobSeeker, updateUserProfile);
router.get('/applications', authenticateToken, ensureDb, getUserApplications);
router.get('/applied-jobs', authenticateToken, ensureDb, getAppliedJobs);
router.get('/:id', authenticateToken, ensureDb, getUserById);

module.exports = router;
