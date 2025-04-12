import axios from './axiosConfig';

export const recruiterAPI = {
  // Lấy danh sách công việc đã đăng
  getJobs: async () => {
    try {
      const response = await axios.get('/recruiter/jobs');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Xem chi tiết công việc
  getJobDetail: async (jobId) => {
    try {
      const response = await axios.get(`/recruiter/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Đăng tuyển công việc mới
  createJob: async (jobData) => {
    try {
      const response = await axios.post('/recruiter/jobs', jobData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Xem danh sách ứng viên cho công việc
  getJobApplications: async (jobId) => {
    try {
      const response = await axios.get(`/recruiter/jobs/${jobId}/applications`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Lấy danh sách kỹ năng
  getSkills: async () => {
    try {
      const response = await axios.get('/recruiter/skills');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Cập nhật kỹ năng công việc
  updateJobSkills: async (jobId, skills) => {
    try {
      const response = await axios.put(`/recruiter/jobs/${jobId}/skills`, {
        skills
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Thêm ghi chú về ứng viên
  addApplicationNote: async (applicationId, note) => {
    try {
      const response = await axios.patch(`/recruiter/applications/${applicationId}/note`, {
        note
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};