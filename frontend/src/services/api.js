import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchJobs = async (searchTerm = '', locations = [], jobTypes = []) => {
  const query = new URLSearchParams();
  if (searchTerm) query.set('search', searchTerm);
  if (locations.length) query.set('locations', locations.join(';'));
  if (jobTypes.length) query.set('jobTypes', jobTypes.join(','));

  try {
    console.log('Sending request to fetch jobs with params:', query.toString());
    const response = await fetch(`${API_URL}/jobs?${query.toString()}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch jobs: ${errorText || response.statusText}`);
    }
    const data = await response.json();
    console.log('Fetch jobs response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    toast.error(`Failed to fetch jobs: ${error.message}. Please try again.`);
    throw error;
  }
};

export const fetchJobById = async (id) => {
  try {
    console.log(`Sending request to fetch job by ID: ${id}`);
    const response = await fetch(`${API_URL}/jobs/${id}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch job: ${errorText || response.statusText}`);
    }
    const data = await response.json();
    console.log(`Fetch job by ID ${id} response:`, data);
    return data;
  } catch (error) {
    console.error('Error fetching job by ID:', error.message);
    toast.error(`Failed to fetch job details: ${error.message}. Please try again.`);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    console.log('Sending login request with email:', email);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        console.warn('Could not parse error response:', jsonError);
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    console.log('Login response:', data);
    return data;
  } catch (error) {
    console.error('Login error:', error.message);
    throw new Error(error.message);
  }
};

export const getEmployerApplications = async (token) => {
  try {
    const response = await fetch(`${API_URL}/employer/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      let errorMessage = 'Failed to fetch employer applications';
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        console.warn('Could not parse error response:', jsonError);
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const deleteJob = async (jobId, token) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      let errorMessage = 'Failed to delete job';
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        console.warn('Could not parse error response:', jsonError);
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const employerSignup = async (companyName, email, password) => {
  try {
    const response = await fetch(`${API_URL}/employer/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ companyName, email, password }),
    });
    if (!response.ok) {
      let errorMessage = 'Signup failed';
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        console.warn('Could not parse error response:', jsonError);
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error(`Signup failed: ${error.message}`);
    throw new Error(`Signup failed: ${error.message}`);
  }
};

export const employerLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/employer/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        console.warn('Could not parse error response:', jsonError);
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error(`Login failed: ${error.message}`);
    throw new Error(`Login failed: ${error.message}`);
  }
};

export const createJob = async (jobData, token) => {
  try {
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) {
      let errorMessage = 'Failed to create job';
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        console.warn('Could not parse error response:', jsonError);
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const getEmployerJobs = async (token) => {
  try {
    const response = await fetch(`${API_URL}/jobs/employer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      let errorMessage = 'Failed to fetch employer jobs';
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        console.warn('Could not parse error response:', jsonError);
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const getApplicationsForJob = async (jobId, token) => {
  try {
    const response = await fetch(`${API_URL}/applications/job/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      let errorMessage = 'Failed to fetch applications';
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        console.warn('Could not parse error response:', jsonError);
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const shortlistCandidate = async (applicationId, token) => {
  try {
    const response = await fetch(`${API_URL}/applications/shortlist/${applicationId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      let errorMessage = 'Failed to shortlist candidate';
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        console.warn('Could not parse error response:', jsonError);
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const applyForJob = async (jobId, token) => {
  try {
    const response = await fetch(`${API_URL}/applications/apply/${jobId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      let errorMessage = 'Failed to apply for job';
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        console.warn('Could not parse error response:', jsonError);
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const getUserApplications = async (token) => {
  try {
    const response = await fetch(`${API_URL}/user/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user applications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user applications:', error);
    toast.error('Could not load your application history.');
    throw error;
  }
};

export const getUserAppliedJobs = async (token) => {
  try {
    const response = await fetch(`${API_URL}/user/applied-jobs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch applied jobs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    toast.error('Could not load your applied jobs.');
    throw error;
  }
};

export const getApplicationsOverTimeStats = async (token) => {
  try {
    const response = await fetch(`${API_URL}/employer/stats/applications-over-time`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch applications over time stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching applications over time stats:', error);
    toast.error('Could not load applications over time stats.');
    throw error;
  }
};

export const getJobPostingsSummaryStats = async (token) => {
  try {
    const response = await fetch(`${API_URL}/employer/stats/job-postings-summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch job postings summary stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching job postings summary stats:', error);
    toast.error('Could not load job postings summary stats.');
    throw error;
  }
};

export const signup = async (firstName, lastName, email, password, phoneNumber) => {
  try {
    console.log('Sending signup request with email:', email);
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, password, phoneNumber }),
    });
    if (!response.ok) {
      let errorMessage = 'Signup failed';
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        console.warn('Could not parse error response:', jsonError);
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    console.log('Signup response:', data);
    return data;
  } catch (error) {
    console.error('Signup error:', error.message);
    toast.error(error.message);
    throw new Error(error.message);
  }
};