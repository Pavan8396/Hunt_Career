import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { getChatHistory } from '../services/api';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({}); // Store messages by roomId
  const [activeRoom, setActiveRoom] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { user, isAuthenticated, token } = useContext(AuthContext);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user && !socketRef.current) {
      console.log('Connecting socket...');
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
        const message = {
          sender: data.sender,
          text: data.text,
          timestamp: data.timestamp,
        };
        setMessages((prevMessages) => ({
          ...prevMessages,
          [data.roomId]: [...(prevMessages[data.roomId] || []), message],
        }));
      });
    }

    return () => {
      if (socketRef.current) {
        console.log('Disconnecting socket...');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, token]);

  const joinRoom = async (otherUserId, recipientName, userToken) => {
    console.log(`joinRoom called with otherUserId: ${otherUserId}`);
    if (user && isSocketConnected) {
      const roomId = [user._id, otherUserId].sort().join('_');
      console.log(`Joining room: ${roomId}`);
      setActiveRoom(roomId);
      setRecipient(recipientName);

      // Fetch chat history if it's not already loaded
      if (!messages[roomId]) {
        console.log(`Fetching history for room: ${roomId}`);
        try {
          const history = await getChatHistory(roomId, userToken);
          const formattedHistory = history.map(msg => ({
            sender: msg.user,
            text: msg.text,
            timestamp: msg.timestamp,
          }));
          setMessages((prevMessages) => ({
            ...prevMessages,
            [roomId]: formattedHistory,
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
      // Optimistic UI update
      setMessages((prevMessages) => ({
        ...prevMessages,
        [activeRoom]: [...(prevMessages[activeRoom] || []), messageData],
      }));
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
    recipient,
    joinRoom,
    sendMessage,
    closeChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatProvider };