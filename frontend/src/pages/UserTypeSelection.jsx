import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserTypeSelection = () => {
  const navigate = useNavigate();

  const handleSelection = (userType) => {
    if (userType === 'job_seeker') {
      navigate('/home');
    } else if (userType === 'employer') {
      navigate('/employer/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Welcome to Hunt Career</h1>
      <div className="flex space-x-8">
        <div
          className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300"
          onClick={() => handleSelection('job_seeker')}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">I am a Job Seeker</h2>
          <p className="text-gray-600 dark:text-gray-300">Find your dream job</p>
        </div>
        <div
          className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300"
          onClick={() => handleSelection('employer')}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">I am an Employer</h2>
          <p className="text-gray-600 dark:text-gray-300">Hire the best talent</p>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
