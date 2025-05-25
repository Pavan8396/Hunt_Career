const express = require('express');
const { getUserDetails } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { ensureDb } = require('../middleware/dbMiddleware');

const router = express.Router();

router.get('/', authenticateToken, ensureDb, getUserDetails);

module.exports = router;
