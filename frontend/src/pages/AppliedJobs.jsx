import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { getUserApplications } from '../services/api';
import { useSortableData } from '../hooks/useSortableData';
import { FaSort, FaSortUp, FaSortDown, FaComments, FaEye } from 'react-icons/fa';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useContext(AuthContext);
  const { openChatForApplication } = useContext(ChatContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { items, requestSort, sortConfig } = useSortableData(applications);

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

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort className="inline-block ml-1" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <FaSortUp className="inline-block ml-1" />;
    }
    return <FaSortDown className="inline-block ml-1" />;
  };

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Applied Jobs</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-full"></div>
          <div className="h-12 bg-gray-300 rounded w-full"></div>
          <div className="h-12 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Applied Jobs</h2>
      {applications.length === 0 ? (
        <div className="text-center">
          <p>You have not applied for any jobs yet.</p>
          <Link to="/home" className="text-blue-600 hover:underline mt-2 inline-block">
            ← Find Jobs
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-3 text-left">
                  <button onClick={() => requestSort('job.title')} className="font-bold">
                    Job Title {getSortIcon('job.title')}
                  </button>
                </th>
                <th className="p-3 text-left">
                  <button onClick={() => requestSort('job.company')} className="font-bold">
                    Company {getSortIcon('job.company')}
                  </button>
                </th>
                <th className="p-3 text-left">
                  <button onClick={() => requestSort('status')} className="font-bold">
                    Status {getSortIcon('status')}
                  </button>
                </th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((app) => (
                <tr key={app._id} className="border-b dark:border-gray-700">
                  <td className="p-3">{app.job.title}</td>
                  <td className="p-3">{app.job.company}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        {
                          Submitted: 'bg-blue-100 text-blue-800',
                          'In Review': 'bg-yellow-100 text-yellow-800',
                          Interviewing: 'bg-purple-100 text-purple-800',
                          Offered: 'bg-green-100 text-green-800',
                          Rejected: 'bg-red-100 text-red-800',
                        }[app.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center items-center space-x-2">
                    <Link to={`/jobs/${app.job._id}`} className="p-2 rounded-full hover:bg-gray-200" title="View Job">
                      <FaEye />
                    </Link>
                    <button onClick={() => openChat(app)} className="p-2 rounded-full hover:bg-gray-200" title="Chat with Recruiter">
                      <FaComments />
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