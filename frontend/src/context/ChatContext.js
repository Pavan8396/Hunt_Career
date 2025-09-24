import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { getChatHistory } from '../services/api';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({}); // Store messages by roomId
  const [activeRoom, setActiveRoom] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { user, isAuthenticated, token } = useContext(AuthContext);
  const socketRef = useRef(null);

  useEffect(() => {
    console.log('ChatContext useEffect triggered. Auth status:', isAuthenticated);
    if (isAuthenticated && user && token) {
      console.log('Connecting socket...');
      // Connect socket when user is authenticated
      socketRef.current = io('http://localhost:5000', {
        query: { token },
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected successfully.');
        setIsSocketConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected.');
        setIsSocketConnected(false);
      });

      socketRef.current.on('receiveMessage', (data) => {
        console.log('Received message:', data);
        setMessages((prevMessages) => ({
          ...prevMessages,
          [data.roomId]: [...(prevMessages[data.roomId] || []), data],
        }));
      });

      return () => {
        console.log('Disconnecting socket...');
        socketRef.current.disconnect();
        socketRef.current = null;
      };
    }
  }, [isAuthenticated, user, token]);

  const joinRoom = async (otherUserId, userToken) => {
    console.log(`joinRoom called with otherUserId: ${otherUserId}`);
    if (user && isSocketConnected) {
      const roomId = [user._id, otherUserId].sort().join('_');
      console.log(`Joining room: ${roomId}`);
      setActiveRoom(roomId);

      // Fetch chat history if it's not already loaded
      if (!messages[roomId]) {
        console.log(`Fetching history for room: ${roomId}`);
        try {
          const history = await getChatHistory(roomId, userToken);
          console.log('Fetched history:', history);
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
    } else {
      console.error('joinRoom failed: user or socket not available.', { user, socket: socketRef.current });
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