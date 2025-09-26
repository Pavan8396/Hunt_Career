import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { getChatHistory, deleteChatHistory } from '../services/api';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [currentJobTitle, setCurrentJobTitle] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { user, token } = useContext(AuthContext);
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [pendingChat, setPendingChat] = useState(null); // For post-navigation chat opening

  useEffect(() => {
    if (user && token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const socket = io('http://localhost:5000', {
        query: { token },
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

      const onNotifications = (serverNotifications) => {
        setNotifications(serverNotifications);
      };

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('receiveMessage', onReceiveMessage);
      socket.on('notifications', onNotifications);

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

  const joinRoom = async (otherUserId, recipientName, jobId, jobTitle) => {
    if (user && isSocketConnected) {
      const roomId = [user._id, otherUserId].sort().join('_');
      setActiveRoom(roomId);
      setRecipient(recipientName);
      setCurrentJobId(jobId);
      setCurrentJobTitle(jobTitle);

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
        jobId: currentJobId,
        timestamp: new Date(),
      };
      console.log('[ChatContext] Emitting sendMessage with data:', messageData); // Diagnostic log
      setMessages((prev) => ({
        ...prev,
        [activeRoom]: [...(prev[activeRoom] || []), messageData],
      }));
      socketRef.current.emit('sendMessage', messageData);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setCurrentJobTitle(null);
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

  const clearPendingChat = () => {
    setPendingChat(null);
  };

  const value = {
    messages: messages[activeRoom] || [],
    activeRoom,
    isChatOpen,
    recipient,
    notifications,
    currentJobTitle,
    pendingChat,
    setPendingChat,
    clearPendingChat,
    joinRoom,
    sendMessage,
    closeChat,
    deleteChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatProvider };