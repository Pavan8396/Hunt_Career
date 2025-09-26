import React, { useContext, useState, useEffect, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { XIcon, TrashIcon } from '@heroicons/react/outline';
import { PaperAirplaneIcon } from '@heroicons/react/solid';

const Chatbox = () => {
  const {
    messages,
    isChatOpen,
    sendMessage,
    closeChat,
    recipient,
    deleteChat,
    activeJobTitle,
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [newMessage, setNewMessage] = useState('');
  const [visibleTimestamps, setVisibleTimestamps] = useState({});
  const chatboxRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const chatOpener = event.target.closest('[data-chat-opener="true"]');
      if (
        chatboxRef.current &&
        !chatboxRef.current.contains(event.target) &&
        !chatOpener
      ) {
        closeChat();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeChat]);

  if (!isChatOpen) return null;

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleTimestamp = (index) => {
    setVisibleTimestamps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getSenderId = (msg) => {
    return typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
  };

  return (
    <div
      ref={chatboxRef}
      className="fixed bottom-4 right-4 w-96 h-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col z-50"
    >
      <header className="bg-gray-50 dark:bg-gray-900 p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex-grow">
          <h3 className="font-bold text-md text-gray-800 dark:text-gray-100">
            {recipient}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
            RE: {activeJobTitle}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={deleteChat}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Delete chat"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          <button
            onClick={closeChat}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close chat"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow p-3 overflow-y-auto h-80 flex flex-col space-y-2">
        {messages.map((msg, index) => {
          const isSender = getSenderId(msg) === user._id;
          return (
            <div
              key={msg._id || index}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                onClick={() => toggleTimestamp(index)}
                className={`px-3 py-2 rounded-xl max-w-[75%] break-words cursor-pointer ${
                  isSender
                    ? 'bg-lime-200 text-black rounded-br-none'
                    : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                {visibleTimestamps[index] && (
                  <p
                    className={`text-xs mt-1 ${
                      isSender
                        ? 'text-gray-600 text-right'
                        : 'text-gray-500 dark:text-gray-400 text-left'
                    }`}
                  >
                    {formatTimestamp(msg.timestamp)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-gray-50 dark:bg-gray-900 p-3 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-2 text-sm border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="h-5 w-5 transform rotate-45" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chatbox;
