const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config/env');
const { Chat, Message } = require('./models/chatModel');
const Application = require('./models/applicationModel');
const notificationService = require('./services/notificationService');
const { Op } = require('sequelize');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
  });

  const userSockets = new Map();

  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) return next(new Error('Authentication error: Token not provided'));
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.user = decoded;
      next();
    });
  });

  const sendNotifications = async (userId) => {
    const userSocket = userSockets.get(userId.toString());
    if (!userSocket) return;
    try {
      const notifications = await notificationService.getNotificationsForUser(userId);
      userSocket.emit('notifications', notifications);
    } catch (error) {
      console.error(`Failed to send notifications to ${userId}:`, error);
    }
  };

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    userSockets.set(userId.toString(), socket);

    sendNotifications(userId);

    socket.on('joinRoom', ({ applicationId }) => {
      socket.join(applicationId);
    });

    socket.on(
      'sendMessage',
      async ({ applicationId, senderId, text }) => {
        try {
          const application = await Application.findByPk(applicationId, {
              include: ['job']
          });
          if (!application) return;

          const recipientId =
            userId.toString() === application.applicantId.toString()
              ? application.job.employerId
              : application.applicantId;

          let chat = await Chat.findOne({ where: { applicationId } });
          if (!chat) {
            chat = await Chat.create({
              applicationId,
              jobId: application.jobId,
              participants: [senderId, recipientId],
            });
          }

          const newMessage = await Message.create({
              chatId: chat.id,
              senderId,
              text,
              timestamp: new Date(),
              read: false
          });

          socket.to(applicationId).emit('receiveMessage', {
            ...newMessage.get({ plain: true }),
            applicationId,
            sender: { id: senderId, name: socket.user.name },
          });

          sendNotifications(recipientId.toString());
        } catch (error) {
          console.error('Error handling sendMessage:', error);
        }
      }
    );

    socket.on('markAsRead', async ({ applicationId }) => {
      try {
        const chat = await Chat.findOne({ where: { applicationId } });
        if (chat) {
            await Message.update(
                { read: true },
                {
                    where: {
                        chatId: chat.id,
                        senderId: { [Op.ne]: userId },
                        read: false
                    }
                }
            );
        }
        sendNotifications(userId);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    socket.on('disconnect', () => {
      userSockets.delete(userId.toString());
    });
  });

  return io;
};

module.exports = initSocket;
