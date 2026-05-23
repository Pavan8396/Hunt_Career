import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  getApplicationsForJob,
  updateApplicationStatus,
  fetchJobById,
  scheduleInterview,
  getInterviewsForApplication,
  updateInterviewStatus,
  submitInterviewFeedback,
  updateInterview,
} from '../services/api';
import { toast } from 'react-toastify';
import { ChatContext } from '../context/ChatContext';
import {
  SortAscendingIcon,
  SortDescendingIcon,
  SelectorIcon,
  FilterIcon,
  SearchIcon,
  ChatIcon,
  CalendarIcon,
  CheckCircleIcon,
  XIcon,
  AnnotationIcon
} from '@heroicons/react/outline';
import { useSortableData } from '../hooks/useSortableData';

const ApplicantsPage = () => {
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAppForInterview, setSelectedAppForInterview] = useState(null);
  const [interviews, setInterviews] = useState({});
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [isEditingInterview, setIsEditingInterview] = useState(false);
  const [newInterview, setNewInterview] = useState({
    scheduledAt: '',
    interviewerName: '',
    location: '',
    round: 1,
    roundName: 'Initial Interview'
  });
  const [feedback, setFeedback] = useState('');

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

  const fetchInterviewsForApps = useCallback(async (apps) => {
    const token = sessionStorage.getItem('token');
    const interviewMap = {};
    await Promise.all(apps.map(async (app) => {
      try {
        const data = await getInterviewsForApplication(app._id, token);
        interviewMap[app._id] = data;
      } catch (err) {
        console.error('Failed to fetch interviews for app', app._id);
      }
    }));
    setInterviews(interviewMap);
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      const data = await getApplicationsForJob(jobId, token);
      setApplications(data);
      fetchInterviewsForApps(data);
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

  const { items: sortedApplications, requestSort, sortConfig } = useSortableData(applications, { key: 'date', direction: 'descending' });

  const sortedAndFilteredApplications = React.useMemo(() => {
    return sortedApplications.filter(app => {
      const applicantName = `${app.applicant.firstName} ${app.applicant.lastName}`.toLowerCase();
      return (
        (applicantName.includes(search.toLowerCase())) &&
        (statusFilter === '' || app.status === statusFilter)
      );
    });
  }, [sortedApplications, search, statusFilter]);

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

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      if (isEditingInterview) {
        await updateInterview(selectedInterview._id, newInterview, token);
        toast.success('Interview updated successfully');
      } else {
        await scheduleInterview({
          applicationId: selectedAppForInterview._id,
          ...newInterview
        }, token);
        toast.success('Interview scheduled successfully');
      }
      setShowScheduleModal(false);
      setIsEditingInterview(false);
      setNewInterview({ scheduledAt: '', interviewerName: '', location: '', round: 1, roundName: 'Initial Interview' });
      fetchApplications();
    } catch (err) {
      toast.error(isEditingInterview ? 'Failed to update interview' : 'Failed to schedule interview');
    }
  };

  const handleUpdateInterviewStatus = async (interviewId, status) => {
    try {
      const token = sessionStorage.getItem('token');
      await updateInterviewStatus(interviewId, status, token);
      toast.success(`Interview ${status}`);
      fetchApplications();
    } catch (err) {
      toast.error('Failed to update interview status');
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      await submitInterviewFeedback(selectedInterview._id, feedback, token);
      toast.success('Feedback submitted');
      setShowFeedbackModal(false);
      setFeedback('');
      fetchApplications();
    } catch (err) {
      toast.error('Failed to submit feedback');
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
        <table className="min-w-full bg-white  rounded-lg shadow-md">
          <thead className="bg-gray-200 ">
            <tr>
              <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('applicant.firstName')}>
                Applicant Name {sortConfig.key === 'applicant.firstName' ? (sortConfig.direction === 'ascending' ? <SortAscendingIcon className="inline-block h-5 w-5" /> : <SortDescendingIcon className="inline-block h-5 w-5" />) : <SelectorIcon className="inline-block h-5 w-5" />}
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
              sortedAndFilteredApplications.map((app) => {
                const appInterviews = interviews[app._id] || [];
                return (
                  <React.Fragment key={app._id}>
                    <tr className="border-b  hover:bg-gray-100 ">
                      <td className="p-4 font-medium">{`${app.applicant.firstName} ${app.applicant.lastName}`}</td>
                      <td className="p-4">{new Date(app.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="p-2 text-sm rounded-md border-gray-300  "
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="In Review">In Review</option>
                          <option value="Screening">Screening</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Candidate Identified">Candidate Identified</option>
                          <option value="Offered">Offered</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => openChatForApplication(app._id, `${app.applicant.firstName} ${app.applicant.lastName}`, jobTitle)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition  "
                            title="Chat with applicant"
                          >
                            <ChatIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAppForInterview(app);
                              setShowScheduleModal(true);
                            }}
                            className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition  "
                            title="Schedule Interview"
                          >
                            <CalendarIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {appInterviews.length > 0 && (
                      <tr className="bg-gray-50 ">
                        <td colSpan="4" className="px-8 py-2">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Interviews</div>
                          <div className="space-y-2">
                            {appInterviews.map((interview) => (
                              <div key={interview._id} className="flex items-center justify-between bg-white  p-2 rounded border border-gray-200 ">
                                <div className="text-sm">
                                  <span className="font-semibold">Round {interview.round}: {interview.roundName}</span>
                                  <span className="mx-2 text-gray-300">|</span>
                                  <span className="text-gray-600 ">{new Date(interview.scheduledAt).toLocaleString()}</span>
                                  <span className="mx-2 text-gray-300">|</span>
                                  <span className="text-gray-600 ">{interview.interviewerName || 'TBD'}</span>
                                  <span className="mx-2 text-gray-300">|</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                                    interview.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {interview.status}
                                  </span>
                                </div>
                                <div className="flex space-x-2">
                                  {interview.status === 'Scheduled' && (
                                    <>
                                      <button
                                        onClick={() => {
                                          setSelectedInterview(interview);
                                          setNewInterview({
                                            scheduledAt: new Date(interview.scheduledAt).toISOString().slice(0, 16),
                                            interviewerName: interview.interviewerName || '',
                                            location: interview.location || '',
                                            round: interview.round,
                                            roundName: interview.roundName
                                          });
                                          setIsEditingInterview(true);
                                          setShowScheduleModal(true);
                                        }}
                                        className="text-xs text-blue-600 hover:underline flex items-center"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleUpdateInterviewStatus(interview._id, 'Completed')}
                                        className="text-xs text-green-600 hover:underline flex items-center"
                                      >
                                        <CheckCircleIcon className="h-4 w-4 mr-1" /> Complete
                                      </button>
                                    </>
                                  )}
                                  {interview.status === 'Completed' && (
                                    <button
                                      onClick={() => {
                                        setSelectedInterview(interview);
                                        setFeedback(interview.feedback || '');
                                        setShowFeedbackModal(true);
                                      }}
                                      className="text-xs text-blue-600 hover:underline flex items-center"
                                    >
                                      <AnnotationIcon className="h-4 w-4 mr-1" /> {interview.feedback ? 'Edit Feedback' : 'Give Feedback'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
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

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white  rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{isEditingInterview ? 'Edit Interview' : 'Schedule Interview'}</h2>
              <button onClick={() => { setShowScheduleModal(false); setIsEditingInterview(false); }}><XIcon className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full p-2 border rounded  "
                  value={newInterview.scheduledAt}
                  onChange={(e) => setNewInterview({ ...newInterview, scheduledAt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Interviewer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Hiring Manager"
                  className="w-full p-2 border rounded  "
                  value={newInterview.interviewerName}
                  onChange={(e) => setNewInterview({ ...newInterview, interviewerName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Round #</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full p-2 border rounded  "
                    value={newInterview.round}
                    onChange={(e) => setNewInterview({ ...newInterview, round: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Round Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Technical"
                    className="w-full p-2 border rounded  "
                    value={newInterview.roundName}
                    onChange={(e) => setNewInterview({ ...newInterview, roundName: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location / Link</label>
                <input
                  type="text"
                  placeholder="e.g. Zoom Link or Office address"
                  className="w-full p-2 border rounded  "
                  value={newInterview.location}
                  onChange={(e) => setNewInterview({ ...newInterview, location: e.target.value })}
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Confirm Schedule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white  rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Interview Feedback</h2>
              <button onClick={() => setShowFeedbackModal(false)}><XIcon className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Feedback Notes</label>
                <textarea
                  rows="5"
                  required
                  className="w-full p-2 border rounded  "
                  placeholder="How did the candidate perform?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsPage;
