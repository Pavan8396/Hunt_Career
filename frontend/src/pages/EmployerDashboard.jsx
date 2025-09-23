import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getEmployerJobs, getApplicationsForJob, deleteJob, shortlistCandidate, getEmployerApplications } from '../services/api';
import PostJob from '../components/PostJob';
import Chat from '../components/Chat';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [totalApplications, setTotalApplications] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchTotalApplications = async () => {
      try {
        const allApplications = await getEmployerApplications(token);
        setTotalApplications(allApplications.length);
      } catch (error) {
        console.error('Failed to fetch total applications:', error);
      }
    };

    if (token) {
      fetchTotalApplications();
    }
  }, [token]);

  const handleShortlist = async (applicationId) => {
    try {
      await shortlistCandidate(applicationId, token);
      handleViewApplications(selectedJob);
    } catch (error) {
      console.error('Failed to shortlist candidate:', error);
    }
  };

  const fetchJobs = React.useCallback(async () => {
    try {
      const employerJobs = await getEmployerJobs(token);
      setJobs(employerJobs);
    } catch (error) {
      console.error('Failed to fetch employer jobs:', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchJobs();
    }
  }, [token, fetchJobs]);

  const handleViewApplications = async (jobId) => {
    try {
      const jobApplications = await getApplicationsForJob(jobId, token);
      setApplications({ ...applications, [jobId]: jobApplications });
      setSelectedJob(jobId);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleDeleteJob = async (jobId) => {
    setConfirmAction(() => () => deleteJobAction(jobId));
    setShowConfirm(true);
  };

  const deleteJobAction = async (jobId) => {
    try {
      await deleteJob(jobId, token);
      fetchJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setConfirmAction(null);
  };

  const { username } = useContext(AuthContext);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {username}!</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Jobs Posted</h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{jobs.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Applications</h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{totalApplications}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
