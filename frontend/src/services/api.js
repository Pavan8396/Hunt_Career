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

export const getApplicationForJob = async (jobId, token) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/application`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch application status');
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error('Error fetching application for job:', error);
    return null;
  }
};

export const getChatHistory = async (applicationId, token) => {
  try {
    const response = await fetch(`${API_URL}/chat/${applicationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching chat history:', error);
    toast.error('Could not load chat history.');
    throw error;
  }
};

export const deleteChatHistory = async (applicationId, token) => {
  try {
    const response = await fetch(`${API_URL}/chat/${applicationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete chat history');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting chat history:', error);
    toast.error('Could not delete chat history.');
    throw error;
  }
};

export const getEmployerDetails = async (employerId, token) => {
  try {
    const response = await fetch(`${API_URL}/employers/${employerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Could not fetch employer details.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching employer details:', error);
    toast.error('Could not fetch employer details.');
    throw error;
  }
}

export const getRecentActivity = async (token) => {
  try {
    const response = await fetch(`${API_URL}/employers/stats/recent-activity`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch recent activity');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    toast.error('Could not load recent activity.');
    throw error;
  }
};

export const getAppliedJobs = async (token) => {
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

// Admin API calls
export const getAdminStats = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch admin stats');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (token, params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/admin/users?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getAllEmployerNames = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/employers/names`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch employer names');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getAllEmployers = async (token, params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/admin/employers?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch employers');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId, userData, token) => {
    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error('Failed to update user');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updateEmployer = async (employerId, employerData, token) => {
    try {
        const response = await fetch(`${API_URL}/admin/employers/${employerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(employerData),
        });
        if (!response.ok) throw new Error('Failed to update employer');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteEmployer = async (employerId, token) => {
    try {
        const response = await fetch(`${API_URL}/admin/employers/${employerId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to delete employer');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const toggleUserStatus = async (userId, isActive, token) => {
    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isActive }),
        });
        if (!response.ok) throw new Error('Failed to update user status');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const toggleEmployerStatus = async (employerId, isActive, token) => {
    try {
        const response = await fetch(`${API_URL}/admin/employers/${employerId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isActive }),
        });
        if (!response.ok) throw new Error('Failed to update employer status');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const toggleUserAdminStatus = async (userId, isAdmin, token) => {
    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}/make-admin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isAdmin }),
        });
        if (!response.ok) throw new Error('Failed to update user admin status');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const submitReview = async (employerId, reviewData, token) => {
  try {
    const response = await fetch(`${API_URL}/employers/${employerId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || 'Failed to submit review');
    }
    return await response.json();
  } catch (error) {
    console.error('Error submitting review:', error.message);
    throw error; // Re-throw to be caught by the component
  }
};

export const getReviewsForEmployer = async (employerId) => {
  try {
    const response = await fetch(`${API_URL}/employers/${employerId}/reviews`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    toast.error('Could not load company reviews.');
    throw error;
  }
};

export const getUserProfile = async (token) => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    toast.error('Could not load your profile.');
    throw error;
  }
};

export const updateUserProfile = async (profileData, token, userId = null) => {
  try {
    const url = userId ? `${API_URL}/user/profile/${userId}` : `${API_URL}/user/profile`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    toast.error('Could not update profile.');
    throw error;
  }
};

export const getEmployerProfile = async (token) => {
  try {
    const response = await fetch(`${API_URL}/employers/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch employer profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching employer profile:', error);
    toast.error('Could not load company profile.');
    throw error;
  }
};

export const updateEmployerProfile = async (profileData, token) => {
  try {
    const response = await fetch(`${API_URL}/employers/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: profileData, // FormData will set its own Content-Type
    });
    if (!response.ok) {
      throw new Error('Failed to update employer profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating employer profile:', error);
    toast.error('Could not update company profile.');
    throw error;
  }
};

export const deleteAllJobs = async (token) => {
  try {
    const response = await fetch(`${API_URL}/jobs/delete-all`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      let errorMessage = 'Failed to delete all jobs';
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

export const deleteMultipleJobs = async (jobIds, token) => {
  try {
    const response = await fetch(`${API_URL}/jobs/delete-multiple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ jobIds }),
    });
    if (!response.ok) {
      let errorMessage = 'Failed to delete multiple jobs';
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

export const updateJob = async (jobId, jobData, token) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) {
      let errorMessage = 'Failed to update job';
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

export const getUserDetails = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Could not fetch user details.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user details:', error);
    toast.error('Could not fetch user details.');
    throw error;
  }
};

export const getApplicationsOverTime = async (token) => {
  try {
    const response = await fetch(`${API_URL}/employers/stats/applications-over-time`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch applications over time');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching applications over time:', error);
    toast.error('Could not load applications over time data.');
    throw error;
  }
}

export const getJobPostingsSummary = async (token) => {
  try {
    const response = await fetch(`${API_URL}/employers/stats/job-postings-summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch job postings summary');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching job postings summary:', error);
    toast.error('Could not load job postings summary data.');
    throw error;
  }
}

export const getEmployerApplications = async (token) => {
  try {
    const response = await fetch(`${API_URL}/employers/applications`, {
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
    const response = await fetch(`${API_URL}/employers/register`, {
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
    throw error;
  }
};

export const employerLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/employers/login`, {
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
    throw error;
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

export const getEmployerJobs = async (token, employerId) => {
  try {
    const url = employerId ? `${API_URL}/jobs/employer/${employerId}` : `${API_URL}/jobs/employers`;
    const response = await fetch(url, {
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
      const errorText = await response.text();
      throw new Error(`Failed to fetch applications: ${errorText || response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching applications for job:', error.message);
    toast.error('Failed to load applications.');
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId, status, token) => {
  try {
    const response = await fetch(`${API_URL}/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update status: ${errorText || response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating application status:', error.message);
    toast.error('Failed to update application status.');
    throw error;
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