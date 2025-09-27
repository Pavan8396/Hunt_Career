import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { employerSignup } from '../services/api';
import { FaBuilding, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { isValidEmail } from '../utils/validation';

const EmployerSignup = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { companyName, email, password, confirmPassword } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const setError = (message) => {
    setErrorMessage(message);
    toast.error(message);
  };

  const validateForm = () => {
    if (!companyName.trim()) {
      setError('Company Name is required.');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required.');
      return false;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
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
      await employerSignup(companyName, email, password);
      toast.success('Registered successfully! Please login.');
      navigate('/employer/login');
    } catch (error) {
      const message = typeof error.message === 'string' ? error.message : 'An unexpected error occurred.';
      setError(message.replace('Signup failed: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 transition duration-200 ease-in-out hover:border-blue-400 dark:hover:border-blue-500";
  const labelClass = "block text-gray-600 dark:text-gray-300 mb-2 font-medium";
  const iconClass = "absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500";
  const eyeIconClass = "absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 cursor-pointer";
  const buttonClass = "w-full py-3 rounded-lg text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
      style={{ backgroundImage: `url('/images/career-background.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="max-w-md w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800 dark:text-gray-100">Employer Signup</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5 relative">
            <label className={labelClass} htmlFor="companyName">Company Name</label>
            <div className="relative">
              <span className={iconClass}><FaBuilding /></span>
              <input type="text" id="companyName" value={companyName} onChange={handleChange} className={inputClass} placeholder="Enter your company name" />
            </div>
          </div>
          <div className="mb-5 relative">
            <label className={labelClass} htmlFor="email">Email</label>
            <div className="relative">
              <span className={iconClass}><FaEnvelope /></span>
              <input type="email" id="email" value={email} onChange={handleChange} className={inputClass} placeholder="Enter your email" />
            </div>
          </div>
          <div className="mb-5 relative">
            <label className={labelClass} htmlFor="password">Password</label>
            <div className="relative">
              <span className={iconClass}><FaLock /></span>
              <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={handleChange} className={inputClass} placeholder="Enter your password" />
              <span className={eyeIconClass} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="mb-5 relative">
            <label className={labelClass} htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <span className={iconClass}><FaLock /></span>
              <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={handleChange} className={inputClass} placeholder="Confirm your password" />
              <span className={eyeIconClass} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {errorMessage && <p className="text-red-500 text-sm mb-5 dark:text-red-400 text-center">{errorMessage}</p>}

          <button type="submit" disabled={isLoading} className={`${buttonClass} ${isLoading ? 'bg-blue-400 cursor-not-allowed dark:bg-blue-500' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900'}`}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link to="/employer/login" className="text-blue-600 dark:text-blue-400 relative inline-block group">
              Log in
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignup;
