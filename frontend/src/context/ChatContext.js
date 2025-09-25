import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { getChatHistory, deleteChatHistory, getUserById } from '../services/api';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({});
  const [activeRoom, setActiveRoom] = useState(localStorage.getItem('activeRoom') || null);
  const [chatPartner, setChatPartner] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { user, isAuthenticated, token } = useContext(AuthContext);
  const socketRef = useRef(null);

  const fetchHistory = useCallback(async (roomId, userToken) => {
    if (!messages[roomId]) {
      try {
        const history = await getChatHistory(roomId, userToken);
        setMessages(prev => ({ ...prev, [roomId]: history }));
      } catch (error) {
        console.error("Failed to fetch chat history", error);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isAuthenticated && user && token) {
      const socket = io('http://localhost:5000', { query: { token } });
      socketRef.current = socket;
      socket.on('connect', () => setIsSocketConnected(true));
      socket.on('disconnect', () => setIsSocketConnected(false));
      socket.on('receiveMessage', (data) => {
        setMessages(prev => ({ ...prev, [data.roomId]: [...(prev[data.roomId] || []), data] }));
      });

      if (activeRoom) {
        fetchHistory(activeRoom, token);
        const ids = activeRoom.split('_');
        const otherUserId = ids[0] === user._id ? ids[1] : ids[0];
        getUserById(otherUserId, token).then(setChatPartner);
      }

      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, user, token, activeRoom, fetchHistory]);

  const joinRoom = async (otherUserId) => {
    if (user && isSocketConnected) {
      const roomId = [user._id, otherUserId].sort().join('_');
      setActiveRoom(roomId);
      localStorage.setItem('activeRoom', roomId);
      const partner = await getUserById(otherUserId, token);
      setChatPartner(partner);
      await fetchHistory(roomId, token);
      socketRef.current.emit('joinRoom', roomId);
      setIsChatOpen(true);
    }
  };

  const deleteHistory = async () => {
    if (activeRoom && token) {
      await deleteChatHistory(activeRoom, token);
      setMessages(prev => ({ ...prev, [activeRoom]: [] }));
    }
  };

  const sendMessage = (text) => {
    if (text.trim() && activeRoom && user && socketRef.current) {
      const messageData = { roomId: activeRoom, sender: user._id, text, timestamp: new Date() };
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
    chatPartner,
    joinRoom,
    sendMessage,
    closeChat,
    deleteHistory,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatProvider };