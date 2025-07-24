import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getEmployerJobs, getApplicationsForJob, deleteJob } from '../services/api';
import PostJob from '../components/PostJob';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const { token } = useContext(AuthContext);

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

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId, token);
      fetchJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Employer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Post a New Job</h2>
          <PostJob onJobPosted={fetchJobs} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Posted Jobs</h2>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} className="p-4 border rounded mb-4">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p>{job.company}</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleViewApplications(job._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    View Applications
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
                {selectedJob === job._id && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold">Applications</h4>
                    {applications[job._id] && applications[job._id].length > 0 ? (
                      applications[job._id].map((app) => (
                        <div key={app._id} className="p-2 border-t">
                          <p>{app.jobSeeker.name}</p>
                          <p>{app.jobSeeker.email}</p>
                        </div>
                      ))
                    ) : (
                      <p>No applications yet.</p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>You haven't posted any jobs yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
