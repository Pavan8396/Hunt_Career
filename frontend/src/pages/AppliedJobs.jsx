import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import SkeletonCard from '../components/SkeletonCard';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await api.get('/user/applied-jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppliedJobs(response.data);
      } catch (err) {
        setError('Failed to load applied jobs. Please try again.');
        toast.error('Failed to load applied jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppliedJobs();
    }
  }, [user]);

  const handleCardClick = (id) => {
    navigate(`/jobs/${id}`);
  };

  if (loading) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">Applied Jobs</h2>
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
        <Link to="/home" className="text-blue-600 hover:underline mt-4 inline-block dark:text-blue-400">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">Applied Jobs</h2>
      {appliedJobs.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">You have not applied for any jobs yet.</p>
          <Link to="/home" className="text-blue-600 hover:underline mt-4 inline-block dark:text-blue-400">
            ← Find Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appliedJobs.map((job) => (
            <div
              key={job._id}
              className="border rounded p-4 shadow hover:shadow-md transition bg-white dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
              onClick={() => handleCardClick(job._id)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${job.title} at ${job.company}`}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{job.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {job.job_type} • {job.location}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                  View Details →
                </span>
                <span className="text-sm px-3 py-1 bg-green-100 text-green-600 border border-green-300 rounded dark:bg-green-900 dark:text-green-300 dark:border-green-700">
                  Applied
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
