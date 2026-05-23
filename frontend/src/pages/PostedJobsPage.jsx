import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PencilIcon, TrashIcon, UsersIcon, SortAscendingIcon, SortDescendingIcon, SelectorIcon, BriefcaseIcon } from '@heroicons/react/outline';
import {
  getEmployerJobs,
  deleteJob,
  deleteAllJobs,
  deleteMultipleJobs,
  updateJob
} from '../services/api';
import { toast } from 'react-toastify';
import { useSortableData } from '../hooks/useSortableData';
import EmptyState from '../components/common/EmptyState';

const PostedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const { token } = useContext(AuthContext);
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

  const { items: sortedJobs, requestSort, sortConfig } = useSortableData(jobs, { key: 'title', direction: 'ascending' });

  const handleDeleteJob = (jobId) => {
    setConfirmMessage('Are you sure you want to archive this job? Applicants will still be able to see their application history.');
    setConfirmAction(() => async () => {
      const originalJobs = [...jobs];
      const updatedJobs = jobs.filter((job) => job._id !== jobId);
      setJobs(updatedJobs);
      setShowConfirm(false);
      try {
        await deleteJob(jobId, token);
        toast.success('Job archived successfully!');
      } catch (error) {
        console.error('Failed to archive job:', error);
        toast.error('Failed to archive job. Reverting changes.');
        setJobs(originalJobs);
      }
    });
    setShowConfirm(true);
  };

  const handleDeleteAllJobs = () => {
    setConfirmMessage('Are you sure you want to archive all jobs? Applicants will still be able to see their application history.');
    setConfirmAction(() => async () => {
      const originalJobs = [...jobs];
      setJobs([]);
      setSelectedJobs([]);
      setShowConfirm(false);
      try {
        await deleteAllJobs(token);
        toast.success('All jobs archived successfully!');
      } catch (error) {
        console.error('Failed to archive all jobs:', error);
        toast.error('Failed to archive all jobs. Reverting changes.');
        setJobs(originalJobs);
      }
    });
    setShowConfirm(true);
  };

  const handleDeleteMultipleJobs = () => {
    setConfirmMessage(`Are you sure you want to archive ${selectedJobs.length} selected jobs? Applicants will still be able to see their application history.`);
    setConfirmAction(() => async () => {
      const originalJobs = [...jobs];
      const updatedJobs = jobs.filter((job) => !selectedJobs.includes(job._id));
      setJobs(updatedJobs);
      setSelectedJobs([]);
      setShowConfirm(false);
      try {
        await deleteMultipleJobs(selectedJobs, token);
        toast.success('Selected jobs archived successfully!');
      } catch (error) {
        console.error('Failed to archive multiple jobs:', error);
        toast.error('Failed to archive selected jobs. Reverting changes.');
        setJobs(originalJobs);
      }
    });
    setShowConfirm(true);
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJob(jobId, { status: newStatus }, token);
      toast.success(`Job status updated to ${newStatus}`);
      fetchJobs();
    } catch (err) {
      toast.error('Failed to update job status');
    }
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

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Posted Jobs</h1>
      {jobs.length === 0 ? (
        <EmptyState
          icon={BriefcaseIcon}
          title="No Posted Jobs"
          message="You haven't posted any jobs yet. Click the button below to post your first job."
          buttonText="Post a Job"
          buttonLink="/employer/post-job"
        />
      ) : (
        <>
          <div className="flex space-x-2 mb-4">
            <button
              onClick={handleDeleteAllJobs}
              className="p-2 bg-yellow-600 text-white rounded flex items-center space-x-2"
              title="Archive All Jobs"
            >
              <TrashIcon className="h-5 w-5" />
              <span>Archive All</span>
            </button>
            <button
              onClick={handleDeleteMultipleJobs}
              className="p-2 bg-yellow-600 text-white rounded flex items-center space-x-2"
              disabled={selectedJobs.length === 0}
              title="Archive Selected Jobs"
            >
              <TrashIcon className="h-5 w-5" />
              <span>Archive Selected</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white  rounded-lg shadow-md">
              <thead className="bg-gray-200 ">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={jobs.length > 0 && selectedJobs.length === jobs.length}
                    />
                  </th>
                  <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('title')}>
                    Job Title {sortConfig.key === 'title' ? (sortConfig.direction === 'ascending' ? <SortAscendingIcon className="inline-block h-5 w-5" /> : <SortDescendingIcon className="inline-block h-5 w-5" />) : <SelectorIcon className="inline-block h-5 w-5" />}
                  </th>
                  <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('company')}>
                    Company {sortConfig.key === 'company' ? (sortConfig.direction === 'ascending' ? <SortAscendingIcon className="inline-block h-5 w-5" /> : <SortDescendingIcon className="inline-block h-5 w-5" />) : <SelectorIcon className="inline-block h-5 w-5" />}
                  </th>
                  <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('status')}>
                    Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? <SortAscendingIcon className="inline-block h-5 w-5" /> : <SortDescendingIcon className="inline-block h-5 w-5" />) : <SelectorIcon className="inline-block h-5 w-5" />}
                  </th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedJobs.map((job) => (
                  <React.Fragment key={job._id}>
                    <tr className="border-b  hover:bg-gray-100 ">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(job._id)}
                          checked={selectedJobs.includes(job._id)}
                        />
                      </td>
                      <td className="p-4 font-medium">{job.title}</td>
                      <td className="p-4">{job.company}</td>
                      <td className="p-4">
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job._id, e.target.value)}
                          className={`p-1.5 text-xs rounded-md border-gray-300   font-semibold ${
                            job.status === 'Open' ? 'text-green-600' :
                            job.status === 'Closed' ? 'text-red-600' :
                            job.status === 'Archived' ? 'text-gray-500' : 'text-yellow-600'
                          }`}
                        >
                          <option value="Open">Open</option>
                          <option value="Closed">Closed</option>
                          <option value="Draft">Draft</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>
                      <td className="p-4 flex justify-center space-x-2">
                        <Link
                          to={`/employer/jobs/${job._id}/applicants`}
                          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                          title="View Applicants"
                        >
                          <UsersIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => navigate(`/employer/post-job/${job._id}`)}
                          className="p-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition"
                          title="Edit Job"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                          title="Archive Job"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white  p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900  mb-4">
              Confirm Action
            </h3>
            <p className="text-gray-600  mb-6">{confirmMessage}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-600  border border-gray-300  rounded hover:bg-gray-100   transition"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition"
                aria-label="Confirm"
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