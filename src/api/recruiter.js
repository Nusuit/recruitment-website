import axiosInstance from './config/axiosConfig';
import { objectToQueryString } from '../utils/helpers';

export const recruiterAPI = {
  // Job Management
  getJobs: async () => { // Get jobs posted by this recruiter
    try {
      const response = await axiosInstance.get('/api/recruiter/jobs');
      console.log("🔍 [recruiterAPI] Raw axios response:", response);
      console.log("🔍 [recruiterAPI] response.data:", response.data);
      console.log("🔍 [recruiterAPI] response.data.payload:", response.data.payload);
      
      // Return the full response.data so JobManagement can handle different structures
      return response.data;
    } catch (error) {
      console.error("🚨 [recruiterAPI] getJobs error:", error);
      throw error.response?.data || error;
    }
  },

  getJobDetail: async (jobId) => { // Get detail of a specific job
    try {
      const response = await axiosInstance.get(`/api/recruiter/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createJob: async (jobData) => { // Create a new job posting
    try {
      const response = await axiosInstance.post('/api/recruiter/jobs', jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateJob: async (jobId, jobData) => { // Update an existing job
    try {
      const response = await axiosInstance.put(`/api/recruiter/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteJob: async (jobId) => { // Delete a job posting
    try {
      const response = await axiosInstance.delete(`/api/recruiter/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Application Management
  getAllApplications: async (params = {}) => { // Get all applications for this recruiter
    try {
      const queryString = objectToQueryString(params);
      const response = await axiosInstance.get(`/api/recruiter/applications${queryString}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getApplicationDetail: async (applicationId) => { // Get detail of a specific application
    try {
      const response = await axiosInstance.get(`/api/recruiter/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateApplicationStatus: async (applicationId, status, notes = '') => { // Update application status
    try {
      const response = await axiosInstance.put(`/api/recruiter/applications/${applicationId}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Interview Management
  getInterviews: async () => {
    try {
      const response = await axiosInstance.get('/api/recruiter/interviews');
      console.log('🔍 [recruiterAPI] Raw axios response:', response);
      console.log('🔍 [recruiterAPI] response.data:', response.data);
      console.log('🔍 [recruiterAPI] response.data.payload:', response.data.payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateInterviewStatus: async (jobId, stageId, scheduleId, interviewId, accept) => {
    try {
      const url = scheduleId 
        ? `/api/recruiter/jobs/${jobId}/stages/${stageId}/schedules/${scheduleId}/interviews/${interviewId}?accept=${accept}`
        : `/api/recruiter/jobs/${jobId}/stages/${stageId}/interviews/${interviewId}?accept=${accept}`;
      
      const response = await axiosInstance.post(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  scheduleInterview: async (jobId, stageId, scheduleData) => {
    try {
      const response = await axiosInstance.post(
        `/api/recruiter/jobs/${jobId}/stages/${stageId}/schedules`,
        scheduleData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateInterview: async (jobId, stageId, scheduleId, scheduleData) => {
    try {
      const response = await axiosInstance.put(
        `/api/recruiter/jobs/${jobId}/stages/${stageId}/schedules/${scheduleId}`,
        scheduleData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getInterviewsForSchedule: async (jobId, stageId, scheduleId) => {
    try {
      const response = await axiosInstance.get(
        `/api/recruiter/jobs/${jobId}/stages/${stageId}/schedules/${scheduleId}/interviews`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  assignInterviewToSchedule: async (jobId, stageId, scheduleId, interviewId) => {
    try {
      const response = await axiosInstance.post(
        `/api/recruiter/jobs/${jobId}/stages/${stageId}/schedules/${scheduleId}/interviews/${interviewId}/assign`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  acceptOrRejectInterview: async (jobId, stageId, scheduleId, interviewId, accept) => {
    try {
      const response = await axiosInstance.post(
        `/api/recruiter/jobs/${jobId}/stages/${stageId}/schedules/${scheduleId}/interviews/${interviewId}`,
        null,
        { params: { accept } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get recruitment statistics
  getRecruitmentStats: async (params = {}) => {
    try {
      const queryString = objectToQueryString(params);
      const response = await axiosInstance.get(`/api/recruiter/stats${queryString}`);
      return response.data;
    } catch (error) {
      console.error("[recruiterAPI] getRecruitmentStats error:", error);
      throw error;
    }
  },

  // Dashboard-specific functions
  getDashboardStats: async () => {
    try {
      // Try to get stats from the existing endpoint first
      try {
        const response = await axiosInstance.get('/api/recruiter/dashboard/stats');
        return response.data;
      } catch (dashboardError) {
        // If dashboard endpoint doesn't exist, aggregate from available endpoints
        console.log("[recruiterAPI] Dashboard endpoint not found, aggregating stats...");
        
        const [jobsResponse, applicationsResponse] = await Promise.allSettled([
          axiosInstance.get('/api/recruiter/jobs'),
          axiosInstance.get('/api/recruiter/applications')
        ]);

        const jobs = jobsResponse.status === 'fulfilled' ? 
          (jobsResponse.value.data.content || []) : [];
        const applications = applicationsResponse.status === 'fulfilled' ? 
          (applicationsResponse.value.data.content || []) : [];

        // Calculate basic stats
        const activeJobs = jobs.filter(job => job.status === 'ACTIVE').length;
        const todayApplications = applications.filter(app => {
          const appDate = new Date(app.appliedDate || app.createdDate);
          const today = new Date();
          return appDate.toDateString() === today.toDateString();
        }).length;

        return {
          success: true,
          payload: {
            activeJobs,
            todayApplications,
            totalApplications: applications.length,
            totalJobs: jobs.length
          }
        };
      }
    } catch (error) {
      console.error("[recruiterAPI] getDashboardStats error:", error);
      throw error;
    }
  },

  getRecentApplications: async (params = { limit: 5 }) => {
    try {
      const response = await axiosInstance.get('/api/recruiter/applications', { params });
      const applications = response.data.content || [];
      
      // Sort by application date and limit
      const recentApplications = applications
        .sort((a, b) => new Date(b.appliedDate || b.createdDate) - new Date(a.appliedDate || a.createdDate))
        .slice(0, params.limit || 5);

      return {
        success: true,
        payload: {
          content: recentApplications
        }
      };
    } catch (error) {
      console.error("[recruiterAPI] getRecentApplications error:", error);
      return {
        success: true,
        payload: {
          content: []
        }
      };
    }
  },

  // Continue with existing getRecruitmentStats
  getExistingRecruitmentStats: async (params = {}) => {
    try {
      const queryString = objectToQueryString(params);
      const response = await axiosInstance.get(`/api/recruiter/stats${queryString}`);
      return response.data;
    } catch (error) {
      console.error("[recruiterAPI] getRecruitmentStats error:", error);
      throw error;
    }
  },

  // Get recruitment pipeline
  getRecruitmentPipeline: async (params = {}) => {
    try {
      const queryString = objectToQueryString(params);
      const response = await axiosInstance.get(`/api/recruiter/pipeline${queryString}`);
      return response.data;
    } catch (error) {
      console.error("[recruiterAPI] getRecruitmentPipeline error:", error);
      throw error;
    }
  },

  // Get stage information for an interview
  getInterviewStage: async (jobId, interviewId) => {
    try {
      // Since stage info is included in interview data, we'll use the interviews endpoint
      const response = await axiosInstance.get('/api/recruiter/interviews');
      const interviews = response.data.payload.content;
      const interview = interviews.find(i => i.interviewId === interviewId);
      
      if (!interview) {
        throw new Error('Interview not found');
      }
      
      return {
        success: true,
        payload: {
          id: interview.stageId,
          name: interview.stageName
        }
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get schedule information for an interview
  getInterviewSchedule: async (jobId, interviewId) => {
    try {
      // Since schedule info is included in interview data, we'll use the interviews endpoint
      const response = await axiosInstance.get('/api/recruiter/interviews');
      const interviews = response.data.payload.content;
      const interview = interviews.find(i => i.interviewId === interviewId);
      
      if (!interview) {
        throw new Error('Interview not found');
      }
      
      return {
        success: true,
        payload: {
          id: interview.scheduleId,
          name: interview.scheduleName,
          startTime: interview.scheduleStartTime,
          location: interview.scheduleLocation,
          interviewerName: interview.interviewerName
        }
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default recruiterAPI;
