import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { login as apiLogin } from '../services/api'; // Import the login function
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = formData;
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const setError = (message) => {
    setErrorMessage(message);
    toast.error(message);
  };

  const validateForm = () => {
    // Email validations
    if (!email.trim()) {
      setError('Email is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Password validations
    if (!password.trim()) {
      setError('Password is required.');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (password.length > 20) {
      setError('Password can not be more than 20 characters long.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Replace fetch call with apiLogin
      const data = await apiLogin(email, password);
      // The login function from api.js already returns JSON data directly
      // and throws an error if response is not ok.

      // Call AuthContext login
      login(data.token, data.user, 'user');
      toast.success('Logged in successfully!');
      navigate('/home');
    } catch (error) {
      // apiLogin already calls toast.error, so we just need to set our local error message.
      // Ensure error.message is a string.
      const message = typeof error.message === 'string' ? error.message : 'An unexpected error occurred.';
      // The error message from apiLogin might already be user-friendly.
      // If it's a generic "Login failed: Network Error" or similar, we might want a more specific one.
      // For now, let's use the message from the caught error, which should be descriptive.
      setError(message.replace('Login failed: ', '')); // Remove prefix if present for cleaner UI
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 transition duration-200 ease-in-out hover:border-blue-400 dark:hover:border-blue-500";
  const labelClass = "block text-gray-600 dark:text-gray-300 mb-2 font-medium";
  const iconClass = "absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500";
  const eyeIconClass = "absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 cursor-pointer";
  const buttonClass = "w-full py-3 rounded-lg text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center";

  const renderInput = (id, label, type, value, icon, showToggle = false, toggleState = false, setToggle = () => {}) => (
    <div className="mb-5 relative">
      <label className={labelClass} htmlFor={id}>{label}</label>
      <div className="relative">
        <span className={iconClass}>{icon}</span>
        <input
          type={showToggle && toggleState ? 'text' : type}
          id={id}
          value={value}
          onChange={handleChange}
          className={inputClass}
          placeholder={`Enter your ${label.toLowerCase()}`}
          aria-label={label}
        />
        {showToggle && (
          <span className={eyeIconClass} onClick={() => setToggle(!toggleState)}>
            {toggleState ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>
    </div>
  );

  const renderLoadingButton = (text, loadingText) => (
    <>
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </>
      ) : (
        text
      )}
    </>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
      style={{ backgroundImage: `url('/images/career-background.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="max-w-md w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800 dark:text-gray-100">Login</h2>
        <form onSubmit={handleSubmit} noValidate>
          {renderInput('email', 'Email', 'email', email, <FaEnvelope />)}
          {renderInput('password', 'Password', 'password', password, <FaLock />, true, showPassword, setShowPassword)}

          {errorMessage && <p className="text-red-500 text-sm mb-5 dark:text-red-400 text-center">{errorMessage}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`${buttonClass} ${isLoading ? 'bg-blue-400 cursor-not-allowed dark:bg-blue-500' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900'}`}
            aria-label="Login"
            tabIndex={0}
          >
            {renderLoadingButton('Login', 'Logging in...')}
          </button>
        </form>
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 relative inline-block group" aria-label="Sign up">
              Sign up
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;