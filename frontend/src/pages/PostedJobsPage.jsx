import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import {
  getEmployerJobs,
  getApplicationsForJob,
  deleteJob,
  shortlistCandidate,
} from '../services/api';

const PostedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const { token } = useContext(AuthContext);
  const { openChatForApplication } = useContext(ChatContext);
  const location = useLocation();

  const fetchJobs = useCallback(async () => {
    try {
      const employerJobs = await getEmployerJobs(token);
      setJobs(employerJobs);
    } catch (error) {
      console.error('Failed to fetch employer jobs:', error);
    }
  }, [token]);

  const handleViewApplications = useCallback(
    async (jobId) => {
      try {
        const jobApplications = await getApplicationsForJob(jobId, token);
        setApplications((prev) => ({ ...prev, [jobId]: jobApplications }));
        setSelectedJobId(jobId);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchJobs();
    }
  }, [token, fetchJobs]);

  useEffect(() => {
    const { state } = location;
    if (state?.openChatForJobId) {
      handleViewApplications(state.openChatForJobId);
    }
  }, [location, handleViewApplications]);

  const handleShortlist = async (applicationId, jobId) => {
    try {
      await shortlistCandidate(applicationId, token);
      handleViewApplications(jobId);
    } catch (error) {
      console.error('Failed to shortlist candidate:', error);
    }
  };

  const handleDeleteJob = (jobId) => {
    setConfirmAction(() => async () => {
      try {
        await deleteJob(jobId, token);
        fetchJobs();
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
      setShowConfirm(false);
    });
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setConfirmAction(null);
  };

  const openChat = (application, jobTitle) => {
    const recipientName = `${application.applicant.firstName} ${application.applicant.lastName}`;
    openChatForApplication(application._id, recipientName, jobTitle);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Posted Jobs</h1>
      <div className="space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p>{job.company}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleViewApplications(job._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  View Applications
                </button>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
              {selectedJobId === job._id && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold">
                    Applications ({(applications[job._id] || []).length})
                  </h4>
                  {(applications[job._id] || []).length > 0 ? (
                    (applications[job._id] || []).map((app) => (
                      <div
                        key={app._id}
                        className="p-2 border-t flex justify-between items-center"
                      >
                        {app.applicant ? (
                          <>
                            <div>
                              <p>
                                {app.applicant.firstName} {app.applicant.lastName}
                              </p>
                              <p>{app.applicant.email}</p>
                            </div>
                            <div>
                              {app.status !== 'shortlisted' ? (
                                <button
                                  onClick={() => handleShortlist(app._id, job._id)}
                                  className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                                >
                                  Shortlist
                                </button>
                              ) : (
                                <button
                                  onClick={() => openChat(app, job.title)}
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                                  data-chat-opener="true"
                                >
                                  Chat
                                </button>
                              )}
                            </div>
                          </>
                        ) : (
                          <p className="text-red-500">
                            Applicant details not available.
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No applications to display.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>You haven't posted any jobs yet.</p>
        )}
      </div>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-200 mb-6">
              Are you sure you want to delete this job?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition"
                aria-label="Confirm Delete"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostedJobsPage;