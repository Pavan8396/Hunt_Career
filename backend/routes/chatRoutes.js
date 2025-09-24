const express = require('express');
const { getChatHistory } = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { ensureDb } = require('../middleware/dbMiddleware');

const router = express.Router();

router.get('/:roomId', authenticateToken, ensureDb, getChatHistory);

module.exports = router;