const { Server } = require("socket.io");
const Chat = require('./models/chatModel');

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

    socket.on("sendMessage", async (data) => {
      try {
        const { roomId, sender, text } = data;
        let chat = await Chat.findOne({ roomId });
        if (!chat) {
          chat = new Chat({ roomId, messages: [] });
        }
        const newMessage = { user: sender, text: text, timestamp: new Date() };
        chat.messages.push(newMessage);
        await chat.save();

        const messageToSend = {
          roomId: data.roomId,
          sender: data.sender,
          text: data.text,
          timestamp: newMessage.timestamp
        };
        io.to(data.roomId).emit("receiveMessage", messageToSend);
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