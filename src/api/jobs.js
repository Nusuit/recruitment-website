import axiosInstance from "./config/axiosConfig";
import { objectToQueryString } from '../utils/helpers';

// Get all jobs with filtering, sorting, and pagination
export const getJobs = async (params = {}) => {
  try {
    // Add default pagination parameters if not provided
    const defaultParams = {
      page: params.page || 0,
      size: params.size || 10,
      sort: params.sort || 'createdAt,desc'
    };
    
    // Convert filter parameters to match backend JobFilterDto
    const filterParams = {
      title: params.title || '',
      industry: params.industry || '',
      deadlineFrom: params.deadlineFrom || '',
      deadlineTo: params.deadlineTo || '',
      minSalary: params.minSalary || '',
      maxSalary: params.maxSalary || ''
    };

    // Merge pagination and filter parameters
    const queryParams = {
      ...defaultParams,
      ...filterParams
    };

    const queryString = objectToQueryString(queryParams);
    const response = await axiosInstance.get(`/api/applicant/jobs${queryString}`);
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Failed to fetch jobs');
    }
    
    return response.data;
  } catch (error) {
    console.error("[jobsAPI] getJobs error:", error);
    throw error;
  }
};

// Get job by ID
export const getJobById = async (jobId) => {
  try {
    const response = await axiosInstance.get(`/api/applicant/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("[jobsAPI] getJobById error:", error);
    throw error;
  }
};

// Create new job (for recruiters)
export const createJob = async (jobData) => {
  try {
    const response = await axiosInstance.post('/recruiter/jobs', jobData);
    return response.data.payload;
  } catch (error) {
    console.error("[jobsAPI] createJob error:", error);
    throw error;
  }
};

// Update job (for recruiters)
export const updateJob = async (jobId, jobData) => {
  try {
    const response = await axiosInstance.put(`/recruiter/jobs/${jobId}`, jobData);
    return response.data.payload;
  } catch (error) {
    console.error("[jobsAPI] updateJob error:", error);
    throw error;
  }
};

// Cancel job (for recruiters)
export const cancelJob = async (jobId, reason) => {
  try {
    const response = await axiosInstance.patch(`/recruiter/jobs/${jobId}/cancel`, { reason });
    return response.data.payload;
  } catch (error) {
    console.error("[jobsAPI] cancelJob error:", error);
    throw error;
  }
};

// Apply for a job
export const applyForJob = async (jobId, application) => {
  try {
    const response = await axiosInstance.post(`/api/applicant/jobs/${jobId}`, application);
    return response.data;
  } catch (error) {
    console.error("[jobsAPI] applyForJob error:", error);
    throw error;
  }
};

// Get job categories
export const getJobCategories = async () => {
  try {
    const response = await axiosInstance.get('/recruiter/skills');
    return response.data.payload;
  } catch (error) {
    console.error("[jobsAPI] getJobCategories error:", error);
    throw error;
  }
};

// Get recruitment processes
export const getRecruitmentProcesses = async (params = {}) => {
  try {
    const queryString = objectToQueryString(params);
    const response = await axiosInstance.get(`/recruiter/processes?${queryString}`);
    return response.data.payload;
  } catch (error) {
    console.error("[jobsAPI] getRecruitmentProcesses error:", error);
    throw error;
  }
};

// Save job for later
export const saveJob = async (jobId) => {
  try {
    const response = await axiosInstance.post(`/applicant/saved-jobs/${jobId}`);
    return response.data.payload;
  } catch (error) {
    console.error("[jobsAPI] saveJob error:", error);
    throw error;
  }
};

// Unsave job
export const unsaveJob = async (jobId) => {
  try {
    const response = await axiosInstance.delete(`/applicant/saved-jobs/${jobId}`);
    return response.data.payload;
  } catch (error) {
    console.error("[jobsAPI] unsaveJob error:", error);
    throw error;
  }
};

// Get saved jobs
export const getSavedJobs = async (params = {}) => {
  try {
    const queryString = objectToQueryString(params);
    const response = await axiosInstance.get(`/applicant/saved-jobs?${queryString}`);
    return response.data.payload;
  } catch (error) {
    console.error("[jobsAPI] getSavedJobs error:", error);
    throw error;
  }
};
