import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEmployerJobs, deleteJob } from '../services/api';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Tooltip from '../components/common/Tooltip';

const AdminManageJobsPage = () => {
  const { employerId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const employerJobs = await getEmployerJobs(token, employerId);
        setJobs(employerJobs);
      } catch (error) {
        toast.error('Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [employerId]);

  const handleDelete = (jobId) => {
    setJobToDelete(jobId);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await deleteJob(jobToDelete, token);
      setJobs(jobs.filter((j) => j._id !== jobToDelete));
      toast.success('Job successfully deleted.');
    } catch (error) {
      toast.error('Failed to delete job.');
    } finally {
      setConfirmModalOpen(false);
      setJobToDelete(null);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Manage Jobs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Job Type</th>
              <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
              <th className="w-auto px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {jobs.map((job) => (
              <tr key={job._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 truncate">
                    <Tooltip text={job.title}>
                        <span>{job.title}</span>
                    </Tooltip>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 truncate">
                    <Tooltip text={job.job_type}>
                        <span>{job.job_type}</span>
                    </Tooltip>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 truncate">
                    <Tooltip text={job.candidate_required_location}>
                        <span>{job.candidate_required_location}</span>
                    </Tooltip>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-4">
                        <Tooltip text="Edit Job">
                            <Link to={`/admin/edit-job/${job._id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                <PencilIcon className="h-5 w-5" />
                            </Link>
                        </Tooltip>
                        <Tooltip text="Delete Job">
                            <button onClick={() => handleDelete(job._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </Tooltip>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this job? This action cannot be undone."
      />
    </div>
  );
};

export default AdminManageJobsPage;
