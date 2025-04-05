import axios from 'axios';
import { objectToQueryString } from '../utils/helpers';

// Dữ liệu mẫu cho việc làm
const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "ABC Tech",
    location: "Hà Nội",
    category: "Công nghệ thông tin",
    employmentType: "Toàn thời gian",
    salary: "15-20 triệu",
    experience: "2-3 năm",
    description: "Chúng tôi đang tìm kiếm một Frontend Developer có kinh nghiệm để tham gia vào đội ngũ phát triển sản phẩm...",
    requirements: "- Có kinh nghiệm với HTML, CSS, JavaScript\n- Thành thạo React hoặc Vue\n- Có khả năng làm việc nhóm tốt",
    benefits: "- Lương thưởng cạnh tranh\n- Chế độ bảo hiểm đầy đủ\n- Môi trường làm việc năng động",
    postedDate: "2023-08-15",
    deadline: "2023-09-15",
    status: "active"
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "XYZ Solutions",
    location: "Hồ Chí Minh",
    category: "Công nghệ thông tin",
    employmentType: "Toàn thời gian",
    salary: "18-25 triệu",
    experience: "3-5 năm",
    description: "XYZ Solutions cần tuyển Backend Developer có kinh nghiệm để phát triển các hệ thống API và dịch vụ web...",
    requirements: "- Thành thạo Node.js hoặc Python\n- Kinh nghiệm với cơ sở dữ liệu SQL/NoSQL\n- Hiểu biết về microservices",
    benefits: "- Chế độ phúc lợi hấp dẫn\n- Cơ hội đi công tác nước ngoài\n- Thưởng dự án",
    postedDate: "2023-08-10",
    deadline: "2023-09-10",
    status: "active"
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Tech Innovations",
    location: "Đà Nẵng",
    category: "Quản lý",
    employmentType: "Toàn thời gian",
    salary: "25-35 triệu",
    experience: "5+ năm",
    description: "Chúng tôi đang tìm kiếm Product Manager có kinh nghiệm để dẫn dắt đội ngũ phát triển sản phẩm...",
    requirements: "- Kinh nghiệm quản lý sản phẩm phần mềm\n- Kỹ năng giao tiếp tốt\n- Tư duy phân tích và chiến lược",
    benefits: "- Môi trường làm việc quốc tế\n- Cơ hội thăng tiến\n- Lương thưởng hấp dẫn",
    postedDate: "2023-08-05",
    deadline: "2023-09-05",
    status: "active"
  }
];

// Mock data cho danh mục công việc
const mockCategories = [
  "Công nghệ thông tin", 
  "Kế toán", 
  "Marketing", 
  "Quản lý", 
  "Kỹ thuật",
  "Kinh doanh",
  "Nhân sự",
  "Giáo dục",
  "Y tế"
];

// Get all jobs with filtering, sorting, and pagination
export const getJobs = async (params = {}) => {
  try {
    // Mô phỏng tìm kiếm và lọc dữ liệu
    let filteredJobs = [...mockJobs];
    
    // Tìm kiếm theo từ khóa
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) || 
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Lọc theo danh mục
    if (params.category) {
      filteredJobs = filteredJobs.filter(job => job.category === params.category);
    }
    
    // Lọc theo địa điểm
    if (params.location) {
      filteredJobs = filteredJobs.filter(job => job.location.includes(params.location));
    }
    
    // Mô phỏng phân trang
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
    
    return {
      success: true,
      jobs: paginatedJobs,
      totalJobs: filteredJobs.length,
      totalPages: Math.ceil(filteredJobs.length / limit)
    };
  } catch (error) {
    console.error('Get jobs error:', error);
    return { success: false, error: 'Failed to fetch jobs.' };
  }
};

// Get job by ID
export const getJobById = async (jobId) => {
  try {
    const job = mockJobs.find(job => job.id === parseInt(jobId));
    
    if (job) {
      return {
        success: true,
        job
      };
    } else {
      return {
        success: false,
        error: 'Job not found'
      };
    }
  } catch (error) {
    console.error(`Get job ${jobId} error:`, error);
    return { success: false, error: 'Failed to fetch job details.' };
  }
};

// Create new job (admin only)
export const createJob = async (jobData) => {
  try {
    // Giả lập tạo ID mới
    const newId = mockJobs.length > 0 ? Math.max(...mockJobs.map(job => job.id)) + 1 : 1;
    
    const newJob = {
      id: newId,
      postedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      ...jobData
    };
    
    mockJobs.push(newJob);
    
    return {
      success: true,
      job: newJob
    };
  } catch (error) {
    console.error('Create job error:', error);
    return { success: false, error: 'Failed to create job.' };
  }
};

// Update job (admin only)
export const updateJob = async (jobId, jobData) => {
  try {
    const index = mockJobs.findIndex(job => job.id === parseInt(jobId));
    
    if (index !== -1) {
      const updatedJob = {
        ...mockJobs[index],
        ...jobData
      };
      
      mockJobs[index] = updatedJob;
      
      return {
        success: true,
        job: updatedJob
      };
    } else {
      return {
        success: false,
        error: 'Job not found'
      };
    }
  } catch (error) {
    console.error(`Update job ${jobId} error:`, error);
    return { success: false, error: 'Failed to update job.' };
  }
};

