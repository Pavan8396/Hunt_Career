import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { getUserApplications } from '../services/api';
import SkeletonCard from '../components/SkeletonCard';
import { ChatIcon, SortAscendingIcon, SortDescendingIcon, SelectorIcon } from '@heroicons/react/outline';
import { useSortableData } from '../hooks/useSortableData';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useContext(AuthContext);
  const { openChatForApplication } = useContext(ChatContext);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchAppliedJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No token found');
      const data = await getUserApplications(token);
      setApplications(data);
    } catch (err) {
      setError('Failed to load applied jobs. Please try again.');
      toast.error('Failed to load applied jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      fetchAppliedJobs();
    }
  }, [user, fetchAppliedJobs]);

  useEffect(() => {
    const openChatFromState = () => {
      const { state } = location;
      if (state?.chatToOpen) {
        const { applicationId, recipientName, jobTitle } = state.chatToOpen;
        openChatForApplication(applicationId, recipientName, jobTitle);
        // Clear the state to prevent re-triggering on navigation
        navigate(location.pathname, { replace: true, state: {} });
      }
    };
    openChatFromState();
  }, [location, openChatForApplication, navigate]);

  const openChat = (application) => {
    if (!application.job || !application.job.employer) {
      toast.error('Cannot open chat. Employer details are missing.');
      return;
    }
    const recipientName =
      application.job.employer.companyName || 'the employer';
    openChatForApplication(application._id, recipientName, application.job.title);
  };

  const { items: sortedApplications, requestSort, sortConfig } = useSortableData(applications, { key: 'date', direction: 'descending' });

  if (loading) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">
          Applied Jobs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <Link
          to="/home"
          className="text-blue-600 hover:underline mt-4 inline-block dark:text-blue-400"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">
        Applied Jobs
      </h2>
      {applications.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            You have not applied for any jobs yet.
          </p>
          <Link
            to="/home"
            className="text-blue-600 hover:underline mt-4 inline-block dark:text-blue-400"
          >
            ← Find Jobs
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('job.title')}>
                  Job Title {sortConfig.key === 'job.title' ? (sortConfig.direction === 'ascending' ? <SortAscendingIcon className="inline-block h-5 w-5" /> : <SortDescendingIcon className="inline-block h-5 w-5" />) : <SelectorIcon className="inline-block h-5 w-5" />}
                </th>
                <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('job.company')}>
                  Company {sortConfig.key === 'job.company' ? (sortConfig.direction === 'ascending' ? <SortAscendingIcon className="inline-block h-5 w-5" /> : <SortDescendingIcon className="inline-block h-5 w-5" />) : <SelectorIcon className="inline-block h-5 w-5" />}
                </th>
                <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('date')}>
                  Applied Date {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? <SortAscendingIcon className="inline-block h-5 w-5" /> : <SortDescendingIcon className="inline-block h-5 w-5" />) : <SelectorIcon className="inline-block h-5 w-5" />}
                </th>
                <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('status')}>
                  Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? <SortAscendingIcon className="inline-block h-5 w-5" /> : <SortDescendingIcon className="inline-block h-5 w-5" />) : <SelectorIcon className="inline-block h-5 w-5" />}
                </th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedApplications
                .filter((app) => app.job) // Add this line to filter out null jobs
                .map((app) => (
                <tr key={app._id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="p-4">{app.job.title}</td>
                  <td className="p-4">{app.job.company}</td>
                  <td className="p-4">{new Date(app.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span
                      className={`text-sm px-3 py-1 rounded capitalize ${
                        {
                          Submitted: 'bg-blue-100 text-blue-600 border border-blue-300',
                          'In Review': 'bg-yellow-100 text-yellow-600 border border-yellow-300',
                          Interviewing: 'bg-purple-100 text-purple-600 border border-purple-300',
                          Offered: 'bg-green-100 text-green-600 border border-green-300',
                          Rejected: 'bg-red-100 text-red-600 border border-red-300',
                        }[app.status] || 'bg-gray-100 text-gray-600 border border-gray-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => openChat(app)}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                      title="Chat with recruiter"
                    >
                      <ChatIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;