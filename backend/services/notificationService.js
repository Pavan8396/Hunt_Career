const Chat = require('../models/chatModel');
const mongoose = require('mongoose');

const getNotificationsForUser = async (userId) => {
  try {
    console.log(`[notificationService] Fetching notifications for userId: ${userId}`);
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
          'messages.user': { $ne: userId.toString() },
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
      // Convert the string _id to ObjectId for lookup
      {
        $addFields: {
          senderIdObj: { $toObjectId: '$_id' }
        }
      },
      // Get sender's information from the Users collection
      {
        $lookup: {
          from: 'Users',
          localField: 'senderIdObj', // Use the new ObjectId field for joining
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
    console.log(`[notificationService] Found ${notifications.length} notifications for userId: ${userId}`);
    return notifications;
  } catch (error) {
    console.error(`[notificationService] Error fetching notifications for userId: ${userId}`, error);
    return []; // Return an empty array in case of an error
  }
};

module.exports = { getNotificationsForUser };