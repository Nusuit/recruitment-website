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
    type: "Toàn thời gian", // Đổi employmentType thành type
    salary: "15-20 triệu",
    experience: "2-3 năm",
    description: "Chúng tôi đang tìm kiếm một Frontend Developer có kinh nghiệm để tham gia vào đội ngũ phát triển sản phẩm...",
    requirements: "- Có kinh nghiệm với HTML, CSS, JavaScript\n- Thành thạo React hoặc Vue\n- Có khả năng làm việc nhóm tốt",
    benefits: "- Lương thưởng cạnh tranh\n- Chế độ bảo hiểm đầy đủ\n- Môi trường làm việc năng động",
    postedDate: "2023-08-15",
    deadline: "2023-09-15",
    status: "ACTIVE", // Đổi từ active thành ACTIVE
    tags: ["Công nghệ thông tin", "React"], // Thêm tags
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "XYZ Solutions",
    location: "Hồ Chí Minh",
    category: "Công nghệ thông tin",
    type: "Toàn thời gian",
    salary: "18-25 triệu",
    experience: "3-5 năm",
    description: "XYZ Solutions cần tuyển Backend Developer có kinh nghiệm để phát triển các hệ thống API và dịch vụ web...",
    requirements: "- Thành thạo Node.js hoặc Python\n- Kinh nghiệm với cơ sở dữ liệu SQL/NoSQL\n- Hiểu biết về microservices",
    benefits: "- Chế độ phúc lợi hấp dẫn\n- Cơ hội đi công tác nước ngoài\n- Thưởng dự án",
    postedDate: "2023-08-10",
    deadline: "2023-09-10",
    status: "ACTIVE",
    tags: ["Công nghệ thông tin", "Node.js"],
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Tech Innovations",
    location: "Đà Nẵng",
    category: "Quản lý",
    type: "Toàn thời gian",
    salary: "25-35 triệu",
    experience: "5+ năm",
    description: "Chúng tôi đang tìm kiếm Product Manager có kinh nghiệm để dẫn dắt đội ngũ phát triển sản phẩm...",
    requirements: "- Kinh nghiệm quản lý sản phẩm phần mềm\n- Kỹ năng giao tiếp tốt\n- Tư duy phân tích và chiến lược",
    benefits: "- Môi trường làm việc quốc tế\n- Cơ hội thăng tiến\n- Lương thưởng hấp dẫn",
    postedDate: "2023-08-05",
    deadline: "2023-09-05",
    status: "ACTIVE",
    tags: ["Quản lý", "Sản phẩm"],
  },
  {
    id: 4,
    title: "Senior Fashion Designer",
    company: "MyaCorp Fashion",
    location: "New York, NY",
    category: "Design",
    type: "Full Time",
    salary: "$80,000 - $120,000",
    experience: "5+ Years",
    education: "Bachelor Degree",
    description: "Lead our design team to create innovative fashion lines...",
    requirements: "Degree in Fashion Design\nPortfolio of work\nTeam leadership skills",
    benefits: "Health Insurance\nPaid Time Off\nEmployee Discount",
    postedDate: "2024-05-20",
    deadline: "2024-07-20",
    status: "ACTIVE",
    skills: ["Sketching", "Adobe Suite", "Pattern Making"],
    tags: ["Design", "Fashion"],
  },
  {
    id: 5,
    title: "Marketing Specialist",
    company: "MyaCorp Fashion",
    location: "Remote",
    category: "Marketing",
    type: "Full Time",
    salary: "$50,000 - $70,000",
    experience: "2-3 Years",
    education: "Bachelor Degree",
    description: "Develop and implement marketing strategies...",
    requirements: "Experience with digital marketing\nStrong communication skills",
    benefits: "Flexible hours\nProfessional development",
    postedDate: "2024-05-25",
    deadline: "2024-07-25",
    status: "ACTIVE",
    skills: ["Digital Marketing", "SEO", "Content Creation"],
    tags: ["Marketing", "Digital"],
  },
  {
    id: 6,
    title: "Retail Store Manager",
    company: "MyaCorp Fashion",
    location: "Los Angeles, CA",
    category: "Retail",
    type: "Full Time",
    salary: "$60,000 - $90,000",
    experience: "3-5 Years",
    education: "High School",
    description: "Manage daily store operations and team...",
    requirements: "Retail management experience\nLeadership skills",
    benefits: "Performance bonuses\nEmployee discounts",
    postedDate: "2024-05-18",
    deadline: "2024-07-18",
    status: "ACTIVE",
    skills: ["Sales", "Customer Service", "Inventory Management"],
    tags: ["Retail", "Management"],
  },
  {
    id: 7,
    title: "Junior UI/UX Designer",
    company: "MyaCorp Fashion",
    location: "Ho Chi Minh City",
    category: "Design",
    type: "Full Time",
    salary: "$1,000 - $1,500",
    experience: "0-1 Years",
    education: "Bachelor Degree",
    description: "Assist in designing user interfaces and experiences...",
    requirements: "Familiarity with Figma/Sketch\nBasic understanding of UX principles",
    benefits: "Mentorship program\nCreative environment",
    postedDate: "2024-05-28",
    deadline: "2024-08-01",
    status: "ACTIVE",
    skills: ["Figma", "UI Design", "UX Research"],
    tags: ["Design", "UI/UX"],
  },
  {
    id: 8,
    title: "Production Coordinator",
    company: "MyaCorp Fashion",
    location: "Hanoi",
    category: "Production",
    type: "Full Time",
    salary: "$800 - $1,200",
    experience: "1-3 Years",
    education: "Associate Degree",
    description: "Coordinate production schedules and logistics...",
    requirements: "Experience in garment production\nOrganizational skills",
    benefits: "Travel opportunities\nTeam bonuses",
    postedDate: "2024-05-22",
    deadline: "2024-07-22",
    status: "ACTIVE",
    skills: ["Supply Chain", "Logistics", "Quality Control"],
    tags: ["Production"],
  },
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
  "Y tế",
  "Design",
  "Retail",
  "Production"
];

