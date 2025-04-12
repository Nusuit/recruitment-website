import axios from './axiosConfig';

export const candidateAPI = {
  // Lấy danh sách công việc
  getJobs: async (params) => {
    try {
      const response = await axios.get('/candidate/jobs', { params });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Ứng tuyển công việc
  applyJob: async (jobId, applicationData) => {
    try {
      const response = await axios.post(`/candidate/jobs/${jobId}/applications`, applicationData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Xem danh sách đơn ứng tuyển
  getApplications: async () => {
    try {
      const response = await axios.get('/candidate/applications');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Xem chi tiết đơn ứng tuyển
  getApplicationDetail: async (applicationId) => {
    try {
      const response = await axios.get(`/candidate/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Cập nhật profile
  updateProfile: async (profileData) => {
    try {
      const response = await axios.put('/candidate/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Upload CV
  uploadCV: async (cvFile) => {
    const formData = new FormData();
    formData.append('cv', cvFile);
    
    try {
      const response = await axios.post('/candidate/profile-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Upload avatar
  uploadAvatar: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      const response = await axios.post('/candidate/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};