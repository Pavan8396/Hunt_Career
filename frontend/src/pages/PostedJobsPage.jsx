import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { FaEdit, FaTrash, FaTrashAlt, FaUsers } from 'react-icons/fa';
import {
  getEmployerJobs,
  deleteJob,
  deleteAllJobs,
  deleteMultipleJobs,
} from '../services/api';
import { toast } from 'react-toastify';

const PostedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const { token } = useContext(AuthContext);
  const { openChatForApplication } = useContext(ChatContext);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchJobs = useCallback(async () => {
    try {
      const employerJobs = await getEmployerJobs(token);
      setJobs(employerJobs);
    } catch (error) {
      console.error('Failed to fetch employer jobs:', error);
      toast.error('Failed to fetch your jobs.');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchJobs();
    }
  }, [token, fetchJobs]);

  const handleDeleteJob = (jobId) => {
    setConfirmMessage('Are you sure you want to delete this job?');
    setConfirmAction(() => async () => {
      const originalJobs = [...jobs];
      const updatedJobs = jobs.filter((job) => job._id !== jobId);
      setJobs(updatedJobs);
      setShowConfirm(false);
      try {
        await deleteJob(jobId, token);
        toast.success('Job deleted successfully!');
      } catch (error) {
        console.error('Failed to delete job:', error);
        toast.error('Failed to delete job. Reverting changes.');
        setJobs(originalJobs);
      }
    });
    setShowConfirm(true);
  };

  const handleDeleteAllJobs = () => {
    setConfirmMessage('Are you sure you want to delete all jobs?');
    setConfirmAction(() => async () => {
      const originalJobs = [...jobs];
      setJobs([]);
      setSelectedJobs([]);
      setShowConfirm(false);
      try {
        await deleteAllJobs(token);
        toast.success('All jobs deleted successfully!');
      } catch (error) {
        console.error('Failed to delete all jobs:', error);
        toast.error('Failed to delete all jobs. Reverting changes.');
        setJobs(originalJobs);
      }
    });
    setShowConfirm(true);
  };

  const handleDeleteMultipleJobs = () => {
    setConfirmMessage(`Are you sure you want to delete ${selectedJobs.length} selected jobs?`);
    setConfirmAction(() => async () => {
      const originalJobs = [...jobs];
      const updatedJobs = jobs.filter((job) => !selectedJobs.includes(job._id));
      setJobs(updatedJobs);
      setSelectedJobs([]);
      setShowConfirm(false);
      try {
        await deleteMultipleJobs(selectedJobs, token);
        toast.success('Selected jobs deleted successfully!');
      } catch (error) {
        console.error('Failed to delete multiple jobs:', error);
        toast.error('Failed to delete selected jobs. Reverting changes.');
        setJobs(originalJobs);
      }
    });
    setShowConfirm(true);
  };

  const handleCheckboxChange = (jobId) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map(job => job._id));
    }
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
      {jobs.length > 0 && (
        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleDeleteAllJobs}
            className="p-2 bg-red-600 text-white rounded flex items-center space-x-2"
            title="Delete All Jobs"
          >
            <FaTrashAlt />
            <span>Delete All</span>
          </button>
          <button
            onClick={handleDeleteMultipleJobs}
            className="p-2 bg-red-600 text-white rounded flex items-center space-x-2"
            disabled={selectedJobs.length === 0}
            title="Delete Selected Jobs"
          >
            <FaTrash />
            <span>Delete Selected</span>
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={jobs.length > 0 && selectedJobs.length === jobs.length}
                />
              </th>
              <th className="p-4 text-left">Job Title</th>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <React.Fragment key={job._id}>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(job._id)}
                        checked={selectedJobs.includes(job._id)}
                      />
                    </td>
                    <td className="p-4">{job.title}</td>
                    <td className="p-4">{job.company}</td>
                    <td className="p-4 flex justify-center space-x-2">
                      <Link
                        to={`/employer/jobs/${job._id}/applicants`}
                        className="p-2 bg-blue-600 text-white rounded"
                        title="View Applicants"
                      >
                        <FaUsers />
                      </Link>
                      <button
                        onClick={() => navigate(`/employer/post-job/${job._id}`)}
                        className="p-2 bg-yellow-600 text-white rounded"
                        title="Edit Job"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-2 bg-red-600 text-white rounded"
                        title="Delete Job"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  You haven't posted any jobs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-200 mb-6">{confirmMessage}</p>
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