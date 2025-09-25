import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { getChatHistory, deleteChatHistory } from '../services/api';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({}); // Store messages by roomId
  const [unreadMessages, setUnreadMessages] = useState({}); // Store unread counts by roomId
  const [conversations, setConversations] = useState({}); // Store conversation metadata
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
        // Add the message to the state, as we now rely on the server as the source of truth.
        setMessages((prevMessages) => ({
          ...prevMessages,
          [data.roomId]: [...(prevMessages[data.roomId] || []), message],
        }));

        // Only increment unread count if the message is from another user and the chat is not active.
        if (data.sender !== user._id && data.roomId !== activeRoom) {
          setUnreadMessages((prevUnread) => {
            const newUnread = { ...prevUnread };
            if (!newUnread[data.roomId]) {
              newUnread[data.roomId] = { count: 0, senderName: data.senderName };
            }
            newUnread[data.roomId].count += 1;
            return newUnread;
          });
        }
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

      if (!conversations[roomId]) {
        setConversations((prev) => ({
          ...prev,
          [roomId]: { recipientName, otherUserId },
        }));
      }

      // Reset unread messages for the room
      setUnreadMessages((prevUnread) => {
        const newUnread = { ...prevUnread };
        delete newUnread[roomId];
        return newUnread;
      });

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
      // No optimistic update. We will wait for the server to broadcast the message.
      socketRef.current.emit('sendMessage', messageData);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setActiveRoom(null);
  };

  const deleteChat = async () => {
    if (activeRoom) {
      try {
        await deleteChatHistory(activeRoom, token);
        setMessages((prevMessages) => {
          const newMessages = { ...prevMessages };
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
    unreadMessages,
    conversations,
    activeRoom,
    isChatOpen,
    recipient,
    joinRoom,
    sendMessage,
    closeChat,
    deleteChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatProvider };