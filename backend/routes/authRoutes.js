const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { ensureDb } = require('../middleware/dbMiddleware');

const router = express.Router();

router.post('/register', ensureDb, registerUser);
router.post('/login', ensureDb, loginUser);

module.exports = router;
