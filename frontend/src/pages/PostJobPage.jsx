import React from 'react';
import PostJob from '../components/PostJob';
import { getEmployerJobs } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const PostJobPage = () => {
    const { token } = useContext(AuthContext);
    const fetchJobs = async () => {
        try {
          await getEmployerJobs(token);
        } catch (error) {
          console.error('Failed to fetch employer jobs:', error);
        }
      };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Post a New Job</h1>
      <PostJob onJobPosted={fetchJobs} />
    </div>
  );
};

export default PostJobPage;
