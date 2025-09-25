import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Chatbox from './Chatbox';

const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
      <Chatbox />
    </div>
  );
};

export default AuthenticatedLayout;