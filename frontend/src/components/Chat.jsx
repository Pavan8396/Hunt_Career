import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const Chat = ({ user, recipient }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
    });

    socketRef.current.on("receive_message", (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    const messageData = {
      user,
      recipient,
      text: message,
    };
    socketRef.current.emit("send_message", messageData);
    setChat((prevChat) => [...prevChat, { user, text: message }]);
    setMessage("");
  };

  const deleteChat = async () => {
    const roomId = [user, recipient].sort().join("_");
    try {
      await fetch(`http://localhost:5000/api/chat/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      setChat([]);
    } catch (error) {
      console.error("Failed to delete chat history", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Chat with {recipient}</h2>
        <button onClick={deleteChat} className="px-4 py-2 text-white bg-red-500 rounded">
          Delete Chat
        </button>
      </div>
      <div className="flex-grow p-4 overflow-auto">
        {chat.map((msg, index) => (
          <div key={index} className={`message ${msg.user === user ? "sent" : "received"}`}>
            <p>
              <strong>{msg.user}:</strong> {msg.text}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex p-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Type a message..."
        />
        <button type="submit" className="px-4 py-2 ml-2 text-white bg-blue-500 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;