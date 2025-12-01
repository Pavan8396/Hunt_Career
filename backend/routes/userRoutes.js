const express = require('express');
const {
  getUserDetails,
  getUserApplications,
  getAppliedJobs,
  getUserById,
  updateUserProfile,
  getUserProfile,
  getSavedJobs,
  saveJob,
  unsaveJob,
} = require('../controllers/userController');
const { authenticateToken, isJobSeeker } = require('../middleware/authMiddleware');
const { ensureDb } = require('../middleware/dbMiddleware');

const router = express.Router();
router.get('/', authenticateToken, ensureDb, getUserDetails);
router.get('/profile', authenticateToken, ensureDb, isJobSeeker, getUserProfile);
// Route for admin to update any user's profile
router.put('/profile/:id', authenticateToken, ensureDb, updateUserProfile);
// Route for a user to update their own profile
router.put('/profile', authenticateToken, ensureDb, isJobSeeker, updateUserProfile);
router.get('/applications', authenticateToken, ensureDb, getUserApplications);
router.get('/applied-jobs', authenticateToken, ensureDb, getAppliedJobs);

// Saved Jobs
router.get('/saved-jobs', authenticateToken, ensureDb, isJobSeeker, getSavedJobs);
router.post('/saved-jobs/:jobId', authenticateToken, ensureDb, isJobSeeker, saveJob);
router.delete('/saved-jobs/:jobId', authenticateToken, ensureDb, isJobSeeker, unsaveJob);

router.get('/:id', authenticateToken, ensureDb, getUserById);

module.exports = router;
