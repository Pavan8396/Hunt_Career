import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { saveJob, unsaveJob, getSavedJobs } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { BriefcaseIcon, LocationMarkerIcon, BookmarkIcon } from '@heroicons/react/outline';

const JobCard = ({
  _id,
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
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const checkSaved = async () => {
      if (token) {
        const savedJobs = await getSavedJobs(token);
        setSaved(savedJobs.some((job) => job._id === _id));
      }
    };
    checkSaved();
  }, [_id, token]);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (!token) {
      toast.error('You must be logged in to save jobs.');
      navigate('/login');
      return;
    }
    setConfirmAction(saved ? 'unsave' : 'save');
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (confirmAction === 'save') {
      try {
        await saveJob(_id, token);
        setSaved(true);
        setNotification({ message: `Job "${title}" saved!`, type: 'success' });
        toast.success(`Job "${title}" saved!`);
      } catch (error) {
        toast.error('Failed to save job.');
      }
    } else if (confirmAction === 'unsave') {
      try {
        await unsaveJob(_id, token);
        setSaved(false);
        setNotification({ message: `Job "${title}" unsaved!`, type: 'info' });
        toast.info(`Job "${title}" unsaved!`);
      } catch (error) {
        toast.error('Failed to unsave job.');
      }
    }
    setShowConfirm(false);
    setConfirmAction(null);
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setConfirmAction(null);
  };

  const handleCardClick = () => {
    navigate(`/jobs/${_id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${title} at ${company}`}
      className="relative flex flex-col justify-between border rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 dark:border-gray-700 cursor-pointer h-full"
    >
      <div>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
              <BriefcaseIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 line-clamp-2">
              {title}
            </h3>
            <p className="text-md text-gray-600 dark:text-gray-400">{company}</p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <BriefcaseIcon className="w-4 h-4 mr-2" />
            <span>{job_type}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <LocationMarkerIcon className="w-4 h-4 mr-2" />
            <span>{candidate_required_location}</span>
          </div>
        </div>

        {description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-4 line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <button
        onClick={handleSaveClick}
        className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 ${
          saved
            ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
        }`}
        aria-label={saved ? `Unsave ${title}` : `Save ${title}`}
      >
        <BookmarkIcon className="w-5 h-5" />
      </button>

      {notification.message && (
        <div className="absolute bottom-4 right-4 text-center">
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
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  job_type: PropTypes.string.isRequired,
  candidate_required_location: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default JobCard;
