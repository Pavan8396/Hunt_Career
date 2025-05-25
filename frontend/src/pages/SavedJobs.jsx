import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSavedJobs, removeJob } from '../utils/localStorageHelpers';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [jobToRemove, setJobToRemove] = useState(null);
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

  const handleRemoveJob = (id, title) => {
    setJobToRemove({ id, title });
    setShowConfirm(true);
  };

  const handleConfirmRemove = () => {
    if (jobToRemove) {
      removeJob(jobToRemove.id);
      setSavedJobs(savedJobs.filter((job) => job.id !== jobToRemove.id));
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="border rounded p-4 shadow hover:shadow-md transition bg-white dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
              onClick={() => handleCardClick(job.id)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${job.title} at ${job.company}`}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{job.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {job.job_type} • {job.candidate_required_location}
              </p>
              {job.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 line-clamp-3">
                  {job.description}
                </p>
              )}
              <div className="mt-4 flex justify-between items-center">
                <span className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                  View Details →
                </span>
                <div className="flex gap-2">
                  {job.apply_url && (
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm px-3 py-1 bg-blue-600 text-white border border-blue-600 rounded hover:bg-blue-700 transition dark:bg-blue-700 dark:border-blue-700 dark:hover:bg-blue-800"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Apply for ${job.title}`}
                    >
                      Apply
                    </a>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveJob(job.id, job.title);
                    }}
                    className="text-sm px-3 py-1 bg-red-100 text-red-600 border border-red-300 rounded hover:bg-red-200 transition dark:bg-red-900 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-800"
                    aria-label={`Remove ${job.title} from saved jobs`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
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