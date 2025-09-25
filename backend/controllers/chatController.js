const Chat = require('../models/chatModel');

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
    const userId = req.user._id;

    const notifications = await Chat.aggregate([
      // Find chats where the user is a participant
      {
        $match: {
          $or: [{ roomId: { $regex: `^${userId}_` } }, { roomId: { $regex: `_${userId}$` } }],
        },
      },
      // Deconstruct the messages array
      { $unwind: '$messages' },
      // Filter for unread messages not sent by the current user
      {
        $match: {
          'messages.read': false,
          'messages.user': { $ne: userId },
        },
      },
      // Group by sender and count unread messages
      {
        $group: {
          _id: '$messages.user',
          count: { $sum: 1 },
          roomId: { $first: '$roomId' },
          lastMessage: { $last: '$messages.text' },
        },
      },
      // Get sender's information from the Users collection
      {
        $lookup: {
          from: 'Users',
          localField: '_id',
          foreignField: '_id',
          as: 'senderInfo',
        },
      },
      // Filter out cases where sender info is not found
      { $match: { senderInfo: { $ne: [] } } },
      // Deconstruct the senderInfo array
      { $unwind: '$senderInfo' },
      // Format the output
      {
        $project: {
          _id: 0,
          senderId: '$_id',
          senderName: '$senderInfo.name',
          count: '$count',
          roomId: '$roomId',
          lastMessage: '$lastMessage',
        },
      },
    ]);

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};