const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const Notification = require('../models/notificationModel');
const mongoose = require('mongoose');

const createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

const getNotificationsForUser = async (userId) => {
  try {
    const notifications = await Message.aggregate([
      {
        $match: {
          read: false,
          sender: { $ne: new mongoose.Types.ObjectId(userId) },
        },
      },
      {
        $lookup: {
          from: 'chats',
          localField: 'chat',
          foreignField: '_id',
          as: 'chatInfo',
        },
      },
      { $unwind: '$chatInfo' },
      {
        $match: {
          'chatInfo.participants': new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: {
            sender: '$sender',
            job: '$chatInfo.job',
            application: '$chatInfo.application',
          },
          count: { $sum: 1 },
          lastMessage: { $last: '$text' },
        },
      },
      {
        $lookup: {
          from: 'Jobs',
          localField: '_id.job',
          foreignField: '_id',
          as: 'jobInfo',
        },
      },
      {
        $unwind: {
          path: '$jobInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'Users',
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
            $ifNull: [
              '$senderDetails.companyName',
              {
                $concat: [
                  '$senderDetails.firstName',
                  ' ',
                  '$senderDetails.lastName',
                ],
              },
            ],
          },
          jobId: '$_id.job',
          jobTitle: '$jobInfo.title',
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

const markAsRead = async (notificationId, userId) => {
  try {
    await Notification.updateOne(
      { _id: notificationId, recipient: userId },
      { $set: { isRead: true } }
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

const getPersistentNotifications = async (userId) => {
  try {
    return await Notification.find({ recipient: userId, isRead: false })
      .sort({ createdAt: -1 })
      .populate('sender', 'firstName lastName companyName');
  } catch (error) {
    console.error('Error fetching persistent notifications:', error);
    return [];
  }
};

module.exports = {
  getNotificationsForUser,
  createNotification,
  markAsRead,
  getPersistentNotifications
};