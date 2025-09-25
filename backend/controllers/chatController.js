const Chat = require('../models/chatModel');

const getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const chat = await Chat.findOne({ roomId }).populate('messages.sender', 'firstName lastName');
    res.json(chat ? chat.messages : []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
};

const deleteChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    await Chat.deleteOne({ roomId });
    res.json({ message: 'Chat history deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete chat history' });
  }
};

module.exports = { getChatHistory, deleteChatHistory };