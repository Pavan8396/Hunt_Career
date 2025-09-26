const Chat = require('../models/chatModel');
const notificationService = require('../services/notificationService');

exports.getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({ roomId: req.params.roomId });
    if (chat) {
      res.json(chat.messages);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history', error });
  }
};

exports.deleteChatHistory = async (req, res) => {
  try {
    await Chat.deleteOne({ roomId: req.params.roomId });
    res.status(200).json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting chat history', error });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotificationsForUser(req.user._id);
    res.json(notifications);
  } catch (error) {
    // The service already logs the error, but we can log here too if needed
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};