// Delete job (admin only)
export const deleteJob = async (jobId) => {
  try {
    const index = mockJobs.findIndex(job => job.id === parseInt(jobId));
    
    if (index !== -1) {
      mockJobs.splice(index, 1);
      return { success: true };
    } else {
      return { success: false, error: 'Job not found' };
    }
  } catch (error) {
    console.error(`Delete job ${jobId} error:`, error);
    return { success: false, error: 'Failed to delete job.' };
  }
};

// Mock local storage để lưu các công việc đã lưu của người dùng
const getSavedJobsFromStorage = () => {
  const savedJobs = localStorage.getItem('savedJobs');
  return savedJobs ? JSON.parse(savedJobs) : [];
};

const setSavedJobsToStorage = (savedJobIds) => {
  localStorage.setItem('savedJobs', JSON.stringify(savedJobIds));
};

// Save job for user
export const saveJob = async (jobId) => {
  try {
    const savedJobIds = getSavedJobsFromStorage();
    
    if (!savedJobIds.includes(jobId)) {
      savedJobIds.push(jobId);
      setSavedJobsToStorage(savedJobIds);
    }
    
    return {
      success: true,
      message: 'Đã lưu công việc thành công!'
    };
  } catch (error) {
    console.error(`Save job ${jobId} error:`, error);
    return { success: false, error: 'Failed to save job.' };
  }
};

// Unsave job for user
export const unsaveJob = async (jobId) => {
  try {
    const savedJobIds = getSavedJobsFromStorage();
    const updatedSavedJobs = savedJobIds.filter(id => id !== jobId);
    
    setSavedJobsToStorage(updatedSavedJobs);
    
    return {
      success: true,
      message: 'Đã xóa công việc khỏi danh sách đã lưu!'
    };
  } catch (error) {
    console.error(`Unsave job ${jobId} error:`, error);
    return { success: false, error: 'Failed to unsave job.' };
  }
};

// Get saved jobs for user
export const getSavedJobs = async (params = {}) => {
  try {
    const savedJobIds = getSavedJobsFromStorage();
    const savedJobs = mockJobs.filter(job => savedJobIds.includes(job.id));
    
    // Mô phỏng phân trang
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedJobs = savedJobs.slice(startIndex, endIndex);
    
    return {
      success: true,
      jobs: paginatedJobs,
      totalJobs: savedJobs.length,
      totalPages: Math.ceil(savedJobs.length / limit)
    };
  } catch (error) {
    console.error('Get saved jobs error:', error);
    return { success: false, error: 'Failed to fetch saved jobs.' };
  }
};

// Check if job is saved by user
export const isJobSaved = async (jobId) => {
  try {
    const savedJobIds = getSavedJobsFromStorage();
    return {
      success: true,
      isSaved: savedJobIds.includes(jobId)
    };
  } catch (error) {
    console.error(`Check if job ${jobId} is saved error:`, error);
    return { success: false, isSaved: false };
  }
};

// Mock local storage để lưu các đơn ứng tuyển
const getApplicationsFromStorage = () => {
  const applications = localStorage.getItem('applications');
  return applications ? JSON.parse(applications) : [];
};

const setApplicationsToStorage = (applications) => {
  localStorage.setItem('applications', JSON.stringify(applications));
};

// Apply for job
export const applyForJob = async (jobId, applicationData) => {
  try {
    const applications = getApplicationsFromStorage();
    
    const newApplication = {
      id: Date.now(),
      jobId: parseInt(jobId),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      ...applicationData,
      // Bỏ qua lưu trữ file thật, chỉ lưu tên file
      resume: applicationData.resume ? applicationData.resume.name : null
    };
    
    applications.push(newApplication);
    setApplicationsToStorage(applications);
    
    return {
      success: true,
      application: newApplication
    };
  } catch (error) {
    console.error(`Apply for job ${jobId} error:`, error);
    return { success: false, error: 'Failed to submit application.' };
  }
};

// Get job categories
export const getJobCategories = async () => {
  try {
    return {
      success: true,
      categories: mockCategories
    };
  } catch (error) {
    console.error('Get job categories error:', error);
    return { success: false, error: 'Failed to fetch job categories.' };
  }
};

// Get job statistics (admin only)
export const getJobStats = async () => {
  try {
    // Tính toán số liệu thống kê đơn giản
    const totalJobs = mockJobs.length;
    const activeJobs = mockJobs.filter(job => job.status === 'active').length;
    const categoryCounts = {};
    
    mockJobs.forEach(job => {
      if (categoryCounts[job.category]) {
        categoryCounts[job.category]++;
      } else {
        categoryCounts[job.category] = 1;
      }
    });
    
    return {
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        categoryCounts
      }
    };
  } catch (error) {
    console.error('Get job stats error:', error);
    return { success: false, error: 'Failed to fetch job statistics.' };
  }
};

export default {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  saveJob,
  unsaveJob,
  getSavedJobs,
  isJobSaved,
  applyForJob,
  getJobCategories,
  getJobStats
};