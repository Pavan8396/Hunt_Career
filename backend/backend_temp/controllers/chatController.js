const Chat = require('../models/chatModel');
const notificationService = require('../services/notificationService');
const mongoose = require('mongoose');

const User = require('../models/userModel');
const Employer = require('../models/employerModel');

exports.getChatHistory = async (req, res) => {
  const { applicationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({ message: 'Invalid application ID' });
  }

  try {
    const chat = await Chat.findOne({ application: applicationId }).lean();
    if (!chat) {
      return res.json([]);
    }

    const senderIds = [
      ...new Set(chat.messages.map((m) => m.sender.toString())),
    ].map((id) => new mongoose.Types.ObjectId(id));

    const users = await User.find({ _id: { $in: senderIds } })
      .select('firstName lastName')
      .lean();
    const employers = await Employer.find({ _id: { $in: senderIds } })
      .select('companyName')
      .lean();

    const senderMap = new Map();
    users.forEach((u) =>
      senderMap.set(u._id.toString(), {
        _id: u._id,
        name: `${u.firstName} ${u.lastName}`,
      })
    );
    employers.forEach((e) =>
      senderMap.set(e._id.toString(), { _id: e._id, name: e.companyName })
    );

    const populatedMessages = chat.messages.map((message) => ({
      ...message,
      sender: senderMap.get(message.sender.toString()),
    }));

    res.json(populatedMessages);
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