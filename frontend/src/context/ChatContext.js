import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { getChatHistory, deleteChatHistory } from '../services/api';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({});
  const [activeApplicationId, setActiveApplicationId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user, token } = useContext(AuthContext);
  const socketRef = useRef(null);

  const handleNewMessage = useCallback((data) => {
    const { applicationId, ...message } = data;
    setMessages((prev) => ({
      ...prev,
      [applicationId]: [...(prev[applicationId] || []), message],
    }));
  }, []);

  const handleNotifications = useCallback((serverNotifications) => {
    setNotifications(serverNotifications);
  }, []);

  useEffect(() => {
    if (user && token) {
      const socket = io('http://localhost:5000', { query: { token } });
      socketRef.current = socket;

      socket.on('receiveMessage', handleNewMessage);
      socket.on('notifications', handleNotifications);

      return () => {
        socket.off('receiveMessage', handleNewMessage);
        socket.off('notifications', handleNotifications);
        socket.disconnect();
      };
    }
  }, [user, token, handleNewMessage, handleNotifications]);

  const openChatForApplication = async (applicationId, recipientName) => {
    if (!user || !socketRef.current) return;

    setActiveApplicationId(applicationId);
    setRecipient(recipientName);

    if (!messages[applicationId]) {
      try {
        const history = await getChatHistory(applicationId, token);
        setMessages((prev) => ({ ...prev, [applicationId]: history }));
      } catch (error) {
        console.error('Failed to fetch chat history', error);
      }
    }

    socketRef.current.emit('joinRoom', { applicationId });
    socketRef.current.emit('markAsRead', { applicationId });
    setIsChatOpen(true);
  };

  const sendMessage = (text) => {
    if (text.trim() && activeApplicationId && user && socketRef.current) {
      const messageDataForSocket = {
        applicationId: activeApplicationId,
        senderId: user._id,
        text,
      };

      const optimisticMessage = {
        sender: { _id: user._id, name: user.name },
        text,
        timestamp: new Date(),
      };

      setMessages((prev) => ({
        ...prev,
        [activeApplicationId]: [
          ...(prev[activeApplicationId] || []),
          optimisticMessage,
        ],
      }));

      socketRef.current.emit('sendMessage', messageDataForSocket);
    }
  };

  const closeChat = () => setIsChatOpen(false);

  const deleteChat = async () => {
    if (activeApplicationId) {
      try {
        await deleteChatHistory(activeApplicationId, token);
        setMessages((prev) => {
          const newMessages = { ...prev };
          delete newMessages[activeApplicationId];
          return newMessages;
        });
        closeChat();
      } catch (error) {
        console.error('Failed to delete chat history', error);
      }
    }
  };

  const value = {
    messages: messages[activeApplicationId] || [],
    isChatOpen,
    recipient,
    notifications,
    openChatForApplication,
    sendMessage,
    closeChat,
    deleteChat,
    activeApplicationId,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatProvider };