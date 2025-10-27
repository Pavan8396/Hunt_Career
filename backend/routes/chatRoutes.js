const express = require('express');
const router = express.Router();
const {
  getChatHistory,
  deleteChatHistory,
  getNotifications,
} = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/chat/notifications:
 *   get:
 *     summary: Get notifications
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notifications
 *       401:
 *         description: Unauthorized
 */
router.get('/notifications', authenticateToken, getNotifications);

/**
 * @swagger
 * /api/chat/{applicationId}:
 *   get:
 *     summary: Get chat history
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat history
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */
router.get('/:applicationId', authenticateToken, getChatHistory);

/**
 * @swagger
 * /api/chat/{applicationId}:
 *   delete:
 *     summary: Delete chat history
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat history deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */
router.delete('/:applicationId', authenticateToken, deleteChatHistory);

module.exports = router;
