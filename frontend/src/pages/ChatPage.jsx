import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);
  const { employerId } = useParams();
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    if (user && employerId) {
      const roomId = [user._id, employerId].sort().join('_');
      socketRef.current.emit('joinRoom', roomId);

      const handleReceiveMessage = (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      };

      socketRef.current.on('receiveMessage', handleReceiveMessage);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, employerId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socketRef.current && user && employerId) {
      const roomId = [user._id, employerId].sort().join('_');
      const messageData = {
        roomId,
        sender: user._id,
        text: message,
        timestamp: new Date(),
      };
      socketRef.current.emit('sendMessage', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]); // Optimistically update UI
      setMessage('');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-gray-800/50 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="font-semibold text-lg">Chat with Employer</h3>
        </div>
        <div className="flex-grow p-4 overflow-y-auto h-96">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender === user._id ? 'text-right' : ''}`}>
              <div className={`inline-block p-2 rounded-lg ${msg.sender === user._id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                {msg.text}
              </div>
              <div className="text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="p-4 border-t dark:border-gray-700">
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow p-2 border rounded-l-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Type a message..."
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-lg">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
