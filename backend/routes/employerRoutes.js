const express = require('express');
const multer = require('multer');
const {
  registerEmployer,
  loginEmployer,
  getEmployerApplications,
  getApplicationsOverTime,
  getJobPostingsSummary,
  getRecentActivity,
  getEmployerById,
  getEmployerProfile,
  updateEmployerProfile,
  updateEmployerTheme,
} = require('../controllers/employerController');
const { ensureDb } = require('../middleware/dbMiddleware');
const { authenticateToken, isEmployer } = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post('/register', ensureDb, registerEmployer);
router.post('/login', ensureDb, loginEmployer);
router.get('/profile', ensureDb, authenticateToken, isEmployer, getEmployerProfile);
router.put(
  '/profile',
  ensureDb,
  authenticateToken,
  isEmployer,
  upload.single('companyLogo'),
  updateEmployerProfile
);
router.put('/theme', ensureDb, authenticateToken, isEmployer, updateEmployerTheme);
router.get('/applications', ensureDb, authenticateToken, isEmployer, getEmployerApplications);
router.get('/stats/applications-over-time', ensureDb, authenticateToken, isEmployer, getApplicationsOverTime);
router.get('/stats/job-postings-summary', ensureDb, authenticateToken, isEmployer, getJobPostingsSummary);
router.get('/stats/recent-activity', ensureDb, authenticateToken, isEmployer, getRecentActivity);
router.get('/:id', ensureDb, authenticateToken, getEmployerById);

// Nested route for reviews
const reviewRoutes = require('./reviewRoutes');
router.use('/:employerId/reviews', reviewRoutes);

module.exports = router;
