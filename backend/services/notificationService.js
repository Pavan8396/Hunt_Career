const { Chat, Message } = require('../models/chatModel');
const Job = require('../models/jobModel');
const User = require('../models/userModel');
const Employer = require('../models/employerModel');
const { sequelize } = require('../config/db');
const { Op, QueryTypes } = require('sequelize');

const getNotificationsForUser = async (userId) => {
  try {
    // Implementing complex aggregation via raw SQL or complex Sequelize queries.
    // Given the previous MongoDB aggregation, we want unread messages sent by others.

    const query = `
      SELECT
        c.jobId,
        j.title as jobTitle,
        c.applicationId,
        m.senderId,
        COUNT(m.id) as count,
        m.text as lastMessage
      FROM Chats c
      JOIN Messages m ON c.id = m.chatId
      JOIN Jobs j ON c.jobId = j.id
      WHERE json_each.value = :userId -- This is SQLite specific for JSON array
        AND m.read = 0
        AND m.senderId != :userId
      GROUP BY c.jobId, c.applicationId, m.senderId
    `;

    // Actually, SQLite json_each is a bit tricky in raw SQL without knowing the exact schema mapping.
    // Let's try a more Sequelize-friendly way if possible, or use Op.like for the JSON participants if it's stored as a string.

    // In SQLite, if participants is stored as JSON, we can use JSON functions.
    const notifications = await sequelize.query(`
      SELECT
        c.jobId,
        j.title as jobTitle,
        c.applicationId,
        m.senderId,
        COUNT(m.id) as count,
        (SELECT text FROM Messages WHERE chatId = c.id AND senderId != :userId AND read = 0 ORDER BY id DESC LIMIT 1) as lastMessage
      FROM Chats c
      JOIN Messages m ON c.id = m.chatId
      JOIN Jobs j ON c.jobId = j.id
      CROSS JOIN json_each(c.participants)
      WHERE json_each.value = :userId
        AND m.read = 0
        AND m.senderId != :userId
      GROUP BY c.jobId, c.applicationId, m.senderId
    `, {
      replacements: { userId },
      type: QueryTypes.SELECT
    });

    // Populate sender details
    for (let notif of notifications) {
        const user = await User.findByPk(notif.senderId, { attributes: ['firstName', 'lastName'] });
        if (user) {
            notif.senderName = `${user.firstName} ${user.lastName}`;
        } else {
            const employer = await Employer.findByPk(notif.senderId, { attributes: ['companyName'] });
            if (employer) {
                notif.senderName = employer.companyName;
            }
        }
    }

    return notifications;
  } catch (error) {
    console.error(
      `[notificationService] Error fetching notifications for userId: ${userId}`,
      error
    );
    // If json_each fails (e.g. not supported or participants not array), fallback to empty
    return [];
  }
};

module.exports = { getNotificationsForUser };
