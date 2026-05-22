import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  getApplicationsOverTime, 
  getJobPostingsSummary, 
  getRecentActivity,
  getEmployerDashboardMetrics
} from '../services/api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
  BriefcaseIcon,
  DocumentTextIcon,
  HashtagIcon,
  UserGroupIcon,
  ClipboardCheckIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChatAlt2Icon,
  ClockIcon
} from '@heroicons/react/outline';

const EmployerDashboard = () => {
  const [applicationsOverTime, setApplicationsOverTime] = useState([]);
  const [jobPostingsSummary, setJobPostingsSummary] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [metrics, setMetrics] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeCandidates: 0,
    activeRequests: 0,
    interviewScheduled: 0,
    interviewCompleted: 0,
    feedbackGiven: 0,
    feedbackPending: 0,
    stageSummary: []
  });
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [applicationsTime, jobSummary, activity, dashboardMetrics] = await Promise.all([
          getApplicationsOverTime(token),
          getJobPostingsSummary(token),
          getRecentActivity(token),
          getEmployerDashboardMetrics(token),
        ]);
        setApplicationsOverTime(applicationsTime);
        setJobPostingsSummary(jobSummary);
        setRecentActivity(activity);
        setMetrics(dashboardMetrics);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    if (token) fetchDashboardData();
  }, [token]);

  const avgApplicationsPerJob = metrics.totalApplications > 0 && metrics.totalJobs > 0
    ? (metrics.totalApplications / metrics.totalJobs).toFixed(1)
    : 0;

  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center hover:shadow-md transition-shadow">
      <div className={`p-2 rounded-lg ${color} text-white shrink-0`}>{React.cloneElement(icon, { className: 'h-5 w-5' })}</div>
      <div className="ml-2 min-w-0">
        <h3 className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-tight truncate">{title}</h3>
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-none">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Employer Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatCard icon={<BriefcaseIcon className="h-8 w-8" />} title="Total Jobs Posted" value={metrics.totalJobs} color="bg-blue-500" />
        <StatCard icon={<DocumentTextIcon className="h-8 w-8" />} title="Total Applications" value={metrics.totalApplications} color="bg-indigo-500" />
        <StatCard icon={<HashtagIcon className="h-8 w-8" />} title="Avg. Apps per Job" value={avgApplicationsPerJob} color="bg-pink-500" />
        <StatCard icon={<UserGroupIcon className="h-8 w-8" />} title="Active Candidates" value={metrics.activeCandidates} color="bg-green-500" />
        <StatCard icon={<ClipboardCheckIcon className="h-8 w-8" />} title="Active Requests" value={metrics.activeRequests} color="bg-yellow-500" />
        <StatCard icon={<CalendarIcon className="h-8 w-8" />} title="Interviews Scheduled" value={metrics.interviewScheduled} color="bg-purple-500" />
        <StatCard icon={<CheckCircleIcon className="h-8 w-8" />} title="Interviews Completed" value={metrics.interviewCompleted} color="bg-teal-500" />
        <StatCard icon={<ChatAlt2Icon className="h-8 w-8" />} title="Feedback Given" value={metrics.feedbackGiven} color="bg-orange-500" />
        <div className="cursor-pointer" onClick={() => navigate('/employer/posted-jobs')}>
          <StatCard icon={<ClockIcon className="h-8 w-8" />} title="Feedback Pending" value={metrics.feedbackPending} color="bg-red-400" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 min-w-0">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">Applications Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={applicationsOverTime} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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

        {/* Candidate Stage Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 min-w-0">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">Candidate Stage Summary</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={metrics.stageSummary}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                dataKey="value"
                paddingAngle={4}
                animationDuration={500}
              >
                {metrics.stageSummary.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  const total = metrics.stageSummary.reduce((acc, item) => acc + item.value, 0);
                  const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return [`${value} (${percent}%)`, name];
                }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Postings by Type Bar Chart */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 min-w-0">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">Jobs by Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={jobPostingsSummary}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hiring Funnel (Simplified) */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 min-w-0">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">Hiring Funnel</h3>
          <div className="space-y-3">
            {[
              { label: 'Total Applications', value: metrics.totalApplications, color: 'bg-indigo-500' },
              { label: 'Interviewed', value: metrics.interviewScheduled + metrics.interviewCompleted, color: 'bg-purple-500' },
              { label: 'Identified / Offered', value: (metrics.stageSummary.find(s => s.name === 'Candidate Identified')?.value || 0) + (metrics.stageSummary.find(s => s.name === 'Offered')?.value || 0), color: 'bg-teal-500' },
            ].map((step, index) => {
              const percentage = metrics.totalApplications > 0 ? (step.value / metrics.totalApplications) * 100 : 0;
              return (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{step.label}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{step.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className={`${step.color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity._id} className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-md font-semibold text-gray-600 dark:text-gray-300">
                      {activity.applicant?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    <span className="font-bold">{activity.applicant?.firstName} {activity.applicant?.lastName}</span> applied for <span className="font-semibold">{activity.job?.title}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
