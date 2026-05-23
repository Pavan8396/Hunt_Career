import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { createJob, updateJob } from '../services/api';
import ReactMarkdown from 'react-markdown';

const PostJob = ({ onJobPosted, jobData }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    candidate_required_location: '',
    job_type: 'Full-Time',
    status: 'Open',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (jobData) {
      setFormData({
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        candidate_required_location: jobData.candidate_required_location,
        job_type: jobData.job_type,
        status: jobData.status || 'Open',
      });
    }
  }, [jobData]);

  const { title, company, description, candidate_required_location, job_type, status } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error('Job title is required');
      return;
    }
    if (!company) {
      toast.error('Company name is required');
      return;
    }
    if (!description) {
      toast.error('Description is required');
      return;
    }
    if (!candidate_required_location) {
      toast.error('Location is required');
      return;
    }

    setIsLoading(true);
    try {
      if (jobData) {
        const updatedJob = await updateJob(jobData._id, formData, token);
        toast.success('Job updated successfully!');
        if (onJobPosted) {
          onJobPosted(updatedJob);
        }
      } else {
        const newJob = await createJob(formData, token);
        toast.success('Job posted successfully!');
        if (onJobPosted) {
          onJobPosted(newJob);
        }
      }
      setFormData({
        title: '',
        company: '',
        description: '',
        candidate_required_location: '',
        job_type: 'Full-Time',
      });
    } catch (error) {
      if (error.message.includes('A job with the same title and company already exists.')) {
        //toast.error('A job with the same title and company already exists.');
      } else {
        toast.error(`Failed to ${jobData ? 'update' : 'post'} job.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 ">Job Title</label>
        <input type="text" id="title" value={title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm   " />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 ">Company</label>
        <input type="text" id="company" value={company} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm   " />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 ">Description (Markdown Supported)</label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs text-blue-600 hover:underline"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
        {showPreview ? (
          <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50 min-h-[150px] prose prose-sm max-w-none">
             <ReactMarkdown>{description || '*No description entered*'}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            id="description"
            value={description}
            onChange={handleChange}
            rows="6"
            placeholder="Use markdown for formatting (e.g. ## for headers, * for bullets)"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        )}
      </div>
      <div>
        <label htmlFor="candidate_required_location" className="block text-sm font-medium text-gray-700 ">Location</label>
        <input type="text" id="candidate_required_location" value={candidate_required_location} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm   " />
      </div>
      <div>
        <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 ">Job Type</label>
        <select id="job_type" value={job_type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm   ">
          <option>Full-Time</option>
          <option>Part-Time</option>
          <option>Contract</option>
          <option>Internship</option>
          <option>Freelance</option>
        </select>
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 ">Status</label>
        <select id="status" value={status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm   ">
          <option value="Open">Open (Active)</option>
          <option value="Closed">Closed</option>
          <option value="Draft">Draft</option>
        </select>
      </div>
      <button type="submit" disabled={isLoading} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        {isLoading ? (jobData ? 'Updating...' : 'Posting...') : (jobData ? 'Update Job' : 'Post Job')}
      </button>
    </form>
  );
};

export default PostJob;
