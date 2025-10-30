import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getApplicationsForJob, updateApplicationStatus, fetchJobById } from '../services/api';
import { toast } from 'react-toastify';

const ApplicantsPage = () => {
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const { jobId } = useParams();

  const fetchApplications = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      const data = await getApplicationsForJob(jobId, token);
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications', error);
      toast.error('Failed to load applicants.');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    const fetchJobTitle = async () => {
      try {
        const job = await fetchJobById(jobId);
        setJobTitle(job.title);
      } catch (error) {
        console.error('Failed to fetch job title', error);
      }
    };

    fetchJobTitle();
    fetchApplications();
  }, [fetchApplications, jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = sessionStorage.getItem('token');
      await updateApplicationStatus(applicationId, newStatus, token);
      toast.success('Application status updated.');
      // Refresh the list to show the new status
      fetchApplications();
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('Failed to update status.');
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading applicants...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Applicants for {jobTitle}</h1>
      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div key={app._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{`${app.applicant.firstName} ${app.applicant.lastName}`}</h2>
                <p className="text-gray-600 dark:text-gray-400">Applied on: {new Date(app.date).toLocaleDateString()}</p>
              </div>
              <div>
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  className="p-2 rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="In Review">In Review</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <p>No applicants for this job yet.</p>
        )}
      </div>
    </div>
  );
};

export default ApplicantsPage;
