import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { getChatHistory } from '../services/api';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({}); // Store messages by roomId
  const [activeRoom, setActiveRoom] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, isAuthenticated, token } = useContext(AuthContext);
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user && token) {
      // Connect socket when user is authenticated
      socketRef.current = io('http://localhost:5000', {
        query: { token },
      });

      socketRef.current.on('receiveMessage', (data) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [data.roomId]: [...(prevMessages[data.roomId] || []), data],
        }));
      });

      return () => {
        socketRef.current.disconnect();
        socketRef.current = null;
      };
    }
  }, [isAuthenticated, user, token]);

  const joinRoom = async (otherUserId) => {
    if (user && socketRef.current) {
      const roomId = [user._id, otherUserId].sort().join('_');
      setActiveRoom(roomId);

      // Fetch chat history if it's not already loaded
      if (!messages[roomId]) {
        try {
          const history = await getChatHistory(roomId, token);
          setMessages((prevMessages) => ({
            ...prevMessages,
            [roomId]: history,
          }));
        } catch (error) {
          console.error("Failed to fetch chat history", error);
        }
      }

      socketRef.current.emit('joinRoom', roomId);
      setIsChatOpen(true);
    }
  };

  const sendMessage = (text) => {
    if (text.trim() && activeRoom && user && socketRef.current) {
      const messageData = {
        roomId: activeRoom,
        sender: user._id,
        text,
        timestamp: new Date(),
      };
      // Rely on the server to broadcast the message back to us
      socketRef.current.emit('sendMessage', messageData);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const value = {
    messages: messages[activeRoom] || [],
    activeRoom,
    isChatOpen,
    joinRoom,
    sendMessage,
    closeChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatProvider };