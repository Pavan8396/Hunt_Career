import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { saveJob, removeJob, isJobSaved } from '../utils/localStorageHelpers';

const JobCard = ({
  id,
  title,
  company,
  job_type,
  candidate_required_location,
  description,
}) => {
  const [saved, setSaved] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSaved(isJobSaved(id));
  }, [id]);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    setConfirmAction(saved ? 'unsave' : 'save');
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (confirmAction === 'save') {
      saveJob({
        id,
        title,
        company,
        job_type,
        candidate_required_location,
        description,
      });
      setSaved(true);
      setNotification({ message: `Job "${title}" saved!`, type: 'success' });
      toast.success(`Job "${title}" saved!`);
    } else if (confirmAction === 'unsave') {
      removeJob(id);
      setSaved(false);
      setNotification({ message: `Job "${title}" unsaved!`, type: 'info' });
      toast.info(`Job "${title}" unsaved!`);
    }
    setShowConfirm(false);
    setConfirmAction(null);
    // Auto-hide notification after 3 seconds
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setConfirmAction(null);
  };

  const handleCardClick = () => {
    navigate(`/jobs/${id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div className="relative flex flex-col justify-between border rounded p-4 shadow hover:shadow-md transition bg-white dark:bg-gray-800 dark:border-gray-700 cursor-pointer h-full">
      <div
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${title} at ${company}`}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{company}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {job_type} • {candidate_required_location}
        </p>

        {description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 line-clamp-3">
            {description}
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span
          onClick={handleCardClick}
          className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label={`View details for ${title}`}
        >
          View Details →
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleSaveClick}
            className={`text-sm w-20 text-center px-3 py-1 border rounded ${
              saved
                ? 'bg-red-100 text-red-600 border-red-300 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-800'
                : 'bg-green-100 text-green-600 border-green-300 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-800'
            } transition`}
            aria-label={saved ? `Unsave ${title}` : `Save ${title}`}
          >
            {saved ? 'Unsave' : 'Save'}
          </button>
        </div>
      </div>

      {/* Notification below the job card */}
      {notification.message && (
        <div className="mt-2 text-center">
          <p
            className={`px-4 py-1 rounded text-sm ${
              notification.type === 'success'
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}
          >
            {notification.message}
          </p>
        </div>
      )}

      {/* Custom Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
              Confirm {confirmAction === 'save' ? 'Save' : 'Unsave'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to {confirmAction} the job &quot;{title}&quot;?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm text-white rounded transition ${
                  confirmAction === 'save'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                aria-label={confirmAction === 'save' ? 'Confirm Save' : 'Confirm Unsave'}
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

JobCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  job_type: PropTypes.string.isRequired,
  candidate_required_location: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default JobCard;