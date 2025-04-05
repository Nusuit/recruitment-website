import axios from 'axios';
import { objectToQueryString } from '../utils/helpers';

// Create axios instance for applications API
const applicationsAPI = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Dữ liệu mẫu cho đơn ứng tuyển
const mockApplications = [
  {
    id: 1,
    jobId: 1,
    userId: 1,
    jobTitle: "Frontend Developer",
    company: "ABC Tech",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0987654321",
    resume: "nguyenvana_resume.pdf",
    coverLetter: "Tôi mong muốn ứng tuyển vị trí Frontend Developer tại công ty của bạn...",
    status: "pending",
    submittedAt: "2023-08-20T08:30:00Z",
    notes: ""
  },
  {
    id: 2,
    jobId: 2,
    userId: 1,
    jobTitle: "Backend Developer",
    company: "XYZ Solutions",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0987654321",
    resume: "nguyenvana_resume.pdf",
    coverLetter: "Tôi có kinh nghiệm làm việc với Node.js và mong muốn ứng tuyển vị trí Backend Developer...",
    status: "reviewing",
    submittedAt: "2023-08-15T10:15:00Z",
    notes: "Ứng viên có kinh nghiệm tốt với Node.js"
  },
  {
    id: 3,
    jobId: 3,
    userId: 2,
    jobTitle: "Product Manager",
    company: "Tech Innovations",
    fullName: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0123456789",
    resume: "tranthib_resume.pdf",
    coverLetter: "Tôi có kinh nghiệm quản lý sản phẩm phần mềm và mong muốn...",
    status: "interview",
    submittedAt: "2023-08-10T14:20:00Z",
    notes: "Ứng viên phù hợp, hẹn phỏng vấn ngày 25/08"
  },
  {
    id: 4,
    jobId: 1,
    userId: 3,
    jobTitle: "Frontend Developer",
    company: "ABC Tech",
    fullName: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0369852147",
    resume: "levanc_resume.pdf",
    coverLetter: "Tôi có 3 năm kinh nghiệm với React và Vue...",
    status: "rejected",
    submittedAt: "2023-08-12T09:45:00Z",
    notes: "Không phù hợp với yêu cầu của vị trí"
  },
  {
    id: 5,
    jobId: 2,
    userId: 4,
    jobTitle: "Backend Developer",
    company: "XYZ Solutions",
    fullName: "Phạm Thị D",
    email: "phamthid@example.com",
    phone: "0765432198",
    resume: "phamthid_resume.pdf",
    coverLetter: "Tôi có chuyên môn về Node.js và Express...",
    status: "offered",
    submittedAt: "2023-08-05T11:30:00Z",
    notes: "Ứng viên xuất sắc, đã gửi offer"
  }
];

// Dữ liệu mẫu cho các cuộc phỏng vấn
const mockInterviews = [
  {
    id: 1,
    applicationId: 3,
    date: "2023-08-25T09:00:00Z",
    location: "Online - Google Meet",
    interviewers: ["Nguyễn Quản lý", "Trần HR"],
    status: "scheduled",
    notes: "Chuẩn bị câu hỏi về quản lý sản phẩm và kinh nghiệm làm việc"
  }
];

// Get user applications (for applicants)
export const getUserApplications = async (params = {}) => {
  try {
    // Mô phỏng lấy đơn ứng tuyển của người dùng hiện tại
    const currentUser = JSON.parse(localStorage.getItem('user')) || { id: 1 }; // Giả sử user ID = 1 nếu không có
    
    let userApplications = mockApplications.filter(app => app.userId === currentUser.id);
    
    // Lọc theo trạng thái nếu có
    if (params.status) {
      userApplications = userApplications.filter(app => app.status === params.status);
    }
    
    // Mô phỏng phân trang
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedApplications = userApplications.slice(startIndex, endIndex);
    
    return {
      success: true,
      applications: paginatedApplications,
      totalApplications: userApplications.length,
      totalPages: Math.ceil(userApplications.length / limit)
    };
  } catch (error) {
    console.error('Get user applications error:', error);
    return { success: false, error: 'Failed to fetch applications.' };
  }
};

// Get application details
export const getApplicationById = async (applicationId) => {
  try {
    const application = mockApplications.find(app => app.id === parseInt(applicationId));
    
    if (application) {
      return {
        success: true,
        application
      };
    } else {
      return {
        success: false,
        error: 'Application not found'
      };
    }
  } catch (error) {
    console.error(`Get application ${applicationId} error:`, error);
    return { success: false, error: 'Failed to fetch application details.' };
  }
};

// Get applications for a job (for admins)
export const getJobApplications = async (jobId, params = {}) => {
  try {
    let jobApplications = mockApplications.filter(app => app.jobId === parseInt(jobId));
    
    // Lọc theo trạng thái nếu có
    if (params.status) {
      jobApplications = jobApplications.filter(app => app.status === params.status);
    }
    
    // Mô phỏng phân trang
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedApplications = jobApplications.slice(startIndex, endIndex);
    
    return {
      success: true,
      applications: paginatedApplications,
      totalApplications: jobApplications.length,
      totalPages: Math.ceil(jobApplications.length / limit)
    };
  } catch (error) {
    console.error(`Get applications for job ${jobId} error:`, error);
    return { success: false, error: 'Failed to fetch job applications.' };
  }
};

