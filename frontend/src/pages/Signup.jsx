import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { signup as apiSignup } from '../services/api'; // Correct import
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [navigationError, setNavigationError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    console.log(`[Effect] Step changed to ${step}`);
    setNavigationError('');
    setSubmissionError('');
    setHasSubmitted(false);
  }, [step]);

  const validateNavigation = () => {
    console.log(`[Validate] Validating navigation for step ${step}`);
    if (step === 1) {
      if (!firstName.trim()) {
        return 'First Name is required.';
      }
      if (!lastName.trim()) {
        return 'Last Name is required.';
      }
    } else if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) {
        return 'Email is required.';
      }
      if (!emailRegex.test(email)) {
        return 'Please enter a valid email address.';
      }
      if (password.length < 8) {
        return 'Password must be at least 8 characters long.';
      }
      if (password !== confirmPassword) {
        return 'Passwords do not match.';
      }
    }
    return true; // Validation passed
  };

  const validateSubmission = () => {
    console.log('[Validate] Validating submission for step 3');
    const phoneRegex = /^\d{10}$/;
    if (!phoneNumber.trim()) {
      return 'Phone Number is required.';
    }
    if (!phoneRegex.test(phoneNumber)) {
      return 'Please enter a valid 10-digit phone number.';
    }
    return null; // No error
  };

  const handleNext = () => {

    const validationResult = validateNavigation();
    if (validationResult === true) {
      setNavigationError('');
      setStep(step + 1);
    } else {
      setNavigationError(validationResult);
    }
  };

  const handlePrevious = () => {
    console.log('[Handle] handlePrevious called');
    setNavigationError('');
    setSubmissionError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setHasSubmitted(true);

    const validationError = validateSubmission();
    if (validationError) {
      setSubmissionError(validationError);
      return;
    }

    setIsLoading(true);
    setSubmissionError('');

    try {
      logout(); // Assuming this is intentional to clear any existing session.
      // Replace fetch call with apiSignup
      await apiSignup(firstName, lastName, email, password, phoneNumber);
      // apiSignup will throw an error if not successful, which is caught below.
      // If successful, it means registration was okay.

      toast.success('Registered successfully! Please login.');
      navigate('/login');
    } catch (error) {
      // apiSignup already calls toast.error. We just need to set our local submission error.
      // Ensure error.message is a string.
      const message = typeof error.message === 'string' ? error.message : 'An unexpected error occurred.';
      // Remove "Signup failed: " prefix if present for cleaner UI, similar to Login page.
      setSubmissionError(message.replace('Signup failed: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-16"
      style={{
        backgroundImage: `url('/images/career-background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-md w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800 dark:text-gray-100">Sign Up</h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          Step {step} of 3
        </p>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div>
            <div className="mb-5 relative">
              <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium" htmlFor="firstName">
                First Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                  <FaUser />
                </span>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 transition duration-200 ease-in-out hover:border-blue-400 dark:hover:border-blue-500"
                  placeholder="Enter your first name"
                  aria-label="First Name"
                />
              </div>
            </div>
            <div className="mb-5 relative">
              <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium" htmlFor="lastName">
                Last Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                  <FaUser />
                </span>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 transition duration-200 ease-in-out hover:border-blue-400 dark:hover:border-blue-500"
                  placeholder="Enter your last name"
                  aria-label="Last Name"
                />
              </div>
            </div>

            {navigationError && (
              <p className="text-red-500 text-sm mb-5 dark:text-red-400 text-center">{navigationError}</p>
            )}

            <div className="flex justify-end mb-5">
              <button
                type="button"
                onClick={handleNext}
                className="py-2 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 transition duration-200 ease-in-out"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Account Information */}
        {step === 2 && (
          <div>
            <div className="mb-5 relative">
              <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 transition duration-200 ease-in-out hover:border-blue-400 dark:hover:border-blue-500"
                  placeholder="Enter your email"
                  aria-label="Email"
                />
              </div>
            </div>
            <div className="mb-5 relative">
              <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 transition duration-200 ease-in-out hover:border-blue-400 dark:hover:border-blue-500"
                  placeholder="Enter your password"
                  aria-label="Password"
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="mb-5 relative">
              <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                  <FaLock />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 transition duration-200 ease-in-out hover:border-blue-400 dark:hover:border-blue-500"
                  placeholder="Confirm your password"
                  aria-label="Confirm Password"
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {navigationError && (
              <p className="text-red-500 text-sm mb-5 dark:text-red-400 text-center">{navigationError}</p>
            )}

            <div className="flex justify-between mb-5">
              <button
                type="button"
                onClick={handlePrevious}
                className="py-2 px-4 rounded-lg text-gray-700 dark:text-gray-200 font-semibold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200 ease-in-out"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="py-2 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 transition duration-200 ease-in-out"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Information */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="mb-5 relative">
              <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium" htmlFor="phoneNumber">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                  <FaPhone />
                </span>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 transition duration-200 ease-in-out hover:border-blue-400 dark:hover:border-blue-500"
                  placeholder="Enter your phone number (10 digits)"
                  aria-label="Phone Number"
                />
              </div>
            </div>

            {hasSubmitted && submissionError && (
              <p className="text-red-500 text-sm mb-5 dark:text-red-400 text-center">{submissionError}</p>
            )}

            <div className="flex justify-between mb-5">
              <button
                type="button"
                onClick={handlePrevious}
                className="py-2 px-4 rounded-lg text-gray-700 dark:text-gray-200 font-semibold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200 ease-in-out"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`py-2 px-4 rounded-lg text-white font-semibold transition duration-200 ease-in-out flex items-center justify-center ${
                  isLoading
                    ? 'bg-blue-400 cursor-not-allowed dark:bg-blue-500'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900'
                }`}
                aria-label="Sign up"
                tabIndex={0}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing up...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 relative inline-block group"
              aria-label="Log in"
            >
              Log in
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;