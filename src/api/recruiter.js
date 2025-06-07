import axiosInstance from './config/axiosConfig';
import { objectToQueryString } from '../utils/helpers';

export const recruiterAPI = {
  // Job Management
  getJobs: async () => { // Get jobs posted by this recruiter
    try {
      const response = await axiosInstance.get('/recruiter/jobs');
      return response.data.payload; // Assuming jobs are in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getJobDetail: async (jobId) => { // Get detail of a specific job
    try {
      const response = await axiosInstance.get(`/recruiter/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createJob: async (jobData) => { // Create new job
    try {
      const response = await axiosInstance.post('/recruiter/jobs', jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateJob: async (jobId, jobData) => { // Update existing job
    try {
      const response = await axiosInstance.put(`/recruiter/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteJob: async (jobId) => { // Delete a job
    try {
      const response = await axiosInstance.delete(`/recruiter/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  cancelJob: async (jobId, reason) => { // Cancel a job (new endpoint)
    try {
      const response = await axiosInstance.patch(`/recruiter/jobs/${jobId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Application Management (now under recruiter)
  getAllApplications: async (params) => { // Get all applications (for all jobs or filtered)
    try {
      const response = await axiosInstance.get('/recruiter/applications', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getApplicationDetailsForAdmin: async (applicationId) => { // Get detail of a specific application
    try {
      const response = await axiosInstance.get(`/recruiter/applications/${applicationId}`);
      return response.data.payload; // Assuming applications are in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateApplicationStatus: async (applicationId, status) => { // Update application status
    try {
      const response = await axiosInstance.patch(
        `/recruiter/applications/${applicationId}/status`,
        status
      ); // status is already an object {status: newStatus}
      return response.data.payload; // Assuming updated application or success message in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addApplicationNote: async (applicationId, note) => { // Add/update recruiter note
    try {
      const response = await axiosInstance.patch(
        `/recruiter/applications/${applicationId}/note`,
        note
      );
      return response.data.payload; // Assuming updated application or success message in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Skill & Process Management (newly grouped under recruiter)
  getSkills: async (params) => { // Get list of skills
    try {
      const response = await axiosInstance.get('/recruiter/skills', { params });
      return response.data.payload; // Assuming skills are in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getRecruitmentProcesses: async (params) => { // Get list of recruitment processes
    try {
      const response = await axiosInstance.get('/recruiter/processes', { params });
      return response.data.payload; // Assuming processes are in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Schedule Management (newly grouped under recruiter)
  createSchedule: async (jobId, stageId, scheduleData) => {
    try {
      const response = await axiosInstance.post(`/recruiter/jobs/${jobId}/stages/${stageId}/schedules`, scheduleData);
      return response.data.payload; // Assuming created schedule in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getSchedules: async (jobId, stageId, params) => {
    try {
      const response = await axiosInstance.get(`/recruiter/jobs/${jobId}/stages/${stageId}/schedules`, { params });
      return response.data.payload; // Assuming schedules are in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateSchedule: async (jobId, stageId, scheduleId, scheduleData) => {
    try {
      const response = await axiosInstance.put(`/recruiter/jobs/${jobId}/stages/${stageId}/schedules/${scheduleId}`, scheduleData);
      return response.data.payload; // Assuming updated schedule in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUnassignedInterviews: async (jobId, stageId) => {
    try {
      const response = await axiosInstance.get(`/recruiter/jobs/${jobId}/stages/${stageId}/schedules/interviews/unassigned`);
      return response.data.payload; // Assuming unassigned interviews in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  assignInterviewToSchedule: async (jobId, stageId, scheduleId, interviewId) => {
    try {
      const response = await axiosInstance.post(`/recruiter/jobs/${jobId}/stages/${stageId}/schedules/${scheduleId}/interviews/${interviewId}/assign`);
      return response.data.payload; // Assuming success in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  acceptRejectInterviewResult: async (jobId, stageId, scheduleId, interviewId, accept) => {
    try {
      const response = await axiosInstance.post(`/recruiter/jobs/${jobId}/stages/${stageId}/schedules/${scheduleId}/interviews/${interviewId}?accept=${accept}`);
      return response.data.payload; // Assuming success in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // User & Role Management (now under recruiter)
  getUsersList: async (params) => { // Get all users (admin function)
    try {
      const response = await axiosInstance.get('/recruiter/users', { params });
      return response.data.payload; // Assuming users are in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUserStatus: async (userId, status) => { // Update user status (admin function)
    try {
      const response = await axiosInstance.patch(`/recruiter/users/${userId}/status`, status);
      return response.data.payload; // Assuming updated user or success message in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUserRole: async (userId, role) => { // Update user role (admin function)
    try {
      const response = await axiosInstance.patch(`/recruiter/users/${userId}/role`, role);
      return response.data.payload; // Assuming updated user or success message in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getRoles: async () => { // Get all roles (admin function)
    try {
      const response = await axiosInstance.get('/recruiter/roles');
      return response.data.payload; // Assuming roles are in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createRole: async (roleData) => { // Create a new role (admin function)
    try {
      const response = await axiosInstance.post('/recruiter/roles', roleData);
      return response.data.payload; // Assuming created role in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateRole: async (roleId, roleData) => { // Update a role (admin function)
    try {
      const response = await axiosInstance.put(`/recruiter/roles/${roleId}`, roleData);
      return response.data.payload; // Assuming updated role in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteRole: async (roleId) => { // Delete a role (admin function)
    try {
      const response = await axiosInstance.delete(`/recruiter/roles/${roleId}`);
      return response.data.payload; // Assuming success message in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Analytics & Reports (now under recruiter)
  getJobAnalytics: async (params) => {
    try {
      const response = await axiosInstance.get('/recruiter/analytics/jobs', { params });
      return response.data.payload; // Assuming job analytics data in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getApplicantAnalyticsData: async (params) => {
    try {
      const response = await axiosInstance.get('/recruiter/analytics/applicants', { params });
      return response.data.payload; // Assuming applicant analytics data in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getOverallRecruitmentAnalytics: async (params) => {
    try {
      const response = await axiosInstance.get('/recruiter/analytics/recruitment-overall', { params });
      return response.data.payload; // Assuming overall recruitment analytics data in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getInterviewFunnelAnalytics: async (params) => {
    try {
      const response = await axiosInstance.get('/recruiter/analytics/interview-funnel', { params });
      return response.data.payload; // Assuming interview funnel analytics data in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Company Profile Management (now under recruiter)
  getCompanyProfileDetails: async () => {
    try {
      const response = await axiosInstance.get('/recruiter/company-profile');
      return response.data.payload; // Assuming company profile data in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateCompanyProfileDetails: async (profileData) => {
    try {
      const response = await axiosInstance.put('/recruiter/company-profile', profileData);
      return response.data.payload; // Assuming updated company profile data in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadCompanyLogoFile: async (formData) => {
    try {
      const response = await axiosInstance.post('/recruiter/company-profile/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.payload; // Assuming uploaded logo URL in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getSystemSettings: async () => {
    try {
      const response = await axiosInstance.get('/recruiter/settings');
      return response.data.payload; // Assuming settings data in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateSystemSettings: async (settingsData) => {
    try {
      const response = await axiosInstance.put('/recruiter/settings', settingsData);
      return response.data.payload; // Assuming updated settings data in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // General
  getNotifications: async (params) => {
    try {
      const response = await axiosInstance.get('/recruiter/notifications', { params });
      return response.data.payload; // Assuming notifications in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await axiosInstance.patch(`/recruiter/notifications/${notificationId}/read`);
      return response.data.payload; // Assuming success message in payload
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin/Recruiter's own profile (now under recruiter)
  getAdminProfile: async () => { // Renamed from getRecruiterProfile
    try {
      const response = await axiosInstance.get('/recruiter/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateAdminProfile: async (profileData) => { // Renamed from updateRecruiterProfile
    try {
      const response = await axiosInstance.patch('/recruiter/profile/info', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadAdminAvatar: async (file) => { // Renamed from uploadRecruiterAvatar
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await axiosInstance.patch('/recruiter/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get recruiter profile
  getRecruiterProfile: async () => {
    try {
      const response = await axiosInstance.get('/api/recruiter/profile');
      return response.data;
    } catch (error) {
      console.error("[recruiterAPI] getRecruiterProfile error:", error);
      throw error;
    }
  },

  // Update recruiter profile
  updateRecruiterProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put('/api/recruiter/profile', profileData);
      return response.data;
    } catch (error) {
      console.error("[recruiterAPI] updateRecruiterProfile error:", error);
      throw error;
    }
  },

  // Get company profile
  getCompanyProfile: async () => {
    try {
      const response = await axiosInstance.get('/api/recruiter/company');
      return response.data;
    } catch (error) {
      console.error("[recruiterAPI] getCompanyProfile error:", error);
      throw error;
    }
  },

  // Update company profile
  updateCompanyProfile: async (companyData) => {
    try {
      const response = await axiosInstance.put('/api/recruiter/company', companyData);
      return response.data;
    } catch (error) {
      console.error("[recruiterAPI] updateCompanyProfile error:", error);
      throw error;
    }
  },

  // Upload company logo
  uploadCompanyLogo: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post('/api/recruiter/company/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("[recruiterAPI] uploadCompanyLogo error:", error);
      throw error;
    }
  },

  // Get recruitment team members
  getTeamMembers: async () => {
    try {
      const response = await axiosInstance.get('/api/recruiter/team');
      return response.data;
    } catch (error) {
      console.error("[recruiterAPI] getTeamMembers error:", error);
      throw error;
    }
  },

  // Add team member
  addTeamMember: async (memberData) => {
    try {
      const response = await axiosInstance.post('/api/recruiter/team', memberData);
      return response.data;
    } catch (error) {
      console.error("[recruiterAPI] addTeamMember error:", error);
      throw error;
    }
  },

  // Update team member
  updateTeamMember: async (memberId, memberData) => {
    try {
      const response = await axiosInstance.put(`/api/recruiter/team/${memberId}`, memberData);
      return response.data;
    } catch (error) {
      console.error("[recruiterAPI] updateTeamMember error:", error);
      throw error;
    }
  },

  // Remove team member
  removeTeamMember: async (memberId) => {
    try {
      const response = await axiosInstance.delete(`/api/recruiter/team/${memberId}`);
      return response.data;
    } catch (error) {
      console.error("[recruiterAPI] removeTeamMember error:", error);
      throw error;
    }
  },

  // Get recruitment statistics
  getRecruitmentStats: async (params = {}) => {
    try {
      const queryString = objectToQueryString(params);
      const response = await axiosInstance.get(`/api/recruiter/stats?${queryString}`);
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
      const response = await axiosInstance.get(`/api/recruiter/pipeline?${queryString}`);
      return response.data;
    } catch (error) {
      console.error("[recruiterAPI] getRecruitmentPipeline error:", error);
      throw error;
    }
  },
};

export default recruiterAPI;
