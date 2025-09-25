import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoonIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { isAuthenticated, user, userType, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [userInitials, setUserInitials] = useState('');

  // Compute user initials based on user
  useEffect(() => {
    if (isAuthenticated && user) {
      const nameParts = user.name ? user.name.split(' ') : [];
      const initials =
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : user.name ? user.name.slice(0, 2).toUpperCase() : 'U';
      setUserInitials(initials);
    }
  }, [isAuthenticated, user]);

  // Handle outside clicks to close dropdown and mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {

        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {

        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const handleConfirmLogout = () => {
    const type = userType;
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setShowConfirm(false);
    toast.success('Logged out successfully!');
    if (type === 'employer') {
      navigate('/employer/login');
    } else {
      navigate('/login');
    }
  };

  const handleCancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md dark:bg-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to={isAuthenticated && userType === 'employer' ? '/employer/dashboard' : '/'} className="text-xl font-bold hover:text-gray-200 transition">
          Hunt-Career
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => {

            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>

        {/* Desktop Menu and User Icon */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {

                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 p-2 rounded-full focus:outline-none transition"
                aria-label="Open user menu"
              >
                <span className="w-8 h-8 bg-blue-200 text-blue-800 flex items-center justify-center rounded-full">
                  {userInitials || 'U'}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  {userType === 'employer' ? (
                    <>
                      {/* Employer-specific links are in the sidebar, so we keep this menu minimal */}
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        Welcome, {user.name}
                      </div>
                      <Link
                        to="/chat"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Chat
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/home"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Home
                      </Link>
                      <Link
                        to="/saved"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Saved Jobs
                      </Link>
                      <Link
                        to="/applied"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Applied Jobs
                      </Link>
                      <Link
                        to="/chat"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Chat
                      </Link>
                    </>
                  )}
                  <Link
                    to="/about"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link
                    to="/privacy"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => setIsDropdownOpen(false)}
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
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-200 transition">
                Login
              </Link>
              <Link to="/signup" className="hover:text-gray-200 transition">
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden absolute top-16 right-4 w-48 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
            ref={mobileMenuRef}
          >
            {isAuthenticated ? (
              <>
                {userType === 'employer' ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      Welcome, {user.name}
                    </div>
                    <Link
                      to="/chat"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Chat
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/home"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      to="/saved"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Saved Jobs
                    </Link>
                    <Link
                      to="/applied"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Applied Jobs
                    </Link>
                    <Link
                      to="/chat"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Chat
                    </Link>
                  </>
                )}
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
            )}
          </div>
        )}

        {/* Custom Confirmation Dialog */}
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