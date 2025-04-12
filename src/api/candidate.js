import axiosInstance from './config/axiosConfig';

export const candidateAPI = {
  getJobs: async (params) => {
    try {
      const response = await axiosInstance.get('/candidate/jobs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  applyJob: async (jobId, applicationData) => {
    try {
      const response = await axiosInstance.post(
        `/candidate/jobs/${jobId}/applications`,
        applicationData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getApplications: async () => {
    try {
      const response = await axiosInstance.get('/candidate/applications');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getApplicationDetail: async (applicationId) => {
    try {
      const response = await axiosInstance.get(`/candidate/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateApplication: async (applicationId, data) => {
    try {
      const response = await axiosInstance.put(
        `/candidate/applications/${applicationId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteApplication: async (applicationId) => {
    try {
      const response = await axiosInstance.delete(
        `/candidate/applications/${applicationId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/candidate/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put('/candidate/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadCV: async (file) => {
    try {
      const formData = new FormData();
      formData.append('cv', file);
      
      const response = await axiosInstance.post('/candidate/profile-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axiosInstance.post('/candidate/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getGenders: async () => {
    try {
      const response = await axiosInstance.get('/candidate/genders');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default candidateAPI;