const Chat = require('../models/chatModel');
const mongoose = require('mongoose');

const getNotificationsForUser = async (userId) => {
  try {
    const notifications = await Chat.aggregate([
      {
        $match: {
          participants: new mongoose.Types.ObjectId(userId),
        },
      },
      { $unwind: '$messages' },
      {
        $match: {
          'messages.read': false,
          'messages.sender': { $ne: new mongoose.Types.ObjectId(userId) },
        },
      },
      {
        $group: {
          _id: {
            sender: '$messages.sender',
            job: '$job',
            application: '$application',
          },
          count: { $sum: 1 },
          lastMessage: { $last: '$messages.text' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.sender',
          foreignField: '_id',
          as: 'senderInfo',
        },
      },
      {
        $lookup: {
          from: 'employers',
          localField: '_id.sender',
          foreignField: '_id',
          as: 'employerInfo',
        },
      },
      {
        $addFields: {
          senderDetails: {
            $cond: {
              if: { $gt: [{ $size: '$senderInfo' }, 0] },
              then: { $arrayElemAt: ['$senderInfo', 0] },
              else: { $arrayElemAt: ['$employerInfo', 0] },
            },
          },
        },
      },
      { $match: { senderDetails: { $exists: true, $ne: null } } },
      {
        $project: {
          _id: 0,
          senderId: '$_id.sender',
          senderName: {
            $ifNull: ['$senderDetails.name', '$senderDetails.companyName'],
          },
          jobId: '$_id.job',
          applicationId: '$_id.application',
          count: '$count',
          lastMessage: '$lastMessage',
        },
      },
    ]);
    return notifications;
  } catch (error) {
    console.error(
      `[notificationService] Error fetching notifications for userId: ${userId}`,
      error
    );
    throw new Error('Failed to fetch notifications');
  }
};

module.exports = { getNotificationsForUser };