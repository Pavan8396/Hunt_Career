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
      socketRef.current = io('http://localhost:5000', { query: { token } });
      socketRef.current.on('connect', () => setIsSocketConnected(true));
      socketRef.current.on('disconnect', () => setIsSocketConnected(false));
      socketRef.current.on('receiveMessage', (data) => {
        setMessages(prev => ({ ...prev, [data.roomId]: [...(prev[data.roomId] || []), data] }));
      });

      if (activeRoom) {
        fetchHistory(activeRoom, token);
      }

      return () => {
        socketRef.current.disconnect();
        socketRef.current = null;
      };
    }
  }, [isAuthenticated, user, token, activeRoom, fetchHistory]);

  const joinRoom = async (otherUserId, userToken) => {
    if (user && isSocketConnected) {
      const roomId = [user._id, otherUserId].sort().join('_');
      setActiveRoom(roomId);
      localStorage.setItem('activeRoom', roomId);

      try {
        const partner = await getUserById(otherUserId, userToken);
        setChatPartner(partner);
      } catch (error) {
        console.error("Failed to fetch chat partner details", error);
      }

      await fetchHistory(roomId, userToken);
      socketRef.current.emit('joinRoom', roomId);
      setIsChatOpen(true);
    }
  };

  const deleteHistory = async () => {
    if (activeRoom && token) {
      try {
        await deleteChatHistory(activeRoom, token);
        setMessages(prev => ({ ...prev, [activeRoom]: [] }));
      } catch (error) {
        console.error("Failed to delete chat history", error);
      }
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