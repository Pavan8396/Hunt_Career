import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostJob from '../components/PostJob';
import { fetchJobById } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const PostJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [jobData, setJobData] = useState(null);

  useEffect(() => {
    if (id) {
      const getJobData = async () => {
        try {
          const data = await fetchJobById(id);
          setJobData(data);
        } catch (error) {
          console.error('Failed to fetch job data:', error);
        }
      };
      getJobData();
    }
  }, [id]);

  const handleJobPosted = (updatedJob) => {
    if (user && user.isAdmin && updatedJob) {
      navigate(`/admin/employer/${updatedJob.employer}/jobs`);
    } else {
      navigate('/employer/posted-jobs');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Job' : 'Post a New Job'}</h1>
      {(jobData || !id) && <PostJob onJobPosted={handleJobPosted} jobData={jobData} />}
    </div>
  );
};

export default PostJobPage;
