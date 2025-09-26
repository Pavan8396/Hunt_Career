const Chat = require('../models/chatModel');
const mongoose = require('mongoose');

const getNotificationsForUser = async (userId) => {
  try {
    console.log(`[notificationService] Fetching notifications for userId: ${userId}`);

    const notifications = await Chat.aggregate([
      // Match rooms the user is part of
      {
        $match: {
          $or: [{ roomId: { $regex: `^${userId}_` } }, { roomId: { $regex: `_${userId}$` } }],
        },
      },
      // Unwind the messages array
      { $unwind: '$messages' },
      // Filter for unread messages not sent by the current user
      {
        $match: {
          'messages.read': false,
          'messages.user': { $ne: userId.toString() },
        },
      },
      // Group by sender to count messages
      {
        $group: {
          _id: '$messages.user',
          count: { $sum: 1 },
          roomId: { $first: '$roomId' },
          lastMessage: { $last: '$messages.text' },
        },
      },
      // Convert string _id to ObjectId for lookups
      {
        $addFields: {
          senderIdObj: { $toObjectId: '$_id' }
        }
      },
      // Lookup in the Users collection
      {
        $lookup: {
          from: 'Users',
          localField: 'senderIdObj',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      // Lookup in the Employers collection
      {
        $lookup: {
          from: 'employers',
          localField: 'senderIdObj',
          foreignField: '_id',
          as: 'employerInfo',
        },
      },
      // Combine user and employer info
      {
        $addFields: {
          senderInfo: {
            $cond: {
              if: { $gt: [{ $size: '$userInfo' }, 0] },
              then: { $arrayElemAt: ['$userInfo', 0] },
              else: { $arrayElemAt: ['$employerInfo', 0] },
            },
          },
        },
      },
      // Filter out documents where sender was not found in either collection
      { $match: { senderInfo: { $exists: true, $ne: null } } },
      // Project the final notification shape
      {
        $project: {
          _id: 0,
          senderId: '$_id',
          // Use the correct name field based on the sender type
          senderName: {
            $cond: {
              if: { $ifNull: ['$senderInfo.name', false] },
              then: '$senderInfo.name',
              else: '$senderInfo.companyName'
            }
          },
          count: '$count',
          roomId: '$roomId',
          lastMessage: '$lastMessage',
        },
      },
    ]);

    console.log(`[notificationService] Found ${notifications.length} notifications for userId: ${userId}`, JSON.stringify(notifications, null, 2));
    return notifications;
  } catch (error) {
    console.error(`[notificationService] Error fetching notifications for userId: ${userId}`, error);
    return []; // Return an empty array in case of an error
  }
};

module.exports = { getNotificationsForUser };