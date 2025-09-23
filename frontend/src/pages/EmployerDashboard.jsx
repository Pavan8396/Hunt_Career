import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getEmployerJobs, getEmployerApplications } from '../services/api';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [employerJobs, allApplications] = await Promise.all([
          getEmployerJobs(token),
          getEmployerApplications(token)
        ]);
        setJobs(employerJobs);
        setTotalApplications(allApplications.length);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const { username } = useContext(AuthContext);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {username}!</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Jobs Posted</h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{jobs.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Applications</h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{totalApplications}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
