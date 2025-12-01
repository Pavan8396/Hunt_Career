import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getApplicationsForJob, updateApplicationStatus, fetchJobById } from '../services/api';
import { toast } from 'react-toastify';
import { ChatContext } from '../context/ChatContext';
import { SortAscendingIcon, SortDescendingIcon, SelectorIcon, FilterIcon, SearchIcon, ChatIcon } from '@heroicons/react/outline';

const ApplicantsPage = () => {
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
  const { jobId } = useParams();
  const { openChatForApplication } = useContext(ChatContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.chatToOpen) {
      const { applicationId, recipientName, jobTitle } = location.state.chatToOpen;
      openChatForApplication(applicationId, recipientName, jobTitle);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, openChatForApplication]);

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

  const sortedAndFilteredApplications = React.useMemo(() => {
    let filteredApps = applications.filter(app => {
      const applicantName = `${app.applicant.firstName} ${app.applicant.lastName}`.toLowerCase();
      return (
        (applicantName.includes(search.toLowerCase())) &&
        (statusFilter === '' || app.status === statusFilter)
      );
    });

    if (sortConfig.key !== null) {
      filteredApps.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'name') {
          aValue = `${a.applicant.firstName} ${a.applicant.lastName}`;
          bValue = `${b.applicant.firstName} ${b.applicant.lastName}`;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredApps;
  }, [applications, search, statusFilter, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Applicants for {jobTitle}</h1>
      <div className="flex justify-between mb-4 items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name"
            className="p-2 border rounded pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <div className="relative">
          <select
            className="p-2 border rounded pl-10"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="In Review">In Review</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
          <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('name')}>
                Applicant Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? <SortAscendingIcon className="inline-block h-5 w-5" /> : <SortDescendingIcon className="inline-block h-5 w-5" />) : <SelectorIcon className="inline-block h-5 w-5" />}
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('date')}>
                Applied Date {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? <SortAscendingIcon className="inline-block h-5 w-5" /> : <SortDescendingIcon className="inline-block h-5 w-5" />) : <SelectorIcon className="inline-block h-5 w-5" />}
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('status')}>
                Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? <SortAscendingIcon className="inline-block h-5 w-5" /> : <SortDescendingIcon className="inline-block h-5 w-5" />) : <SelectorIcon className="inline-block h-5 w-5" />}
              </th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredApplications.length > 0 ? (
              sortedAndFilteredApplications.map((app) => (
                <tr key={app._id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="p-4">{`${app.applicant.firstName} ${app.applicant.lastName}`}</td>
                  <td className="p-4">{new Date(app.date).toLocaleDateString()}</td>
                  <td className="p-4">
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
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => openChatForApplication(app._id, `${app.applicant.firstName} ${app.applicant.lastName}`, jobTitle)}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                      title="Chat with applicant"
                    >
                      <ChatIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  No applicants match your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicantsPage;
