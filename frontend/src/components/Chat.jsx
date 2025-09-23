import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chat = ({ applicant, employer }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socket = io('http://localhost:5000');
  const user = JSON.parse(sessionStorage.getItem('user'));

  const roomId = [user._id, applicant._id].sort().join('_');

  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [roomId, socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        roomId,
        sender: user._id,
        text: message,
        timestamp: new Date(),
      };
      socket.emit('sendMessage', messageData);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col">
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="font-semibold text-lg">Chat with {applicant.firstName} {applicant.lastName}</h3>
      </div>
      <div className="flex-grow p-4 overflow-y-auto h-64">
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
  );
};

export default Chat;