// Update application status (for admins)
export const updateApplicationStatus = async (applicationId, status, notes = '') => {
  try {
    const index = mockApplications.findIndex(app => app.id === parseInt(applicationId));
    
    if (index !== -1) {
      // Cập nhật trạng thái và ghi chú
      mockApplications[index] = {
        ...mockApplications[index],
        status,
        notes: notes || mockApplications[index].notes
      };
      
      return {
        success: true,
        application: mockApplications[index]
      };
    } else {
      return {
        success: false,
        error: 'Application not found'
      };
    }
  } catch (error) {
    console.error(`Update application ${applicationId} status error:`, error);
    return { success: false, error: 'Failed to update application status.' };
  }
};

// Schedule interview (for admins)
export const scheduleInterview = async (applicationId, interviewData) => {
  try {
    // Kiểm tra xem đơn ứng tuyển có tồn tại không
    const application = mockApplications.find(app => app.id === parseInt(applicationId));
    
    if (!application) {
      return {
        success: false,
        error: 'Application not found'
      };
    }
    
    // Kiểm tra xem đã có lịch phỏng vấn chưa
    const existingInterviewIndex = mockInterviews.findIndex(
      interview => interview.applicationId === parseInt(applicationId)
    );
    
    const newInterview = {
      id: existingInterviewIndex !== -1 ? mockInterviews[existingInterviewIndex].id : mockInterviews.length + 1,
      applicationId: parseInt(applicationId),
      ...interviewData
    };
    
    if (existingInterviewIndex !== -1) {
      // Cập nhật lịch phỏng vấn hiện có
      mockInterviews[existingInterviewIndex] = newInterview;
    } else {
      // Thêm lịch phỏng vấn mới
      mockInterviews.push(newInterview);
    }
    
    // Cập nhật trạng thái đơn ứng tuyển thành "interview" nếu chưa phải
    if (application.status !== 'interview') {
      const appIndex = mockApplications.findIndex(app => app.id === parseInt(applicationId));
      mockApplications[appIndex] = {
        ...mockApplications[appIndex],
        status: 'interview'
      };
    }
    
    return {
      success: true,
      interview: newInterview
    };
  } catch (error) {
    console.error(`Schedule interview for application ${applicationId} error:`, error);
    return { success: false, error: 'Failed to schedule interview.' };
  }
};

// Get interview details
export const getInterviewDetails = async (applicationId) => {
  try {
    const interview = mockInterviews.find(
      interview => interview.applicationId === parseInt(applicationId)
    );
    
    if (interview) {
      return {
        success: true,
        interview
      };
    } else {
      return {
        success: false,
        error: 'Interview not found'
      };
    }
  } catch (error) {
    console.error(`Get interview details for application ${applicationId} error:`, error);
    return { success: false, error: 'Failed to fetch interview details.' };
  }
};

// Withdraw application (for applicants)
export const withdrawApplication = async (applicationId) => {
  try {
    const index = mockApplications.findIndex(app => app.id === parseInt(applicationId));
    
    if (index !== -1) {
      // Cập nhật trạng thái thành "withdrawn"
      mockApplications[index] = {
        ...mockApplications[index],
        status: 'withdrawn'
      };
      
      return {
        success: true,
        message: 'Application withdrawn successfully'
      };
    } else {
      return {
        success: false,
        error: 'Application not found'
      };
    }
  } catch (error) {
    console.error(`Withdraw application ${applicationId} error:`, error);
    return { success: false, error: 'Failed to withdraw application.' };
  }
};

// Get application statistics (for admins)
export const getApplicationStats = async () => {
  try {
    // Tính toán thống kê đơn giản
    const totalApplications = mockApplications.length;
    
    // Đếm theo trạng thái
    const statusCounts = {
      pending: 0,
      reviewing: 0,
      interview: 0,
      rejected: 0,
      offered: 0,
      withdrawn: 0
    };
    
    mockApplications.forEach(app => {
      if (statusCounts.hasOwnProperty(app.status)) {
        statusCounts[app.status]++;
      }
    });
    
    // Tính tỷ lệ chấp nhận
    const acceptanceRate = (statusCounts.offered / totalApplications * 100).toFixed(2);
    
    return {
      success: true,
      stats: {
        totalApplications,
        statusCounts,
        acceptanceRate
      }
    };
  } catch (error) {
    console.error('Get application stats error:', error);
    return { success: false, error: 'Failed to fetch application statistics.' };
  }
};

// Download resume
export const downloadResume = async (applicationId) => {
  try {
    const application = mockApplications.find(app => app.id === parseInt(applicationId));
    
    if (!application) {
      return {
        success: false,
        error: 'Application not found'
      };
    }
    
    // Giả lập tạo một file PDF trống (không thực sự tạo file trong trình duyệt)
    alert(`Đang tải xuống file ${application.resume}`);
    
    return { success: true };
  } catch (error) {
    console.error(`Download resume for application ${applicationId} error:`, error);
    return { success: false, error: 'Failed to download resume.' };
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