const Chat = require('../models/chatModel');
const notificationService = require('../services/notificationService');
const mongoose = require('mongoose');

exports.getChatHistory = async (req, res) => {
  const { applicationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({ message: 'Invalid application ID' });
  }
  try {
    const chat = await Chat.findOne({ application: applicationId }).populate(
      'messages.sender',
      'name companyName'
    );
    res.json(chat ? chat.messages : []);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
};

exports.deleteChatHistory = async (req, res) => {
  const { applicationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({ message: 'Invalid application ID' });
  }
  try {
    await Chat.findOneAndDelete({ application: applicationId });
    res.status(200).json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat history:', error);
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