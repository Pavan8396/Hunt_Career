import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { getChatHistory, deleteChatHistory } from '../services/api'; // Removed getNotifications

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({}); // Store messages by roomId
  const [activeRoom, setActiveRoom] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { user, token } = useContext(AuthContext);
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user && token) {
      // Cleanup previous socket instance if it exists
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const socket = io('http://localhost:5000', {
        query: { token },
        transports: ['websocket'],
        upgrade: false,
      });
      socketRef.current = socket;

      const onConnect = () => setIsSocketConnected(true);
      const onDisconnect = () => setIsSocketConnected(false);

      const onReceiveMessage = (data) => {
        const message = {
          sender: data.sender,
          text: data.text,
          timestamp: data.timestamp,
        };
        setMessages((prev) => ({
          ...prev,
          [data.roomId]: [...(prev[data.roomId] || []), message],
        }));
      };

      // Listen for the complete notification list from the server
      const onNotifications = (serverNotifications) => {
        console.log('[ChatContext] Received \'notifications\' event with data:', serverNotifications);
        setNotifications(serverNotifications);
      };

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('receiveMessage', onReceiveMessage);
      socket.on('notifications', onNotifications);

      // Cleanup function to remove listeners and disconnect socket
      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('receiveMessage', onReceiveMessage);
        socket.off('notifications', onNotifications);
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [user, token]);

  const joinRoom = async (otherUserId, recipientName) => {
    if (user && isSocketConnected) {
      const roomId = [user._id, otherUserId].sort().join('_');
      setActiveRoom(roomId);
      setRecipient(recipientName);

      // Fetch chat history if it's not already loaded
      if (!messages[roomId]) {
        try {
          const history = await getChatHistory(roomId, token);
          setMessages((prev) => ({
            ...prev,
            [roomId]: history.map(msg => ({
              sender: msg.user,
              text: msg.text,
              timestamp: msg.timestamp,
            })),
          }));
        } catch (error) {
          console.error("Failed to fetch chat history", error);
        }
      }

      socketRef.current.emit('joinRoom', roomId);
      // Tell the server we've read this room's messages
      socketRef.current.emit('markAsRead', { roomId, userId: user._id });

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
      setMessages((prev) => ({
        ...prev,
        [activeRoom]: [...(prev[activeRoom] || []), messageData],
      }));
      socketRef.current.emit('sendMessage', messageData);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const deleteChat = async () => {
    if (activeRoom) {
      try {
        await deleteChatHistory(activeRoom, token);
        setMessages((prev) => {
          const newMessages = { ...prev };
          delete newMessages[activeRoom];
          return newMessages;
        });
      } catch (error) {
        console.error("Failed to delete chat history", error);
      }
    }
  };

  const value = {
    messages: messages[activeRoom] || [],
    activeRoom,
    isChatOpen,
    recipient,
    notifications,
    joinRoom,
    sendMessage,
    closeChat,
    deleteChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatProvider };