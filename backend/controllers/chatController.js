const Chat = require('../models/chatModel');

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

module.exports = { getChatHistory, deleteChatHistory };