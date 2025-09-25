import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  getEmployerJobs, 
  getEmployerApplications, 
  getApplicationsOverTime, 
  getJobPostingsSummary, 
  getRecentActivity 
} from '../services/api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { BriefcaseIcon, DocumentTextIcon, HashtagIcon } from '@heroicons/react/outline';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [applicationsOverTime, setApplicationsOverTime] = useState([]);
  const [jobPostingsSummary, setJobPostingsSummary] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [employerJobs, allApplications, applicationsTime, jobSummary, activity] = await Promise.all([
          getEmployerJobs(token),
          getEmployerApplications(token),
          getApplicationsOverTime(token),
          getJobPostingsSummary(token),
          getRecentActivity(token),
        ]);
        setJobs(employerJobs);
        setTotalApplications(allApplications.length);
        setApplicationsOverTime(applicationsTime);
        setJobPostingsSummary(jobSummary);
        setRecentActivity(activity);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    if (token) fetchDashboardData();
  }, [token]);

  const avgApplicationsPerJob = totalApplications > 0 && jobs.length > 0 
    ? (totalApplications / jobs.length).toFixed(1) 
    : 0;

  const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center hover:shadow-lg transition-shadow">
      <div className={`p-3 rounded-full ${color} text-white`}>{icon}</div>
      <div className="ml-4">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name || 'Employer'}!</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={<BriefcaseIcon className="h-8 w-8" />} title="Total Jobs Posted" value={jobs.length} color="bg-blue-500" />
        <StatCard icon={<DocumentTextIcon className="h-8 w-8" />} title="Total Applications" value={totalApplications} color="bg-indigo-500" />
        <StatCard icon={<HashtagIcon className="h-8 w-8" />} title="Avg. Apps per Job" value={avgApplicationsPerJob} color="bg-pink-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Area Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md min-w-0">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">Applications Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={applicationsOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} applications`, 'Applications']} />
              <Area type="monotone" dataKey="count" stroke="#16a34a" fillOpacity={1} fill="url(#colorApplications)" animationDuration={500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md min-w-0">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">Job Postings by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobPostingsSummary}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                dataKey="count"
                paddingAngle={4}
                animationDuration={500}
              >
                {jobPostingsSummary.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#6EE7B7', '#FBBF24', '#60A5FA', '#F87171'][index % 4]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  const total = jobPostingsSummary.reduce((acc, item) => acc + item.count, 0);
                  const percent = ((value / total) * 100).toFixed(1);
                  return [`${value} (${percent}%)`, name];
                }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity._id} className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-md font-semibold text-gray-600 dark:text-gray-300">
                    {activity.applicant.firstName.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  <span className="font-bold">{activity.applicant.firstName} {activity.applicant.lastName}</span> applied for <span className="font-semibold">{activity.job.title}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
