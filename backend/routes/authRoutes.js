const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { ensureDb } = require('../middleware/dbMiddleware');
const { validateRegistration } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', ensureDb, validateRegistration, registerUser);
router.post('/login', ensureDb, loginUser);

module.exports = router;
