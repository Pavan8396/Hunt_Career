const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config/env');
const Chat = require('./models/chatModel');
const Application = require('./models/applicationModel');
const notificationService = require('./services/notificationService');
const mongoose = require('mongoose');

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
    }
  };

  io.on('connection', (socket) => {
    const userId = socket.user._id;
    userSockets.set(userId.toString(), socket);

    sendNotifications(userId);

    socket.on('joinRoom', ({ applicationId }) => {
      socket.join(applicationId);
    });

    socket.on(
      'sendMessage',
      async ({ applicationId, senderId, text }) => {
        try {
          const application = await Application.findById(applicationId).populate('job');
          if (!application) return;

          const recipientId =
            userId.toString() === application.applicant.toString()
              ? application.job.employer
              : application.applicant;

          let chat = await Chat.findOne({ application: applicationId });
          if (!chat) {
            chat = new Chat({
              application: applicationId,
              job: application.job._id,
              participants: [senderId, recipientId],
              messages: [],
            });
          }

          const senderType = socket.user.type === 'user' ? 'User' : 'Employer';
          const newMessage = { sender: senderId, senderType, text, timestamp: new Date(), read: false };
          chat.messages.push(newMessage);
          await chat.save();

          socket.to(applicationId).emit('receiveMessage', {
            ...newMessage,
            applicationId,
            sender: { _id: senderId, name: socket.user.name },
          });

          sendNotifications(recipientId.toString());
        } catch (error) {
        }
      }
    );

    socket.on('markAsRead', async ({ applicationId }) => {
      try {
        await Chat.updateOne(
          { application: applicationId },
          { $set: { 'messages.$[elem].read': true } },
          {
            arrayFilters: [
              { 'elem.sender': { $ne: new mongoose.Types.ObjectId(userId) }, 'elem.read': false },
            ],
          }
        );
        sendNotifications(userId);
      } catch (error) {
      }
    });

    socket.on('disconnect', () => {
      userSockets.delete(userId.toString());
    });
  });

  return io;
};

module.exports = initSocket;