import axios from 'axios';
import { objectToQueryString } from '../utils/helpers';

// Create axios instance for jobs API
const jobsAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
jobsAPI.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Get all jobs with filtering, sorting, and pagination
export const getJobs = async (params = {}) => {
  try {
    const queryString = objectToQueryString(params);
    const response = await jobsAPI.get(`/jobs${queryString}`);
    
    return {
      success: true,
      jobs: response.data.jobs,
      totalJobs: response.data.totalJobs,
      totalPages: response.data.totalPages
    };
  } catch (error) {
    console.error('Get jobs error:', error);
    
    const errorMessage = error.response?.data?.message || 'Failed to fetch jobs.';
    return { success: false, error: errorMessage };
  }
};

// Get job by ID
export const getJobById = async (jobId) => {
  try {
    const response = await jobsAPI.get(`/jobs/${jobId}`);
    
    return {
      success: true,
      job: response.data.job
    };
  } catch (error) {
    console.error(`Get job ${jobId} error:`, error);
    
    const errorMessage = error.response?.data?.message || 'Failed to fetch job details.';
    return { success: false, error: errorMessage };
  }
};

// Create new job (admin only)
export const createJob = async (jobData) => {
  try {
    const response = await jobsAPI.post('/jobs', jobData);
    
    return {
      success: true,
      job: response.data.job
    };
  } catch (error) {
    console.error('Create job error:', error);
    
    const errorMessage = error.response?.data?.message || 'Failed to create job.';
    return { success: false, error: errorMessage };
  }
};

// Update job (admin only)
export const updateJob = async (jobId, jobData) => {
  try {
    const response = await jobsAPI.put(`/jobs/${jobId}`, jobData);
    
    return {
      success: true,
      job: response.data.job
    };
  } catch (error) {
    console.error(`Update job ${jobId} error:`, error);
    
    const errorMessage = error.response?.data?.message || 'Failed to update job.';
    return { success: false, error: errorMessage };
  }
};

// Delete job (admin only)
export const deleteJob = async (jobId) => {
  try {
    await jobsAPI.delete(`/jobs/${jobId}`);
    
    return { success: true };
  } catch (error) {
    console.error(`Delete job ${jobId} error:`, error);
    
    const errorMessage = error.response?.data?.message || 'Failed to delete job.';
    return { success: false, error: errorMessage };
  }
};

// Save job for user
export const saveJob = async (jobId) => {
  try {
    const response = await jobsAPI.post(`/jobs/${jobId}/save`);
    
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error(`Save job ${jobId} error:`, error);
    
    const errorMessage = error.response?.data?.message || 'Failed to save job.';
    return { success: false, error: errorMessage };
  }
};

// Unsave job for user
export const unsaveJob = async (jobId) => {
  try {
    const response = await jobsAPI.delete(`/jobs/${jobId}/save`);
    
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error(`Unsave job ${jobId} error:`, error);
    
    const errorMessage = error.response?.data?.message || 'Failed to unsave job.';
    return { success: false, error: errorMessage };
  }
};

// Get saved jobs for user
export const getSavedJobs = async (params = {}) => {
  try {
    const queryString = objectToQueryString(params);
    const response = await jobsAPI.get(`/jobs/saved${queryString}`);
    
    return {
      success: true,
      jobs: response.data.jobs,
      totalJobs: response.data.totalJobs,
      totalPages: response.data.totalPages
    };
  } catch (error) {
    console.error('Get saved jobs error:', error);
    
    const errorMessage = error.response?.data?.message || 'Failed to fetch saved jobs.';
    return { success: false, error: errorMessage };
  }
};

// Check if job is saved by user
export const isJobSaved = async (jobId) => {
  try {
    const response = await jobsAPI.get(`/jobs/${jobId}/saved`);
    
    return {
      success: true,
      isSaved: response.data.isSaved
    };
  } catch (error) {
    console.error(`Check if job ${jobId} is saved error:`, error);
    
    return { success: false, isSaved: false };
  }
};

// Apply for job
export const applyForJob = async (jobId, applicationData) => {
  try {
    // For file uploads, use FormData
    const formData = new FormData();
    
    // Append application fields
    Object.keys(applicationData).forEach(key => {
      if (key === 'resume') {
        // Resume is a File object
        formData.append('resume', applicationData.resume);
      } else {
        formData.append(key, applicationData[key]);
      }
    });
    
    const response = await jobsAPI.post(`/jobs/${jobId}/apply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return {
      success: true,
      application: response.data.application
    };
  } catch (error) {
    console.error(`Apply for job ${jobId} error:`, error);
    
    const errorMessage = error.response?.data?.message || 'Failed to submit application.';
    return { success: false, error: errorMessage };
  }
};

// Get job categories
export const getJobCategories = async () => {
  try {
    const response = await jobsAPI.get('/jobs/categories');
    
    return {
      success: true,
      categories: response.data.categories
    };
  } catch (error) {
    console.error('Get job categories error:', error);
    
    const errorMessage = error.response?.data?.message || 'Failed to fetch job categories.';
    return { success: false, error: errorMessage };
  }
};

// Get job statistics (admin only)
export const getJobStats = async () => {
  try {
    const response = await jobsAPI.get('/jobs/stats');
    
    return {
      success: true,
      stats: response.data.stats
    };
  } catch (error) {
    console.error('Get job stats error:', error);
    
    const errorMessage = error.response?.data?.message || 'Failed to fetch job statistics.';
    return { success: false, error: errorMessage };
  }
};

export default {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  saveJob,
  unsaveJob,
  getSavedJobs,
  isJobSaved,
  applyForJob,
  getJobCategories,
  getJobStats
};