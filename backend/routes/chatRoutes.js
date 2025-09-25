const express = require('express');
const router = express.Router();
const { getChatHistory, deleteChatHistory } = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/:roomId', authenticateToken, getChatHistory);
router.delete('/:roomId', authenticateToken, deleteChatHistory);

module.exports = router;