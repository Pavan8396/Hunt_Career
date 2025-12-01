import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import {
  saveJob,
  removeJob,
  isJobSaved,
} from '../utils/localStorageHelpers';
import { fetchJobById, applyForJob, getApplicationForJob, submitReview } from '../services/api';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
import { BriefcaseIcon, LocationMarkerIcon, BookmarkIcon, ArrowCircleRightIcon, ChatIcon } from '@heroicons/react/outline';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const { openChatForApplication } = useContext(ChatContext);
  const { token, user, isAuthenticated } = useContext(AuthContext);
  const [hasApplied, setHasApplied] = useState(false);

  // ✅ Effect for fetching job details (with cleanup)
  useEffect(() => {
    let isMounted = true;

    const loadJobDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const foundJob = await fetchJobById(id);
        if (!isMounted) return;
        setJob(foundJob);
        if (isAuthenticated) {
          setSaved(isJobSaved(foundJob._id));
        }
      } catch (err) {
        if (isMounted) {
          setError(
            'Failed to load job details. Please ensure the backend server is running and try again.'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadJobDetails();
    return () => {
      isMounted = false;
    };
  }, [id, isAuthenticated]);

  // ✅ Effect for checking application status (with cleanup)
  useEffect(() => {
    let isMounted = true;

    const checkApplicationStatus = async () => {
      if (user && user.type === 'user' && job && token) {
        try {
          const app = await getApplicationForJob(id, token);
          if (isMounted) setHasApplied(!!app);
        } catch (error) {
          console.error('Failed to check application status:', error);
        }
      }
    };

    checkApplicationStatus();
    return () => {
      isMounted = false;
    };
  }, [id, user, job, token]);

  // ✅ Effect to auto-clear notifications safely
  useEffect(() => {
    let timer;
    if (notification.message) {
      timer = setTimeout(
        () => setNotification({ message: '', type: '' }),
        3000
      );
    }
    return () => clearTimeout(timer);
  }, [notification]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to apply for jobs.');
      navigate('/login');
      return;
    }
    try {
      await applyForJob(job._id, token);
      setHasApplied(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleMessageRecruiter = async () => {
    try {
      const app = await getApplicationForJob(job._id, token);
      if (app) {
        openChatForApplication(app._id, job.company, job.title);
      } else {
        toast.error('Could not find application details to start chat.');
        setHasApplied(false); // Correct the state if something is out of sync
      }
    } catch (error) {
      toast.error('An error occurred while trying to start the chat.');
    }
  };

  const toggleSave = () => {
    if (!isAuthenticated) {
      toast.info('Please log in to save jobs.');
      navigate('/login');
      return;
    }
    setConfirmAction(saved ? 'unsave' : 'save');
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (confirmAction === 'save') {
      saveJob(job);
      setSaved(true);
      setNotification({
        message: `Job "${job.title}" saved!`,
        type: 'success',
      });
      toast.success(`Job "${job.title}" saved!`);
    } else if (confirmAction === 'unsave') {
      removeJob(job._id);
      setSaved(false);
      setNotification({
        message: `Job "${job.title}" unsaved!`,
        type: 'info',
      });
      toast.info(`Job "${job.title}" unsaved!`);
    }
    setShowConfirm(false);
    setConfirmAction(null);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setConfirmAction(null);
  };

  const handleReviewSubmitted = async (reviewData) => {
    try {
      await submitReview(job.employer, reviewData, token);
      // We can optionally refresh reviews here if they were displayed on this page
    } catch (error) {
      // The ReviewForm already shows a toast on failure, but re-throw for parent if needed
      throw error;
    }
  };

  // ----------------- Render Section -----------------

  if (loading) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 dark:bg-gray-600"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 dark:bg-gray-600"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 dark:bg-gray-600"></div>
          <div className="h-10 bg-gray-200 rounded w-24 mb-6 dark:bg-gray-600"></div>
          <div className="h-5 bg-gray-200 rounded w-full mb-2 dark:bg-gray-600"></div>
          <div className="h-5 bg-gray-200 rounded w-full mb-2 dark:bg-gray-600"></div>
          <div className="h-5 bg-gray-200 rounded w-5/6 dark:bg-gray-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-3xl mx-auto text-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <Link
          to="/home"
          className="text-blue-600 hover:underline text-sm mt-4 inline-block dark:text-blue-200 dark:hover:text-blue-100"
          aria-label="Back to home"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-4 max-w-3xl mx-auto text-center">
        <p className="text-gray-500 dark:text-gray-200">Job not found.</p>
        <Link
          to="/home"
          className="text-blue-600 hover:underline text-sm mt-4 inline-block dark:text-blue-200 dark:hover:text-blue-100"
          aria-label="Back to home"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto relative">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-gray-800/50">
        <Link
          to="/home"
          className="text-blue-600 hover:underline text-sm dark:text-blue-200 dark:hover:text-blue-100 mb-4 inline-block"
          aria-label="Back to home"
        >
          ← Back to Home
        </Link>

        <div className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-700 dark:to-blue-900 p-6 rounded-lg mb-6">
          <h1 className="text-3xl font-bold text-white">{job.title}</h1>
          <p className="text-gray-200 mt-2">{job.company}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-200">
            <span className="flex items-center gap-1">
              <BriefcaseIcon className="h-5 w-5" /> {job.job_type}
            </span>
            <span className="flex items-center gap-1">
              <LocationMarkerIcon className="h-5 w-5" />{' '}
              {job.candidate_required_location}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center my-6">
          <button
            type="button"
            onClick={toggleSave}
            className={`p-2 rounded-full transition ${
              saved
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
            aria-label={saved ? 'Unsave job' : 'Save job'}
            title={saved ? 'Unsave job' : 'Save job'}
          >
            <BookmarkIcon className="h-5 w-5" />
          </button>

          {hasApplied ? (
            <button
              type="button"
              onClick={handleMessageRecruiter}
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
              data-chat-opener="true"
              title="Message Recruiter"
            >
              <ChatIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApply}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              aria-label="Apply for this job"
              title="Apply"
            >
              <ArrowCircleRightIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="border-t dark:border-gray-700 my-6"></div>

        <div className="prose max-w-none dark:prose-invert prose-p:text-gray-700 dark:text-white prose-h3:text-gray-900 dark:prose-h3:text-gray-100 prose-h4:text-gray-900 dark:prose-h4:text-gray-100 prose-ul:text-gray-700 dark:text-white prose-ol:text-gray-700 dark:text-white">
          <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">
            Job Description
          </h2>
          <ReactMarkdown>{job.description}</ReactMarkdown>
        </div>

        {job && job.employer && (
          <>
            <div className="border-t dark:border-gray-700 my-6 pt-6">
              <ReviewList employerId={job.employer} />
            </div>

            {isAuthenticated && user?.type !== 'employer' && (
              <div className="border-t dark:border-gray-700 my-6 pt-6">
                <ReviewForm
                  employerId={job.employer}
                  token={token}
                  onReviewSubmitted={handleReviewSubmitted}
                />
              </div>
            )}
          </>
        )}
      </div>

      {notification.message && (
        <div className="mt-4 text-center">
          <p
            className={`px-4 py-2 rounded ${
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Confirm {confirmAction === 'save' ? 'Save' : 'Unsave'}
            </h3>
            <p className="text-gray-600 dark:text-gray-200 mb-6">
              Are you sure you want to {confirmAction} the job "{job.title}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm text-white rounded transition ${
                  confirmAction === 'save'
                    ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700'
                }`}
                aria-label={
                  confirmAction === 'save' ? 'Confirm Save' : 'Confirm Unsave'
                }
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

export default JobDetails;
