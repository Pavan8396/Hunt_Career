import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getEmployerJobs, getEmployerApplications, getApplicationsOverTime, getJobPostingsSummary } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [applicationsOverTime, setApplicationsOverTime] = useState([]);
  const [jobPostingsSummary, setJobPostingsSummary] = useState([]);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [employerJobs, allApplications, applicationsTime, jobSummary] = await Promise.all([
          getEmployerJobs(token),
          getEmployerApplications(token),
          getApplicationsOverTime(token),
          getJobPostingsSummary(token)
        ]);
        setJobs(employerJobs);
        setTotalApplications(allApplications.length);
        setApplicationsOverTime(applicationsTime);
        setJobPostingsSummary(jobSummary);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name || 'Employer'}!</h1>

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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">Applications Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">Job Postings by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobPostingsSummary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
