import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { getChatHistory, deleteChatHistory, getNotifications } from '../services/api';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({}); // Store messages by roomId
  const [activeRoom, setActiveRoom] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { user, token } = useContext(AuthContext);
  const socketRef = useRef(null);

  // Initialize notifications from session storage
  const [notifications, setNotifications] = useState(() => {
    try {
      const savedNotifications = sessionStorage.getItem('notifications');
      return savedNotifications ? JSON.parse(savedNotifications) : [];
    } catch (error) {
      console.error("Failed to parse notifications from session storage", error);
      return [];
    }
  });

  // Save notifications to session storage whenever they change
  useEffect(() => {
    sessionStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);


  // Refs to hold current state for the socket listener to avoid stale closures
  const isChatOpenRef = useRef(isChatOpen);
  const activeRoomRef = useRef(activeRoom);

  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
    activeRoomRef.current = activeRoom;
  }, [isChatOpen, activeRoom]);

  const fetchNotifications = useCallback(async () => {
    if (token) {
      try {
        const data = await getNotifications(token);
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (user && token && !socketRef.current) { // Ensure token exists
      socketRef.current = io('http://localhost:5000', {
        query: { token },
      });

      socketRef.current.on('connect', () => {
        setIsSocketConnected(true);
        fetchNotifications();
      });

      socketRef.current.on('disconnect', () => {
        setIsSocketConnected(false);
      });

      socketRef.current.on('receiveMessage', (data) => {
        const message = {
          sender: data.sender,
          text: data.text,
          timestamp: data.timestamp,
        };
        setMessages((prev) => ({
          ...prev,
          [data.roomId]: [...(prev[data.roomId] || []), message],
        }));

        if (data.sender !== user._id) {
          if (isChatOpenRef.current && activeRoomRef.current === data.roomId) {
            socketRef.current.emit('markAsRead', { roomId: data.roomId, userId: user._id });
          } else {
            setNotifications((prev) => {
              const existingNotif = prev.find((n) => n.senderId === data.sender);
              if (existingNotif) {
                return prev.map((n) =>
                  n.senderId === data.sender
                    ? { ...n, count: n.count + 1, lastMessage: data.text }
                    : n
                );
              } else {
                return [
                  ...prev,
                  {
                    senderId: data.sender,
                    senderName: data.senderName,
                    count: 1,
                    roomId: data.roomId,
                    lastMessage: data.text,
                  },
                ];
              }
            });
          }
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, token, fetchNotifications]);

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
      socketRef.current.emit('markAsRead', { roomId, userId: user._id });

      setNotifications((prev) => prev.filter((n) => n.roomId !== roomId));

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