const express = require('express');
const { registerEmployer, loginEmployer, getEmployerApplications } = require('../controllers/employerController');
const { ensureDb } = require('../middleware/dbMiddleware');
const { authenticateToken, isEmployer } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', ensureDb, registerEmployer);
router.post('/login', ensureDb, loginEmployer);
router.get('/applications', ensureDb, authenticateToken, isEmployer, getEmployerApplications);

module.exports = router;
