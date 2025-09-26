const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config/env');
const Chat = require('./models/chatModel');
const User = require('./models/userModel');
const notificationService = require('./services/notificationService');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  const userSockets = new Map();

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.user = decoded; // Attach user info to the socket
        next();
      });
    } else {
      next(new Error('Authentication error: Token not provided'));
    }
  });

  const sendNotifications = async (userId) => {
    const userSocket = userSockets.get(userId.toString());
    if (userSocket) {
      const notifications = await notificationService.getNotificationsForUser(userId);
      userSocket.emit('notifications', notifications);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.user._id;
    console.log(`User connected: ${userId} with socketId: ${socket.id}`);
    userSockets.set(userId.toString(), socket);

    // Send initial notifications on connect
    sendNotifications(userId);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ roomId, sender, text }) => {
      try {
        let chat = await Chat.findOne({ roomId });
        if (!chat) {
          chat = new Chat({ roomId, messages: [] });
        }
        const newMessage = { user: sender, text, timestamp: new Date(), read: false };
        chat.messages.push(newMessage);
        await chat.save();

        const senderInfo = await User.findById(sender).select('name').lean();

        // Emit message to the room
        socket.to(roomId).emit("receiveMessage", {
          roomId,
          sender,
          senderName: senderInfo ? senderInfo.name : 'Unknown',
          text,
          timestamp: newMessage.timestamp,
          read: newMessage.read,
        });

        // Find recipient and send them updated notifications
        const recipientId = roomId.split('_').find(id => id !== sender);
        if (recipientId) {
          sendNotifications(recipientId);
        }
      } catch (error) {
        console.error('Error saving or sending message:', error);
      }
    });

    socket.on('markAsRead', async ({ roomId, userId }) => {
      try {
        await Chat.updateOne(
          { roomId },
          { $set: { 'messages.$[elem].read': true } },
          { arrayFilters: [{ 'elem.user': { $ne: userId }, 'elem.read': false }] }
        );
        // After marking as read, send updated notifications back to the user who read them
        sendNotifications(userId);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      userSockets.delete(userId.toString());
    });
  });

  return io;
};

module.exports = initSocket;