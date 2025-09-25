const { Server } = require("socket.io");
const Chat = require('./models/chatModel');
const User = require('./models/userModel');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("sendMessage", async ({ roomId, sender, text }) => {
      try {
        let chat = await Chat.findOne({ roomId });
        if (!chat) {
          chat = new Chat({ roomId, messages: [] });
        }
        const newMessage = { user: sender, text: text, timestamp: new Date(), read: false };
        chat.messages.push(newMessage);
        await chat.save();

        const senderInfo = await User.findById(sender).select('name').lean();
        const senderName = senderInfo ? senderInfo.name : 'Unknown';

        // Emit the full message object to the room
        socket.to(roomId).emit("receiveMessage", {
          roomId,
          sender,
          senderName,
          text,
          timestamp: newMessage.timestamp,
          read: newMessage.read,
        });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('markAsRead', async ({ roomId, userId }) => {
      try {
        await Chat.updateOne(
          { roomId: roomId },
          { $set: { 'messages.$[elem].read': true } },
          { arrayFilters: [{ 'elem.user': { $ne: userId }, 'elem.read': false }] }
        );
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    socket.on("delete_chat", async (roomId) => {
      await Chat.deleteOne({ roomId });
      socket.to(roomId).emit("chat_deleted");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initSocket;