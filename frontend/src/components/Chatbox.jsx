import React, { useContext, useState, useEffect, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { XIcon, TrashIcon } from '@heroicons/react/outline';

const Chatbox = () => {
  const {
    messages,
    isChatOpen,
    sendMessage,
    closeChat,
    recipient,
    deleteChat,
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
      className="fixed bottom-4 right-4 w-96 h-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col z-50"
    >
      <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-200">
          Chat with {recipient}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={deleteChat}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Delete chat"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          <button
            onClick={closeChat}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Close chat"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 overflow-y-auto h-80 flex flex-col space-y-3">
        {messages.map((msg, index) => {
          const isSender = getSenderId(msg) === user._id;
          return (
            <div
              key={msg._id || index}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                onClick={() => toggleTimestamp(index)}
                className={`px-4 py-2 rounded-2xl max-w-[75%] break-words cursor-pointer ${
                  isSender
                    ? 'bg-lime-200 text-black rounded-br-none'
                    : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
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

      <footer className="p-4 border-t dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-2 border rounded-l-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-lime-400"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-lime-300 hover:bg-lime-400 text-black rounded-r-lg"
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chatbox;
