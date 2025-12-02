import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MoonIcon, MenuIcon, XIcon, BellIcon, UserCircleIcon, LogoutIcon } from '@heroicons/react/outline';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { toast } from 'react-toastify';
import Dropdown from './common/Dropdown';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [userInitials, setUserInitials] = useState('');

  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { isAuthenticated, user, userType, logout } = useContext(AuthContext);
  const { notifications } = useContext(ChatContext);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const hideAuthLinksPaths = ['/', '/login', '/signup', '/employer/login', '/employer/signup'];

  const totalUnread = notifications.reduce((sum, notif) => sum + notif.count, 0);

  useEffect(() => {
    if (isAuthenticated && user) {
      const name = user.name || user.companyName || '';
      const nameParts = name.split(' ');
      const initials =
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : name.slice(0, 2).toUpperCase() || 'U';
      setUserInitials(initials);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        //setIsDropdownOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target))
        setIsMobileMenuOpen(false);
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      )
        setIsNotificationOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => setShowConfirm(true);

  const handleConfirmLogout = () => {
    const type = userType;
    logout();
    //setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setShowConfirm(false);
    toast.success('Logged out successfully!');
    navigate(type === 'employer' ? '/employer/login' : '/login');
  };

  const handleCancelLogout = () => setShowConfirm(false);

  const handleNotificationClick = (notification) => {
    const { applicationId, senderName, jobId, jobTitle } = notification;
    const path =
      userType === 'employer'
        ? `/employer/jobs/${jobId}/applicants`
        : '/applied';
    navigate(path, {
      state: {
        chatToOpen: { applicationId, recipientName: senderName, jobTitle },
      },
    });
    setIsNotificationOpen(false);
  };

  const UserMenu = () => (
    <>
      <div className="relative" ref={notificationRef}>
        <button
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className="relative text-white hover:text-gray-200 focus:outline-none"
          aria-label="Notifications"
        >
          <BellIcon className="h-6 w-6" />
          {totalUnread > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
              {totalUnread}
            </span>
          )}
        </button>
        {isNotificationOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="p-4 font-bold border-b dark:border-gray-600">
              Notifications
            </div>
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <div
                  key={`${notif.senderId}-${notif.jobId}-${index}`}
                  onClick={() => handleNotificationClick(notif)}
                  className="p-4 border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                >
                  <div className="font-semibold">{notif.senderName}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {notif.lastMessage}
                  </div>
                  <div className="text-xs text-blue-500 mt-1">
                    {notif.count} new messages
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No new notifications
              </div>
            )}
          </div>
        )}
      </div>
      <Dropdown
        trigger={
          <button className="flex items-center space-x-2 focus:outline-none">
            <span className="w-10 h-10 bg-blue-200 text-blue-800 flex items-center justify-center rounded-full font-bold">
              {userInitials}
            </span>
          </button>
        }
      >
        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b dark:border-gray-600">
          Signed in as <br />
          <span className="font-semibold">{user.name || user.companyName}</span>
        </div>
        <Link
          to={userType === 'employer' ? '/employer/profile' : '/profile'}
          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <UserCircleIcon className="h-5 w-5 mr-2" />
          My Profile
        </Link>
        <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
        <Link
          to="/about"
          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          Contact
        </Link>
        <Link
          to="/privacy"
          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          Privacy Policy
        </Link>
        <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
        <button
          onClick={toggleDarkMode}
          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <MoonIcon className="h-5 w-5 mr-2" />
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-600"
        >
          <LogoutIcon className="h-5 w-5 mr-2" />
          Logout
        </button>
      </Dropdown>
    </>
  );

  const MobileMenu = () => (
    <div
      className="md:hidden absolute top-16 right-4 w-48 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
      ref={mobileMenuRef}
    >
      {isAuthenticated ? (
        <>
          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
            Welcome, {user.name || user.companyName}
          </div>
          <Link
            to="/about"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/privacy"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Privacy Policy
          </Link>
          <button
            onClick={toggleDarkMode}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
          >
            <MoonIcon className="h-5 w-5 mr-2" />
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </>
      ) : (
        !hideAuthLinksPaths.includes(location.pathname) && (
          <>
            <Link
              to="/login"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Signup
            </Link>
          </>
        )
      )}
    </div>
  );

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md dark:bg-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to={
            isAuthenticated && userType === 'employer'
              ? '/employer/dashboard'
              : '/'
          }
          className="flex items-center space-x-2 text-xl font-bold hover:text-gray-200 transition"
        >
          <img src={logo} alt="Hunt-Career-Logo" className="h-8 w-8" />
          <span>Hunt-Career</span>
        </Link>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            !hideAuthLinksPaths.includes(location.pathname) && (
              <>
                <Link to="/login" className="hover:text-gray-200 transition">
                  Login
                </Link>
                <Link to="/signup" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition">
                  Signup
                </Link>
              </>
            )
          )}
        </div>
        {isMobileMenuOpen && <MobileMenu />}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
                Confirm Logout
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to logout?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancelLogout}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  aria-label="Cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition"
                  aria-label="Confirm Logout"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;