const express = require('express');
const router = express.Router();
const { getChatHistory, deleteChatHistory } = require('../controllers/chatController');
const auth = require('../middleware/authMiddleware');

router.get('/:roomId', auth, getChatHistory);
router.delete('/:roomId', auth, deleteChatHistory);

module.exports = router;