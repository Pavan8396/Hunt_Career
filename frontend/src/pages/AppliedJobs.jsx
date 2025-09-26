import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { getUserApplications } from '../services/api';
import SkeletonCard from '../components/SkeletonCard';

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
    const { state } = location;
    if (state?.openChatForJobId && applications.length > 0) {
      const app = applications.find(
        (app) => app.job._id === state.openChatForJobId
      );
      if (app) {
        openChat(app);
      }
    }
  }, [location, applications, openChatForApplication]);

  const openChat = (application) => {
    if (!application.job || !application.job.employer) {
      toast.error('Cannot open chat. Employer details are missing.');
      return;
    }
    const recipientName =
      application.job.employer.companyName || 'the employer';
    openChatForApplication(application._id, recipientName);
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="border rounded p-4 shadow hover:shadow-md transition bg-white dark:bg-gray-800 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                {app.job.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {app.job.company}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`text-sm px-3 py-1 rounded capitalize ${
                    app.status === 'shortlisted'
                      ? 'bg-green-100 text-green-600 border border-green-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  {app.status}
                </span>
                {app.status === 'shortlisted' && (
                  <button
                    onClick={() => openChat(app)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    data-chat-opener="true"
                  >
                    Chat
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;