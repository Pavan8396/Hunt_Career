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
import { toast } from 'react-toastify';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({});
  const [activeApplicationId, setActiveApplicationId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [activeJobTitle, setActiveJobTitle] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [persistentNotifications, setPersistentNotifications] = useState([]);
  const { user, token } = useContext(AuthContext);
  const socketRef = useRef(null);

  const handleNewMessage = useCallback((data) => {
    const { applicationId, ...message } = data;
    setMessages((prev) => ({
      ...prev,
      [applicationId]: [...(prev[applicationId] || []), message],
    }));

    // Trigger toast if chat is not open for this application
    if (activeApplicationId !== applicationId) {
      toast.info(`New message from ${message.sender.name}`);
    }
  }, [activeApplicationId]);

  const handleNotifications = useCallback((serverNotifications) => {
    setNotifications(serverNotifications);
  }, []);

  const handlePersistentNotifications = useCallback((serverNotifications) => {
    setPersistentNotifications(serverNotifications);
  }, []);

  useEffect(() => {
    if (user && token) {
      const socket = io('http://localhost:5000', { query: { token } });
      socketRef.current = socket;

      socket.on('receiveMessage', handleNewMessage);
      socket.on('notifications', handleNotifications);
      socket.on('persistentNotifications', handlePersistentNotifications);

      return () => {
        socket.off('receiveMessage', handleNewMessage);
        socket.off('notifications', handleNotifications);
        socket.off('persistentNotifications', handlePersistentNotifications);
        socket.disconnect();
      };
    }
  }, [user, token, handleNewMessage, handleNotifications, handlePersistentNotifications]);

  const openChatForApplication = useCallback(
    async (applicationId, recipientName, jobTitle) => {
      if (!user || !socketRef.current) return;

      setActiveApplicationId(applicationId);
      setRecipient(recipientName);
      if (jobTitle) setActiveJobTitle(jobTitle);

      try {
        const history = await getChatHistory(applicationId, token);
        if (!jobTitle && history.length > 0) {
           // We could potentially find the job title from history if we had it there
           // But better to fetch job title if missing.
        }
        setMessages((prev) => ({ ...prev, [applicationId]: history }));
      } catch (error) {
        console.error('Failed to fetch chat history', error);
      }

      socketRef.current.emit('joinRoom', { applicationId });
      socketRef.current.emit('markAsRead', { applicationId });
      setIsChatOpen(true);
    },
    [user, token, setActiveApplicationId, setRecipient, setActiveJobTitle, setIsChatOpen]
  );

  const sendMessage = useCallback(
    (text) => {
      if (text.trim() && activeApplicationId && user && socketRef.current) {
        const messageDataForSocket = {
          applicationId: activeApplicationId,
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
    },
    [activeApplicationId, user]
  );

  const closeChat = useCallback(() => {
    if (activeApplicationId && socketRef.current) {
      socketRef.current.emit('leaveRoom', { applicationId: activeApplicationId });
    }
    setIsChatOpen(false);
  }, [activeApplicationId]);

  const deleteChat = useCallback(async () => {
    if (activeApplicationId) {
      try {
        await deleteChatHistory(activeApplicationId, token);
        setMessages((prev) => {
          const newMessages = { ...prev };
          delete newMessages[activeApplicationId];
          return newMessages;
        });
      } catch (error) {
        console.error('Failed to delete chat history', error);
      }
    }
  }, [activeApplicationId, token]);

  const value = {
    messages: messages[activeApplicationId] || [],
    isChatOpen,
    recipient,
    notifications,
    persistentNotifications,
    openChatForApplication,
    sendMessage,
    closeChat,
    markNotificationAsRead: (notificationId) => {
      if (socketRef.current) {
        socketRef.current.emit('markNotificationAsRead', { notificationId });
      }
    },
    markAllAsRead: () => {
      if (socketRef.current) {
        socketRef.current.emit('markAllNotificationsAsRead');
      }
    },
    deleteChat,
    activeApplicationId,
    activeJobTitle,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatProvider };