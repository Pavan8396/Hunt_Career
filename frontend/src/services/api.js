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
    const errorMessage = error.message.includes('failed')
      ? error.message
      : `Signup failed: ${error.message}`;
    console.error('Signup error:', error.message);
    toast.error(error.message);
    throw new Error(error.message);
  }
};