// Get all jobs with filtering, sorting, and pagination
export const getJobs = async (params = {}) => {
  try {
    // Mô phỏng tìm kiếm và lọc dữ liệu
    let filteredJobs = [...mockJobs];
    
    // Tìm kiếm theo từ khóa
    if (params.keyword) { // Đổi params.search thành params.keyword
      const searchLower = params.keyword.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) || 
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.tags?.some(tag => tag.toLowerCase().includes(searchLower)) // Tìm kiếm cả trong tags
      );
    }
    
    // Lọc theo danh mục
    if (params.category) {
      filteredJobs = filteredJobs.filter(job => job.category?.toLowerCase() === params.category.toLowerCase()); // So sánh không phân biệt hoa thường
    }
    
    // Lọc theo địa điểm
    if (params.location) {
      filteredJobs = filteredJobs.filter(job => job.location.toLowerCase().includes(params.location.toLowerCase())); // So sánh không phân biệt hoa thường
    }

    // Lọc theo kinh nghiệm (experience)
    if (params.experience && params.experience.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        params.experience.some(expFilter => {
          const [min, max] = expFilter.replace(/_Years/g, '').split('_').map(s => parseInt(s));
          const jobExp = parseInt(job.experience); // Giả sử job.experience là số năm

          if (isNaN(jobExp)) return false; // Bỏ qua nếu không phải số

          if (expFilter.includes('Plus')) { // Xử lý '5_Plus_Years'
            return jobExp >= min;
          } else {
            return jobExp >= min && jobExp <= max;
          }
        })
      );
    }

    // Lọc theo mức lương (salary)
    if (params.salary && params.salary.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        params.salary.some(salaryRangeFilter => {
          if (!job.salary || job.salary.toLowerCase().includes('negotiable')) return false;

          const [jobMinStr, jobMaxStr] = job.salary.replace(/[$,]/g, '').split('-').map(s => s.trim());
          const jobMin = parseFloat(jobMinStr) * (job.salary.toLowerCase().includes('k') ? 1000 : 1);
          const jobMax = jobMaxStr ? parseFloat(jobMaxStr) * (job.salary.toLowerCase().includes('k') ? 1000 : 1) : jobMin;

          const [filterMinStr, filterMaxStr] = salaryRangeFilter.replace(/[$,+]/g, '').split('-').map(s => s.trim());
          const filterMin = parseFloat(filterMinStr) * (salaryRangeFilter.toLowerCase().includes('k') ? 1000 : 1);
          const filterMax = filterMaxStr ? parseFloat(filterMaxStr) * (salaryRangeFilter.toLowerCase().includes('k') ? 1000 : 1) : Infinity;
          
          // Kiểm tra xem khoảng lương của job có nằm trong khoảng filter không
          return (jobMin >= filterMin && jobMin <= filterMax) ||
                 (jobMax >= filterMin && jobMax <= filterMax) ||
                 (filterMin >= jobMin && filterMin <= jobMax);
        })
      );
    }

    // Lọc theo loại công việc (jobType)
    if (params.jobType && params.jobType.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        params.jobType.includes(job.type)
      );
    }

    // Lọc theo trình độ học vấn (education)
    if (params.education && params.education.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        params.education.includes(job.education)
      );
    }

    // Lọc theo cấp bậc công việc (jobLevel) - Giả định jobLevel có thể nằm trong title
    if (params.jobLevel && params.jobLevel.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        params.jobLevel.some(level => job.title.toLowerCase().includes(level.toLowerCase()))
      );
    }

    // Lọc theo trạng thái (status) - chỉ lấy các job ACTIVE cho người dùng thông thường
    filteredJobs = filteredJobs.filter(job => job.status === 'ACTIVE');
    
    // Mô phỏng phân trang
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + limit);
    
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

