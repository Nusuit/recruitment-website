import axios from 'axios';
import { objectToQueryString } from '../utils/helpers';
import axiosInstance from "./config/axiosConfig";

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
    userId: 1, // Giả định userId của applicant
    jobTitle: "Frontend Developer",
    company: "ABC Tech",
    applicantName: "Nguyễn Văn A", // Đổi từ fullName thành applicantName
    email: "nguyenvana@example.com",
    phone: "0987654321",
    resumeUrl: "mock_resume_nguyenvana.pdf", // Đổi từ resume thành resumeUrl
    coverLetter: "Tôi mong muốn ứng tuyển vị trí Frontend Developer tại công ty của bạn...",
    status: "PENDING_REVIEW", // Đổi từ pending thành PENDING_REVIEW
    appliedDate: "2023-08-20T08:30:00Z", // Đổi từ submittedAt thành appliedDate
    recruiterNote: "", // Đổi từ notes thành recruiterNote
    education: "Đại học Bách Khoa",
    experience: "2 năm kinh nghiệm",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    linkedinProfile: "linkedin.com/in/nguyenvana",
    portfolioUrl: "portfolio.nguyenvana.com",
    expectedSalary: "18 triệu VND",
    availableDate: "2023-09-01",
    interviewDetails: null,
    timeline: [
      { date: "2023-08-20T08:30:00Z", title: "Application Submitted", description: "Candidate applied for the role." }
    ]
  },
  {
    id: 2,
    jobId: 2,
    userId: 1,
    jobTitle: "Backend Developer",
    company: "XYZ Solutions",
    applicantName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0987654321",
    resumeUrl: "mock_resume_nguyenvana.pdf",
    coverLetter: "Tôi có kinh nghiệm làm việc với Node.js và mong muốn ứng tuyển vị trí Backend Developer...",
    status: "IN_REVIEW", // Đổi từ reviewing thành IN_REVIEW
    appliedDate: "2023-08-15T10:15:00Z",
    recruiterNote: "Ứng viên có kinh nghiệm tốt với Node.js",
    education: "Đại học Khoa học Tự nhiên",
    experience: "3 năm kinh nghiệm",
    skills: ["Node.js", "Python", "SQL"],
    linkedinProfile: "linkedin.com/in/nguyenvana",
    portfolioUrl: "portfolio.nguyenvana.com",
    expectedSalary: "20 triệu VND",
    availableDate: "2023-09-01",
    interviewDetails: null,
    timeline: [
      { date: "2023-08-15T10:15:00Z", title: "Application Submitted", description: "Candidate applied for the role." },
      { date: "2023-08-16T09:00:00Z", title: "Application Viewed", description: "Recruiter viewed the application." }
    ]
  },
  {
    id: 3,
    jobId: 3,
    userId: 2, // Giả định userId của applicant khác
    jobTitle: "Product Manager",
    company: "Tech Innovations",
    applicantName: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0123456789",
    resumeUrl: "mock_resume_tranthib.pdf",
    coverLetter: "Tôi có kinh nghiệm quản lý sản phẩm phần mềm và mong muốn...",
    status: "INTERVIEW_SCHEDULED", // Đổi từ interview thành INTERVIEW_SCHEDULED
    appliedDate: "2023-08-10T14:20:00Z",
    recruiterNote: "Ứng viên phù hợp, hẹn phỏng vấn ngày 25/08",
    education: "Thạc sĩ Quản trị kinh doanh",
    experience: "5 năm kinh nghiệm",
    skills: ["Product Management", "Agile", "Communication"],
    linkedinProfile: "linkedin.com/in/tranthib",
    portfolioUrl: null,
    expectedSalary: "28 triệu VND",
    availableDate: "2023-09-01",
    interviewDetails: {
      datetime: "2023-08-25T09:00:00Z",
      type: "Online Video Call",
      location: "https://meet.google.com/abc-xyz",
      interviewer: "Nguyễn Quản lý",
      notes: "Chuẩn bị câu hỏi về quản lý sản phẩm và kinh nghiệm làm việc"
    },
    timeline: [
      { date: "2023-08-10T14:20:00Z", title: "Application Submitted", description: "Candidate applied for the role." },
      { date: "2023-08-12T10:00:00Z", title: "Shortlisted", description: "Application moved to shortlisted stage." },
      { date: "2023-08-20T15:00:00Z", title: "Interview Scheduled", description: "First round interview scheduled." }
    ]
  },
  {
    id: 4,
    jobId: 1,
    userId: 3,
    jobTitle: "Frontend Developer",
    company: "ABC Tech",
    applicantName: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0369852147",
    resumeUrl: "mock_resume_levanc.pdf",
    coverLetter: "Tôi có 3 năm kinh nghiệm với React và Vue...",
    status: "REJECTED", // Đổi từ rejected thành REJECTED
    appliedDate: "2023-08-12T09:45:00Z",
    recruiterNote: "Không phù hợp với yêu cầu của vị trí",
    education: "Đại học FPT",
    experience: "3 năm kinh nghiệm",
    skills: ["React", "Vue", "JavaScript"],
    linkedinProfile: null,
    portfolioUrl: null,
    expectedSalary: "15 triệu VND",
    availableDate: "2023-09-01",
    interviewDetails: null,
    timeline: [
      { date: "2023-08-12T09:45:00Z", title: "Application Submitted", description: "Candidate applied for the role." },
      { date: "2023-08-15T11:00:00Z", title: "Rejected", description: "Application was not selected." }
    ]
  },
  {
    id: 5,
    jobId: 2,
    userId: 4,
    jobTitle: "Backend Developer",
    company: "XYZ Solutions",
    applicantName: "Phạm Thị D",
    email: "phamthid@example.com",
    phone: "0765432198",
    resumeUrl: "mock_resume_phamthid.pdf",
    coverLetter: "Tôi có chuyên môn về Node.js và Express...",
    status: "OFFER_EXTENDED", // Đổi từ offered thành OFFER_EXTENDED
    appliedDate: "2023-08-05T11:30:00Z",
    recruiterNote: "Ứng viên xuất sắc, đã gửi offer",
    education: "Đại học Bách Khoa",
    experience: "4 năm kinh nghiệm",
    skills: ["Node.js", "Express", "MongoDB"],
    linkedinProfile: "linkedin.com/in/phamthid",
    portfolioUrl: null,
    expectedSalary: "25 triệu VND",
    availableDate: "2023-09-01",
    interviewDetails: null,
    timeline: [
      { date: "2023-08-05T11:30:00Z", title: "Application Submitted", description: "Candidate applied for the role." },
      { date: "2023-08-08T14:00:00Z", title: "Interview Scheduled", description: "First interview." },
      { date: "2023-08-10T16:00:00Z", title: "Offer Extended", description: "Job offer sent." }
    ]
  }
];

