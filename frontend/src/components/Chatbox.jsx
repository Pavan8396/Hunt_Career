import React, { useContext, useState, useEffect, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { XIcon } from '@heroicons/react/outline';

const Chatbox = () => {
  const { messages, isChatOpen, sendMessage, closeChat, recipient } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [newMessage, setNewMessage] = useState('');
  const chatboxRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle click outside to close chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      const chatOpener = event.target.closest('[data-chat-opener="true"]');
      if (chatboxRef.current && !chatboxRef.current.contains(event.target) && !chatOpener) {
        closeChat();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeChat]);

  if (!isChatOpen) {
    return null;
  }

  return (
    <div
      ref={chatboxRef}
      className="fixed bottom-4 right-4 w-96 h-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col z-50"
    >
      <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-200">Chat with {recipient}</h3>
        <button onClick={closeChat} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
          <XIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto h-80">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === user?._id ? 'text-right' : ''}`}>
            <div
              className={`inline-block p-2 rounded-lg ${
                msg.sender === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              {msg.text}
            </div>
            <div className="text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-2 border rounded-l-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="Type a message..."
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-lg">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbox;