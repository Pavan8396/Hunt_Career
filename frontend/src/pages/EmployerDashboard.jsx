import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getEmployerJobs, getEmployerApplications, getApplicationsOverTimeStats, getJobPostingsSummaryStats } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [applicationsOverTime, setApplicationsOverTime] = useState([]);
  const [jobPostingsSummary, setJobPostingsSummary] = useState([]);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          employerJobs,
          allApplications,
          appsOverTime,
          jobPostingStats,
        ] = await Promise.all([
          getEmployerJobs(token),
          getEmployerApplications(token),
          getApplicationsOverTimeStats(token),
          getJobPostingsSummaryStats(token),
        ]);
        setJobs(employerJobs);
        setTotalApplications(allApplications.length);
        setApplicationsOverTime(appsOverTime);
        setJobPostingsSummary(jobPostingStats);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
          <h3 className="text-lg font-semibold mb-4">Applications Over Time (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Job Postings by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobPostingsSummary}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="_id"
              >
                {jobPostingsSummary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
