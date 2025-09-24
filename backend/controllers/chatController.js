const Chat = require('../models/chatModel');

const getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Chat.find({ roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
};

module.exports = { getChatHistory };