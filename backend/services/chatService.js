const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const Employer = require('../models/employerModel');
const mongoose = require('mongoose');

const getPopulatedChatHistory = async (applicationId) => {
  const chat = await Chat.findOne({ application: applicationId })
    .populate({
        path: 'messages.sender',
        select: 'firstName lastName companyName',
    })
    .lean();

  if (!chat) {
    return [];
  }

  const populatedMessages = chat.messages.map((message) => {
    const sender = message.sender;
    const name = sender.companyName || `${sender.firstName} ${sender.lastName}`;
    return {
        ...message,
        sender: {
            _id: sender._id,
            name: name,
        },
    };
  });

  return populatedMessages;
};

const deleteChatHistory = async (applicationId) => {
    return Chat.findOneAndDelete({ application: applicationId });
};


module.exports = {
  getPopulatedChatHistory,
  deleteChatHistory,
};