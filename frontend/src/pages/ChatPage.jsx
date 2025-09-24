import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { getConversations, getChatHistory, deleteChatHistory, getUserById } from '../services/api';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user, token } = useContext(AuthContext);
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSelectConversation = useCallback(async (convo) => {
    setSelectedConversation(convo);
    if (convo) {
      try {
        const history = await getChatHistory(convo.roomId, token);
        setMessages(history);
        if (socketRef.current) {
          socketRef.current.emit('joinRoom', convo.roomId);
        }
      } catch (error) {
        console.error("Failed to fetch chat history", error);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (token) {
        try {
          const convos = await getConversations(token);
          setConversations(convos);
          if (location.state?.otherUserId) {
            const otherUserId = location.state.otherUserId;
            const existingConvo = convos.find(c => c.partner._id === otherUserId);
            if (existingConvo) {
              handleSelectConversation(existingConvo);
            } else {
              const partner = await getUserById(otherUserId, token);
              const newConvo = {
                roomId: [user._id, otherUserId].sort().join('_'),
                partner,
              };
              setConversations(prev => [newConvo, ...prev]);
              handleSelectConversation(newConvo);
            }
            // Clear location state after handling it
            navigate(location.pathname, { replace: true });
          }
        } catch (error) {
          console.error("Failed to fetch conversations", error);
        }
      }
    };
    fetchConversations();
  }, [token, location.state, handleSelectConversation, user, navigate]);

  useEffect(() => {
    if (user && token) {
      const socket = io('http://localhost:5000', { query: { token } });
      socketRef.current = socket;

      socket.on('receiveMessage', (data) => {
        if (selectedConversation && data.roomId === selectedConversation.roomId) {
          setMessages(prev => [...prev, data]);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user, token, selectedConversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversation && socketRef.current) {
      const messageData = {
        roomId: selectedConversation.roomId,
        sender: user._id,
        text: newMessage,
        timestamp: new Date(),
      };
      socketRef.current.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };

  const handleDeleteHistory = async () => {
    if (selectedConversation) {
      await deleteChatHistory(selectedConversation.roomId, token);
      setMessages([]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-1/3 border-r bg-gray-50 dark:bg-gray-800">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Conversations</h2>
        </div>
        <ul className="overflow-y-auto">
          {conversations.map((convo) => (
            <li
              key={convo.roomId}
              className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedConversation?.roomId === convo.roomId ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
              onClick={() => handleSelectConversation(convo)}
            >
              <p className="font-semibold">{convo.partner.name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedConversation.partner.name}</h2>
              <button onClick={handleDeleteHistory} className="text-red-500 hover:text-red-700">Delete Chat</button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.sender === user._id ? 'text-right' : ''}`}>
                  <div className={`inline-block p-2 rounded-lg ${msg.sender === user._id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow p-2 border rounded-l-lg"
                  placeholder="Type a message..."
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-lg">Send</button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;