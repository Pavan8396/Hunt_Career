import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSavedJobs, removeJob } from '../utils/localStorageHelpers';
import { useSortableData } from '../hooks/useSortableData';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const SavedJobs = () => {
  const [initialJobs, setInitialJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [jobToRemove, setJobToRemove] = useState(null);
  const navigate = useNavigate();

  const fetchSavedJobs = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const jobs = getSavedJobs();
      if (!Array.isArray(jobs)) {
        throw new Error('Saved jobs data is not an array');
      }
      setInitialJobs(jobs);
    } catch (err) {
      setError('Failed to load saved jobs. Please try again.');
      toast.error('Failed to load saved jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  const { items, requestSort, sortConfig } = useSortableData(initialJobs);

  const handleRemoveJob = (id, title) => {
    setJobToRemove({ id, title });
    setShowConfirm(true);
  };

  const handleConfirmRemove = () => {
    if (jobToRemove) {
      removeJob(jobToRemove.id);
      fetchSavedJobs(); // Refetch to update the table
      toast.info(`"${jobToRemove.title}" removed from saved jobs!`);
    }
    setShowConfirm(false);
    setJobToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowConfirm(false);
    setJobToRemove(null);
  };

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort />;
    }
    if (sortConfig.direction === 'ascending') {
      return <FaSortUp />;
    }
    return <FaSortDown />;
  };

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">Saved Jobs</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
          <div className="h-12 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
          <div className="h-12 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">Saved Jobs</h2>
      {initialJobs.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">No saved jobs found.</p>
          <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
            ← Find Jobs
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-3 text-left">
                  <button
                    onClick={() => requestSort('title')}
                    className="flex items-center space-x-1"
                  >
                    <span>Job Title</span>
                    {getSortIcon('title')}
                  </button>
                </th>
                <th className="p-3 text-left">
                  <button
                    onClick={() => requestSort('company')}
                    className="flex items-center space-x-1"
                  >
                    <span>Company</span>
                    {getSortIcon('company')}
                  </button>
                </th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((job) => (
                <tr key={job.id} className="border-b dark:border-gray-700">
                  <td className="p-3">
                    <Link to={`/jobs/${job.id}`} className="hover:underline">
                      {job.title}
                    </Link>
                  </td>
                  <td className="p-3">{job.company}</td>
                  <td className="p-3 flex items-center space-x-2">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleRemoveJob(job.id, job.title)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showConfirm && jobToRemove && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Confirm Remove</h3>
            <p className="my-4">
              Are you sure you want to remove "{jobToRemove.title}"?
            </p>
            <div className="flex justify-end space-x-2">
              <button onClick={handleCancelRemove} className="px-4 py-2 rounded border">
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 rounded bg-red-600 text-white"
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

export default SavedJobs;