// Get user applications (for applicants)
export const getUserApplications = async (params = {}) => {
  try {
    const queryString = objectToQueryString(params);
    const response = await axiosInstance.get(`/applicant/applications?${queryString}`);
    return response.data.payload;
  } catch (error) {
    console.error("[applicationsAPI] getUserApplications error:", error);
    throw error;
  }
};

// Get application details
export const getApplicationDetails = async (applicationId) => {
  try {
    const response = await axiosInstance.get(`/applicant/applications/${applicationId}`);
    return response.data.payload;
  } catch (error) {
    console.error("[applicationsAPI] getApplicationDetails error:", error);
    throw error;
  }
};

// Get applications for a job (for recruiters)
export const getJobApplications = async (jobId, params = {}) => {
  try {
    const queryString = objectToQueryString(params);
    const response = await axiosInstance.get(`/recruiter/jobs/${jobId}/applications?${queryString}`);
    return response.data.payload;
  } catch (error) {
    console.error("[applicationsAPI] getJobApplications error:", error);
    throw error;
  }
};

// Update application status (for recruiters)
export const updateApplicationStatus = async (applicationId, status, feedback = null) => {
  try {
    const response = await axiosInstance.patch(`/recruiter/applications/${applicationId}/status`, {
      status,
      feedback
    });
    return response.data.payload;
  } catch (error) {
    console.error("[applicationsAPI] updateApplicationStatus error:", error);
    throw error;
  }
};

// Schedule interview (for recruiters)
export const scheduleInterview = async (applicationId, interviewData) => {
  try {
    const response = await axiosInstance.post(
      `/recruiter/applications/${applicationId}/interview`,
      interviewData
    );
    return response.data.payload;
  } catch (error) {
    console.error("[applicationsAPI] scheduleInterview error:", error);
    throw error;
  }
};

// Update interview result (for recruiters)
export const updateInterviewResult = async (applicationId, interviewResult) => {
  try {
    const response = await axiosInstance.patch(
      `/recruiter/applications/${applicationId}/interview-result`,
      interviewResult
    );
    return response.data.payload;
  } catch (error) {
    console.error("[applicationsAPI] updateInterviewResult error:", error);
    throw error;
  }
};

// Get interview details
export const getInterviewDetails = async (applicationId) => {
  try {
    const response = await axiosInstance.get(`/applicant/applications/${applicationId}/interview`);
    return response.data.payload;
  } catch (error) {
    console.error("[applicationsAPI] getInterviewDetails error:", error);
    throw error;
  }
};

// Withdraw application (for applicants)
export const withdrawApplication = async (applicationId) => {
  try {
    const response = await axiosInstance.patch(`/applicant/applications/${applicationId}/withdraw`);
    return response.data.payload;
  } catch (error) {
    console.error("[applicationsAPI] withdrawApplication error:", error);
    throw error;
  }
};

// Get application statistics (for recruiters)
export const getApplicationStats = async (jobId) => {
  try {
    const response = await axiosInstance.get(`/recruiter/jobs/${jobId}/applications/stats`);
    return response.data.payload;
  } catch (error) {
    console.error("[applicationsAPI] getApplicationStats error:", error);
    throw error;
  }
};

// Download resume
export const downloadResume = async (applicationId) => {
  try {
    const response = await axiosInstance.get(`/applicant/applications/${applicationId}/resume`, {
      responseType: 'blob' // Important for file downloads
    });
    return response.data;
  } catch (error) {
    console.error("[applicationsAPI] downloadResume error:", error);
    throw error;
  }
};

export default {
  getUserApplications,
  getApplicationDetails,
  getJobApplications,
  updateApplicationStatus,
  scheduleInterview,
  getInterviewDetails,
  withdrawApplication,
  getApplicationStats,
  downloadResume
};
