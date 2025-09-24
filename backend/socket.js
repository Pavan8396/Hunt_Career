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
        const newMessage = new Chat({
          roomId: data.roomId,
          sender: data.sender,
          text: data.text,
        });
        await newMessage.save();
        io.to(data.roomId).emit("receiveMessage", data);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initSocket;
