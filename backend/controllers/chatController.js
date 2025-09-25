const Chat = require('../models/chatModel');

const getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const chat = await Chat.findOne({ roomId });
    res.json(chat ? chat.messages : []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
};

const deleteChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    // Delete all chat messages for the room
    await Chat.deleteMany({ roomId });
    res.json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({ message: 'Failed to delete chat history' });
  }
};

module.exports = {
  getChatHistory,
  deleteChatHistory,
};


module.exports = { getChatHistory, deleteChatHistory };