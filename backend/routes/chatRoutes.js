const express = require('express');
const router = express.Router();
const { getChatHistory, deleteChatHistory, getNotifications } = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/notifications', authenticateToken, getNotifications);
router.get('/:roomId', authenticateToken, getChatHistory);
router.delete('/:roomId', authenticateToken, deleteChatHistory);

module.exports = router;