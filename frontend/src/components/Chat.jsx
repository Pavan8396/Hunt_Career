import React, { useContext, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

const Chat = () => {
  const { messages, recipient, sendMessage, closeChat, deleteChat } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Chat with {recipient}</h2>
        <div>
          <button onClick={deleteChat} className="px-4 py-2 mr-2 text-white bg-gray-500 rounded">
            Delete
          </button>
          <button onClick={closeChat} className="px-4 py-2 text-white bg-red-500 rounded">
            Close
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-grow p-4 overflow-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === user._id ? 'sent' : 'received'}`}
          >
            <p>
              <strong>{msg.sender === user._id ? 'You' : recipient}:</strong> {msg.text}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex p-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Type a message..."
        />
        <button type="submit" className="px-4 py-2 ml-2 text-white bg-blue-500 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;