// Create new job (recruiter only)
export const createJob = async (jobData) => {
  try {
    // Giả lập tạo ID mới
    const newId = mockJobs.length > 0 ? Math.max(...mockJobs.map(job => job.id)) + 1 : 1;
    
    const newJob = {
      id: newId,
      postedDate: new Date().toISOString().split('T')[0],
      status: jobData.status || 'DRAFT', // Lấy status từ jobData, mặc định là DRAFT
      applicationsCount: 0, // Mặc định số lượng ứng tuyển là 0
      ...jobData,
      skills: jobData.skills?.map(skillId => { // Chuyển skill IDs thành objects nếu cần
        const skillName = `Skill ${skillId}`; // Mock skill name
        return { id: skillId, name: skillName };
      }) || [],
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

// Update job (recruiter only)
export const updateJob = async (jobId, jobData) => {
  try {
    const index = mockJobs.findIndex(job => job.id === parseInt(jobId));
    
    if (index !== -1) {
      const updatedJob = {
        ...mockJobs[index],
        ...jobData,
        skills: jobData.skills?.map(skillId => { // Chuyển skill IDs thành objects nếu cần
          const skillName = `Skill ${skillId}`; // Mock skill name
          return { id: skillId, name: skillName };
        }) || [],
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

// Delete job (recruiter only)
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


// Mock local storage để lưu các đơn ứng tuyển
const getApplicationsFromStorage = () => {
  const applications = localStorage.getItem('applications');
  return applications ? JSON.parse(applications) : [];
};

const setApplicationsToStorage = (applications) => {
  localStorage.setItem('applications', JSON.stringify(applications));
};

// Apply for job (applicant only)
export const applyForJob = async (jobId, applicationData) => {
  try {
    const applications = getApplicationsFromStorage();
    const job = mockJobs.find(j => j.id === parseInt(jobId));

    if (!job) {
      return { success: false, error: 'Job not found for application.' };
    }
    
    const newApplication = {
      id: Date.now(),
      jobId: parseInt(jobId),
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      jobType: job.type,
      appliedDate: new Date().toISOString(),
      status: 'PENDING_REVIEW', // Trạng thái ban đầu
      ...applicationData,
      // Bỏ qua lưu trữ file thật, chỉ lưu tên file hoặc URL giả
      resumeUrl: applicationData.resume ? `mock_resume_${Date.now()}.pdf` : null, // Lưu URL giả
    };
    
    applications.push(newApplication);
    setApplicationsToStorage(applications);

    // Tăng applicationsCount cho mockJob
    const jobIndex = mockJobs.findIndex(j => j.id === parseInt(jobId));
    if (jobIndex !== -1) {
      mockJobs[jobIndex].applicationsCount = (mockJobs[jobIndex].applicationsCount || 0) + 1;
    }
    
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
  }
  catch (error) {
    console.error('Get job categories error:', error);
    return { success: false, error: 'Failed to fetch job categories.' };
  }
};

// Get job statistics (recruiter only)
export const getJobStats = async () => {
  try {
    // Tính toán số liệu thống kê đơn giản
    const totalJobs = mockJobs.length;
    const activeJobs = mockJobs.filter(job => job.status === 'ACTIVE').length;
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
  applyForJob,
  getJobCategories,
  getJobStats
};
