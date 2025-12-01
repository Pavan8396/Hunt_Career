import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSavedJobs, removeJob } from '../utils/localStorageHelpers';
import { TrashIcon, ExternalLinkIcon, SortAscendingIcon, SortDescendingIcon, SelectorIcon } from '@heroicons/react/outline';
import { useSortableData } from '../hooks/useSortableData';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [jobToRemove, setJobToRemove] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedJobs = () => {
      setLoading(true);
      setError(null);
      try {
        const jobs = getSavedJobs();
        console.log('Fetched saved jobs:', jobs); // Debug logging
        if (!Array.isArray(jobs)) {
          throw new Error('Saved jobs data is not an array');
        }
        setSavedJobs(jobs);
      } catch (err) {
        console.error('Error loading saved jobs:', err.message);
        setError('Failed to load saved jobs. Please try again.');
        toast.error('Failed to load saved jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, []);

  const handleRemoveJob = (_id, title) => {
    setJobToRemove({ _id, title });
    setShowConfirm(true);
  };

  const handleConfirmRemove = () => {
    if (jobToRemove) {
      removeJob(jobToRemove._id);
      setSavedJobs(savedJobs.filter((job) => job._id !== jobToRemove._id));
      toast.info(`"${jobToRemove.title}" removed from saved jobs!`);
    }
    setShowConfirm(false);
    setJobToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowConfirm(false);
    setJobToRemove(null);
  };

  const handleCardClick = (id) => {
    navigate(`/jobs/${id}`);
  };

  const { items: sortedJobs, requestSort, sortConfig } = useSortableData(savedJobs, { key: 'title', direction: 'ascending' });

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">Saved Jobs</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 dark:bg-gray-600"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-600"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 dark:bg-gray-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <Link
          to="/"
          className="text-blue-600 hover:underline text-sm mt-4 inline-block dark:text-blue-400"
          aria-label="Back to home"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">Saved Jobs</h2>
      {savedJobs.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">No saved jobs found.</p>
          <Link
            to="/"
            className="text-blue-600 hover:underline text-sm mt-4 inline-block dark:text-blue-400"
            aria-label="Back to home"
          >
            ← Back to Home
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('title')}>
                  Job Title {sortConfig.key === 'title' ? (sortConfig.direction === 'ascending' ? <SortAscendingIcon className="inline-block h-5 w-5" /> : <SortDescendingIcon className="inline-block h-5 w-5" />) : <SelectorIcon className="inline-block h-5 w-5" />}
                </th>
                <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('company')}>
                  Company {sortConfig.key === 'company' ? (sortConfig.direction === 'ascending' ? <SortAscendingIcon className="inline-block h-5 w-5" /> : <SortDescendingIcon className="inline-block h-5 w-5" />) : <SelectorIcon className="inline-block h-5 w-5" />}
                </th>
                <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('job_type')}>
                  Job Type {sortConfig.key === 'job_type' ? (sortConfig.direction === 'ascending' ? <SortAscendingIcon className="inline-block h-5 w-5" /> : <SortDescendingIcon className="inline-block h-5 w-5" />) : <SelectorIcon className="inline-block h-5 w-5" />}
                </th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedJobs.map((job) => (
                <tr key={job._id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="p-4 cursor-pointer" onClick={() => handleCardClick(job._id)}>{job.title}</td>
                  <td className="p-4 cursor-pointer" onClick={() => handleCardClick(job._id)}>{job.company}</td>
                  <td className="p-4 cursor-pointer" onClick={() => handleCardClick(job._id)}>{job.job_type}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      {job.apply_url && (
                        <a
                          href={job.apply_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Apply for ${job.title}`}
                          title="Apply"
                        >
                          <ExternalLinkIcon className="h-5 w-5" />
                        </a>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveJob(job._id, job.title);
                        }}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                        aria-label={`Remove ${job.title} from saved jobs`}
                        title="Remove"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Confirmation Dialog */}
      {showConfirm && jobToRemove && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
              Confirm Remove
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to remove the job "{jobToRemove.title}" from saved jobs?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelRemove}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition"
                aria-label="Confirm Remove"
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