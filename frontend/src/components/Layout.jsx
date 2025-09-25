import React from 'react';
import Navbar from './Navbar';
import Chatbox from './Chatbox';

const Layout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow overflow-y-auto">{children}</main>
      <Chatbox />
    </div>
  );
};

export default Layout;