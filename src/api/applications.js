import axios from 'axios';
import { objectToQueryString } from '../utils/helpers';

// Create axios instance for applications API
const applicationsAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
applicationsAPI.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Get user applications (for applicants)
export const getUserApplications = async (params = {}) => {
  try {
    const queryString = objectToQueryString(params);
    const response = await applicationsAPI.get(`/applications${queryString}`);
    
    return {
      success: true,
      applications: response.data.applications,
      totalApplications: response.data.totalApplications,
      totalPages: response.data.totalPages
    };
  } catch (error) {
    console.error('Get user applications error:', error);
    
    const errorMessage = error.response?.data?.message || 'Failed to fetch applications.';
    return { success: false, error: errorMessage };
  }
};

// Get application details
export const getApplicationById = async (applicationId) => {
  try {
    const response = await applicationsAPI.get(`/applications/${applicationId}`);
    
    return {
      success: true,
      application: response.data.application
    };
  } catch (error) {
    console.error(`Get application ${applicationId} error:`, error);
    
    const errorMessage = error.response?.data?.message || 'Failed to fetch application details.';
    return { success: false, error: errorMessage };
  }
};

// Get applications for a job (for admins)
export const getJobApplications = async (jobId, params = {}) => {
  try {
    const queryString = objectToQueryString(params);
    const response = await applicationsAPI.get(`/jobs/${jobId}/applications${queryString}`);
    
    return {
      success: true,
      applications: response.data.applications,
      totalApplications: response.data.totalApplications,
      totalPages: response.data.totalPages
    };
  } catch (error) {
    console.error(`Get applications for job ${jobId} error:`, error);
    
    const errorMessage = error.response?.data?.message || 'Failed to fetch job applications.';
    return { success: false, error: errorMessage };
  }
};

// Update application status (for admins)
export const updateApplicationStatus = async (applicationId, status, notes = '') => {
  try {
    const response = await applicationsAPI.put(`/applications/${applicationId}/status`, {
      status,
      notes
    });
    
    return {
      success: true,
      application: response.data.application
    };
  } catch (error) {
    console.error(`Update application ${applicationId} status error:`, error);
    
    const errorMessage = error.response?.data?.message || 'Failed to update application status.';
    return { success: false, error: errorMessage };
  }
};

// Schedule interview (for admins)
export const scheduleInterview = async (applicationId, interviewData) => {
  try {
    const response = await applicationsAPI.post(`/applications/${applicationId}/interview`, interviewData);
    
    return {
      success: true,
      interview: response.data.interview
    };
  } catch (error) {
    console.error(`Schedule interview for application ${applicationId} error:`, error);
    
    const errorMessage = error.response?.data?.message || 'Failed to schedule interview.';
    return { success: false, error: errorMessage };
  }
};

// Get interview details
export const getInterviewDetails = async (applicationId) => {
  try {
    const response = await applicationsAPI.get(`/applications/${applicationId}/interview`);
    
    return {
      success: true,
      interview: response.data.interview
    };
  } catch (error) {
    console.error(`Get interview details for application ${applicationId} error:`, error);
    
    const errorMessage = error.response?.data?.message || 'Failed to fetch interview details.';
    return { success: false, error: errorMessage };
  }
};

// Withdraw application (for applicants)
export const withdrawApplication = async (applicationId) => {
  try {
    const response = await applicationsAPI.put(`/applications/${applicationId}/withdraw`);
    
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error(`Withdraw application ${applicationId} error:`, error);
    
    const errorMessage = error.response?.data?.message || 'Failed to withdraw application.';
    return { success: false, error: errorMessage };
  }
};

// Get application statistics (for admins)
export const getApplicationStats = async () => {
  try {
    const response = await applicationsAPI.get('/applications/stats');
    
    return {
      success: true,
      stats: response.data.stats
    };
  } catch (error) {
    console.error('Get application stats error:', error);
    
    const errorMessage = error.response?.data?.message || 'Failed to fetch application statistics.';
    return { success: false, error: errorMessage };
  }
};

// Download resume
export const downloadResume = async (applicationId) => {
  try {
    const response = await applicationsAPI.get(`/applications/${applicationId}/resume`, {
      responseType: 'blob'
    });
    
    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `resume_${applicationId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return { success: true };
  } catch (error) {
    console.error(`Download resume for application ${applicationId} error:`, error);
    
    const errorMessage = 'Failed to download resume.';
    return { success: false, error: errorMessage };
  }
};

export default {
  getUserApplications,
  getApplicationById,
  getJobApplications,
  updateApplicationStatus,
  scheduleInterview,
  getInterviewDetails,
  withdrawApplication,
  getApplicationStats,
  downloadResume
};