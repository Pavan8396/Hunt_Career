import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getEmployerJobs, getEmployerApplications, getApplicationsOverTime, getJobPostingsSummary } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationsOverTime, setApplicationsOverTime] = useState([]);
  const [jobPostingsSummary, setJobPostingsSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [
          employerJobs,
          allApplications,
          appsOverTimeData,
          jobSummaryData,
        ] = await Promise.all([
          getEmployerJobs(token),
          getEmployerApplications(token),
          getApplicationsOverTime(token),
          getJobPostingsSummary(token),
        ]);
        setJobs(employerJobs);
        setApplications(allApplications);
        setApplicationsOverTime(appsOverTimeData);
        setJobPostingsSummary(jobSummaryData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const recentApplications = applications.slice(0, 5);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Welcome, {user?.name || 'Employer'}!</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Jobs Posted</h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{jobs.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Applications</h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{applications.length}</p>
        </div>
        {/* Add more stats cards if needed */}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Applications Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={applicationsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Job Postings by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobPostingsSummary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Recent Applications</h3>
        {recentApplications.length > 0 ? (
          <ul>
            {recentApplications.map((app) => (
              <li key={app._id} className="border-b dark:border-gray-700 py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{app.user.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Applied for: <Link to={`/jobs/${app.job._id}`} className="text-blue-600 hover:underline">{app.job.title}</Link></p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No recent applications.</p>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
