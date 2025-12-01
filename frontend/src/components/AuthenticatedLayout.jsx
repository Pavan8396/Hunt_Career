import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Chatbox from './Chatbox';

const AuthenticatedLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-56'}`}>
          {children}
        </main>
      </div>
      <Chatbox />
    </div>
  );
};

export default AuthenticatedLayout;