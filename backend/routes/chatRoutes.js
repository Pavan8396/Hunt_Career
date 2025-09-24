const express = require('express');
const { getChatHistory, deleteChatHistory, getConversations } = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { ensureDb } = require('../middleware/dbMiddleware');

const router = express.Router();

router.get('/conversations', authenticateToken, ensureDb, getConversations);
router.get('/:roomId', authenticateToken, ensureDb, getChatHistory);
router.delete('/:roomId', authenticateToken, ensureDb, deleteChatHistory);

module.exports = router;