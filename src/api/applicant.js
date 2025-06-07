import axiosInstance from './config/axiosConfig';

export const applicantAPI = {
  getJobs: async (params) => {
    try {      const response = await axiosInstance.get('/applicant/jobs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getMySavedJobs: async () => {
    try {
      const response = await axiosInstance.get('/applicant/saved-jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  saveJob: async (jobId) => {
    try {
      const response = await axiosInstance.post(`/applicant/saved-jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  unsaveJob: async (jobId) => {
    try {
      const response = await axiosInstance.delete(`/applicant/saved-jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  applyJob: async (jobId, applicationData) => {
    try {
      const response = await axiosInstance.post(
        `/applicant/jobs/${jobId}/applications`,
        applicationData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getApplications: async () => {
    try {
      const response = await axiosInstance.get('/applicant/applications');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getApplicationDetail: async (applicationId) => {
    try {
      const response = await axiosInstance.get(`/applicant/applications/${applicationId}`);
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
  },

  // Get applicant profile
  getApplicantProfile: async () => {
    try {
      const response = await axiosInstance.get('/api/applicant/profile');
      return response.data;
    } catch (error) {
      console.error("[applicantAPI] getApplicantProfile error:", error);
      throw error;
    }
  },

  // Update applicant profile
  updateApplicantProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put('/api/applicant/profile', profileData);
      return response.data;
    } catch (error) {
      console.error("[applicantAPI] updateApplicantProfile error:", error);
      throw error;
    }
  },

  // Upload resume
  uploadResume: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post('/api/applicant/profile/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("[applicantAPI] uploadResume error:", error);
      throw error;
    }
  },

  // Delete resume
  deleteResume: async () => {
    try {
      const response = await axiosInstance.delete('/api/applicant/profile/resume');
      return response.data;
    } catch (error) {
      console.error("[applicantAPI] deleteResume error:", error);
      throw error;
    }
  },

  // Get applicant skills
  getApplicantSkills: async () => {
    try {
      const response = await axiosInstance.get('/api/applicant/profile/skills');
      return response.data;
    } catch (error) {
      console.error("[applicantAPI] getApplicantSkills error:", error);
      throw error;
    }
  },

  // Update applicant skills
  updateApplicantSkills: async (skills) => {
    try {
      const response = await axiosInstance.put('/api/applicant/profile/skills', { skills });
      return response.data;
    } catch (error) {
      console.error("[applicantAPI] updateApplicantSkills error:", error);
      throw error;
    }
  },

  // Get applicant education history
  getApplicantEducation: async () => {
    try {
      const response = await axiosInstance.get('/api/applicant/profile/education');
      return response.data;
    } catch (error) {
      console.error("[applicantAPI] getApplicantEducation error:", error);
      throw error;
    }
  },

  // Update applicant education history
  updateApplicantEducation: async (education) => {
    try {
      const response = await axiosInstance.put('/api/applicant/profile/education', { education });
      return response.data;
    } catch (error) {
      console.error("[applicantAPI] updateApplicantEducation error:", error);
      throw error;
    }
  },

  // Get applicant work experience
  getApplicantExperience: async () => {
    try {
      const response = await axiosInstance.get('/api/applicant/profile/experience');
      return response.data;
    } catch (error) {
      console.error("[applicantAPI] getApplicantExperience error:", error);
      throw error;
    }
  },

  // Update applicant work experience
  updateApplicantExperience: async (experience) => {
    try {
      const response = await axiosInstance.put('/api/applicant/profile/experience', { experience });
      return response.data;
    } catch (error) {
      console.error("[applicantAPI] updateApplicantExperience error:", error);
      throw error;
    }
  }
};

export default applicantAPI;