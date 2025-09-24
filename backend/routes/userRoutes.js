const express = require('express');
const { getUserDetails, getUserApplications } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { ensureDb } = require('../middleware/dbMiddleware');

const router = express.Router();

router.get('/', authenticateToken, ensureDb, getUserDetails);
router.get('/applications', authenticateToken, ensureDb, getUserApplications);

module.exports = router;
