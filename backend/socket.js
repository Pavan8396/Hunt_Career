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

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("send_message", async (data) => {
      const { user, recipient, message } = data;
      const roomId = [user, recipient].sort().join("_");
      let chat = await Chat.findOne({ roomId });
      if (!chat) {
        chat = new Chat({ roomId, messages: [] });
      }
      chat.messages.push({ user, message });
      await chat.save();
      socket.to(roomId).emit("receive_message", data);
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
