import axiosInstance from './config/axiosConfig';

export const recruiterAPI = {
  getJobs: async () => {
    try {
      const response = await axiosInstance.get('/recruiter/jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getJobDetail: async (jobId) => {
    try {
      const response = await axiosInstance.get(`/recruiter/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getJobApplications: async (jobId) => {
    try {
      const response = await axiosInstance.get(`/recruiter/jobs/${jobId}/applications`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getApplicationDetail: async (applicationId) => {
    try {
      const response = await axiosInstance.get(
        `/recruiter/applications/${applicationId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getSkills: async () => {
    try {
      const response = await axiosInstance.get('/recruiter/skills');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createJob: async (jobData) => {
    try {
      const response = await axiosInstance.post('/recruiter/jobs', jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateJob: async (jobId, jobData) => {
    try {
      const response = await axiosInstance.put(`/recruiter/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteJob: async (jobId) => {
    try {
      const response = await axiosInstance.delete(`/recruiter/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateJobSkills: async (jobId, skills) => {
    try {
      const response = await axiosInstance.put(
        `/recruiter/jobs/${jobId}/skills`,
        { skills }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteJobSkills: async (jobId, skillId) => {
    try {
      const response = await axiosInstance.delete(
        `/recruiter/jobs/${jobId}/skills/${skillId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addApplicationNote: async (applicationId, note) => {
    try {
      const response = await axiosInstance.patch(
        `/recruiter/applications/${applicationId}/note`,
        { note }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await axiosInstance.patch(
        `/recruiter/applications/${applicationId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getRoles: async () => {
    try {
      const response = await axiosInstance.get('/recruiter/roles');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createRole: async (roleData) => {
    try {
      const response = await axiosInstance.post('/recruiter/roles', roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateRole: async (roleId, roleData) => {
    try {
      const response = await axiosInstance.put(`/recruiter/roles/${roleId}`, roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteRole: async (roleId) => {
    try {
      const response = await axiosInstance.delete(`/recruiter/roles/${roleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getJobAnalytics: async (params) => {
    try {
      const response = await axiosInstance.get('/recruiter/analytics/jobs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getApplicationAnalytics: async (params) => {
    try {
      const response = await axiosInstance.get('/recruiter/analytics/applications', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getRecruitmentMetrics: async (timeframe) => {
    try {
      const response = await axiosInstance.get(`/recruiter/analytics/metrics?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getRecruitmentAnalytics: async (params) => {
    try {
      const response = await axiosInstance.get('/recruiter/analytics/recruitment', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getInterviewAnalytics: async (params) => {
    try {
      const response = await axiosInstance.get('/recruiter/analytics/interviews', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAdminProfile: async () => {
    try {
      const response = await axiosInstance.get('/recruiter/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateAdminProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put('/recruiter/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateAdminPassword: async (passwordData) => {
    try {
      const response = await axiosInstance.put('/recruiter/password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadAdminAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await axiosInstance.post('/recruiter/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default recruiterAPI;