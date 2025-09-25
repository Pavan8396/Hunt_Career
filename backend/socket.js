const { Server } = require("socket.io");
const Chat = require('./models/chatModel');
const User = require('./models/userModel');
const Employer = require('./models/employerModel');

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
        const newMessage = { user: sender, text: text, timestamp: new Date() };
        chat.messages.push(newMessage);
        await chat.save();

        let senderName = 'Unknown';
        const user = await User.findById(sender).lean();
        if (user) {
          senderName = `${user.firstName} ${user.lastName}`;
        } else {
          const employer = await Employer.findById(sender).lean();
          if (employer) {
            senderName = employer.companyName;
          }
        }

        io.to(roomId).emit("receiveMessage", { roomId, sender, senderName, text });
      } catch (error) {
        console.error('Error saving message:', error);
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