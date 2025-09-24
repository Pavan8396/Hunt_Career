const Chat = require('../models/chatModel');
const userService = require('../services/userService');
const { ObjectId } = require('mongodb');

const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const rooms = await Chat.distinct('roomId', { sender: userId });

    const conversations = await Promise.all(rooms.map(async (roomId) => {
      const ids = roomId.split('_');
      const otherUserId = ids[0].toString() === userId.toString() ? ids[1] : ids[0];
      const otherUser = await userService.getUserById(otherUserId);
      return {
        roomId,
        partner: otherUser
      };
    }));

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    console.log(`Fetching chat history for room: ${roomId}`);
    const messages = await Chat.find({ roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
};

const deleteChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    await Chat.deleteMany({ roomId });
    res.json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({ message: 'Failed to delete chat history' });
  }
};

module.exports = { getChatHistory, deleteChatHistory, getConversations };