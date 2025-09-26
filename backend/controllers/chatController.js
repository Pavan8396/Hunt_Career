const chatService = require('../services/chatService');
const notificationService = require('../services/notificationService');
const mongoose = require('mongoose');

exports.getChatHistory = async (req, res) => {
  const { applicationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({ message: 'Invalid application ID' });
  }

  try {
    const populatedMessages = await chatService.getPopulatedChatHistory(applicationId);
    res.json(populatedMessages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history' });
  }
};

exports.deleteChatHistory = async (req, res) => {
  const { applicationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({ message: 'Invalid application ID' });
  }
  try {
    await chatService.deleteChatHistory(applicationId);
    res.status(200).json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting chat history' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotificationsForUser(
      req.user._id
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};