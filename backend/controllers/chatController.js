const { Chat, Message } = require('../models/chatModel');
const notificationService = require('../services/notificationService');
const User = require('../models/userModel');
const Employer = require('../models/employerModel');
const { Op } = require('sequelize');

exports.getChatHistory = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const chat = await Chat.findOne({
        where: { applicationId },
        include: [{ model: Message, as: 'messages' }]
    });

    if (!chat) {
      return res.json([]);
    }

    const messages = chat.messages || [];
    const senderIds = [...new Set(messages.map((m) => m.senderId))];

    const users = await User.findAll({
      where: { id: { [Op.in]: senderIds } },
      attributes: ['id', 'firstName', 'lastName'],
    });
    const employers = await Employer.findAll({
      where: { id: { [Op.in]: senderIds } },
      attributes: ['id', 'companyName'],
    });

    const senderMap = new Map();
    users.forEach((u) =>
      senderMap.set(u.id, {
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
      })
    );
    employers.forEach((e) =>
      senderMap.set(e.id, { id: e.id, name: e.companyName })
    );

    const populatedMessages = messages.map((message) => ({
      ...message.get({ plain: true }),
      sender: senderMap.get(message.senderId),
    }));

    res.json(populatedMessages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
};

exports.deleteChatHistory = async (req, res) => {
  const { applicationId } = req.params;
  try {
    const chat = await Chat.findOne({ where: { applicationId } });
    if (chat) {
        // Delete messages first if not handled by cascade
        await Message.destroy({ where: { chatId: chat.id } });
        await chat.destroy();
    }
    res.status(200).json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({ message: 'Error deleting chat history' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotificationsForUser(
      req.user.id
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};
