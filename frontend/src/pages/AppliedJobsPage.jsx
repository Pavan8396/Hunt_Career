import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserAppliedJobs } from '../services/api';

const AppliedJobsPage = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const jobs = await getUserAppliedJobs(token);
        setAppliedJobs(jobs);
      } catch (error) {
        console.error('Failed to fetch applied jobs:', error);
      }
    };
    if (token) {
      fetchAppliedJobs();
    }
  }, [token]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Applied Jobs</h1>
      <div className="space-y-4">
        {appliedJobs.length > 0 ? (
          appliedJobs.map((application) => (
            <div key={application._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{application.job.title}</h3>
              <p>{application.job.company}</p>
              <p>Status: <span className={`font-semibold ${application.status === 'shortlisted' ? 'text-green-500' : ''}`}>{application.status}</span></p>
            </div>
          ))
        ) : (
          <p>You haven't applied for any jobs yet.</p>
        )}
      </div>
    </div>
  );
};

export default AppliedJobsPage;
