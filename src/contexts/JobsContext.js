// src/contexts/JobsContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { candidateAPI } from "../api/candidate"; // Giả sử API calls nằm ở đây
import { AuthContext } from "./AuthContext"; // Để kiểm tra user đã login chưa

export const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext); // Lấy trạng thái xác thực

  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(() => {
    const localData = localStorage.getItem("savedJobs");
    return localData ? JSON.parse(localData) : [];
  });
  const [applications, setApplications] = useState(() => {
    const localData = localStorage.getItem("applications");
    return localData ? JSON.parse(localData) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tạm thời giữ lại sampleJobs nếu chưa có API
  const sampleJobs = [
    {
      id: 1,
      title: "Sales Manager",
      company: "MyaCorp",
      location: "HCM, Vietnam",
      type: "Full Time",
      salary: "$2500 - $3000",
      experience: "3-5 Years",
      education: "Bachelor Degree",
      postedDate: "2025-03-15",
      deadline: "2025-04-15",
      description: "Mô tả công việc Sales Manager...",
      responsibilities: "Trách nhiệm 1\nTrách nhiệm 2",
      requirements: "Yêu cầu 1\nYêu cầu 2",
      benefits: "Phúc lợi 1\nPhúc lợi 2",
      skills: "Sales, Management, Communication",
    },
    {
      id: 2,
      title: "Sales Coordinator",
      company: "MyaCorp",
      location: "Hanoi, Vietnam",
      type: "Full Time",
      salary: "$1800 - $2200",
      experience: "1-3 Years",
      education: "Bachelor Degree",
      postedDate: "2025-03-20",
      deadline: "2025-04-20",
      description: "Mô tả công việc Sales Coordinator...",
      responsibilities: "Hỗ trợ team sales\nLàm báo cáo",
      requirements: "Kỹ năng tổ chức tốt\nTiếng Anh giao tiếp",
      benefits: "Bảo hiểm\nDu lịch",
      skills: "Coordination, Reporting",
    },
    // Thêm các jobs khác nếu cần
  ];

  // Fetch jobs từ API (hoặc dùng sample data)
  useEffect(() => {
    const fetchJobsData = async () => {
      setLoading(true);
      try {
        // **TODO: Thay thế bằng lời gọi API thật khi backend sẵn sàng**
        // const response = await candidateAPI.getJobs(); // Ví dụ: candidateAPI.getAllJobs()
        // setJobs(response.jobs || []);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
        setJobs(sampleJobs); // Tạm thời dùng sample data
        setError(null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobsData();
  }, []);

  // Fetch saved jobs và applications của user nếu đã login
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserSpecificData = async () => {
        // TODO: Gọi API để lấy saved jobs và applications của user hiện tại
        // Ví dụ:
        // const savedJobsResponse = await candidateAPI.getSavedJobs();
        // setSavedJobIds(savedJobsResponse.map(job => job.id));
        // const applicationsResponse = await candidateAPI.getApplications();
        // setApplications(applicationsResponse.applications);

        // Tạm thời vẫn dùng localStorage nếu chưa có API
        const localSaved = localStorage.getItem("savedJobs");
        if (localSaved) setSavedJobIds(JSON.parse(localSaved));

        const localApps = localStorage.getItem("applications");
        if (localApps) setApplications(JSON.parse(localApps));
      };
      fetchUserSpecificData();
    } else {
      // Nếu user logout, xóa dữ liệu này khỏi state (localStorage sẽ được xử lý ở AuthContext)
      setSavedJobIds([]);
      setApplications([]);
    }
  }, [isAuthenticated]);

  // Lưu savedJobIds vào localStorage khi nó thay đổi
  useEffect(() => {
    localStorage.setItem("savedJobs", JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  // Lưu applications vào localStorage khi nó thay đổi
  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  const toggleSaveJob = useCallback(
    (jobId) => {
      if (!isAuthenticated) {
        // Có thể redirect tới login hoặc hiển thị thông báo
        alert("Bạn cần đăng nhập để lưu việc làm.");
        return;
      }
      setSavedJobIds((prevIds) =>
        prevIds.includes(jobId)
          ? prevIds.filter((id) => id !== jobId)
          : [...prevIds, jobId]
      );
      // TODO: Gọi API để lưu/bỏ lưu job trên server
    },
    [isAuthenticated]
  );

  const isJobSaved = useCallback(
    (jobId) => {
      return savedJobIds.includes(jobId);
    },
    [savedJobIds]
  );

  const getJobById = useCallback(
    (jobId) => {
      return jobs.find((job) => job.id === parseInt(jobId)) || null;
    },
    [jobs]
  );

  const getSavedJobs = useCallback(() => {
    // Trả về danh sách các object job đầy đủ
    return jobs.filter((job) => savedJobIds.includes(job.id));
  }, [jobs, savedJobIds]);

  const submitApplication = useCallback(
    async (jobId, applicationData) => {
      if (!isAuthenticated) {
        alert("Bạn cần đăng nhập để ứng tuyển.");
        return { success: false, error: "User not authenticated" };
      }
      // TODO: Gọi API để submit application
      // try {
      //   const response = await candidateAPI.applyJob(jobId, applicationData);
      //   if (response.success) {
      //     setApplications(prev => [...prev, response.application]);
      //     return { success: true, application: response.application };
      //   } else {
      //     return { success: false, error: response.error };
      //   }
      // } catch (error) {
      //   return { success: false, error: error.message || "Failed to submit application" };
      // }

      // Mock logic
      const newApplication = {
        id: Date.now(), // Unique ID
        jobId: parseInt(jobId),
        ...applicationData, // Dữ liệu từ form
        status: "Pending Review",
        appliedDate: new Date().toISOString(),
        // Thêm các trường khác nếu cần, ví dụ jobTitle, company từ `jobs` state
        jobTitle: jobs.find((j) => j.id === parseInt(jobId))?.title || "N/A",
        company: jobs.find((j) => j.id === parseInt(jobId))?.company || "N/A",
        location: jobs.find((j) => j.id === parseInt(jobId))?.location || "N/A",
        jobType: jobs.find((j) => j.id === parseInt(jobId))?.type || "N/A",
      };
      setApplications((prev) => [...prev, newApplication]);
      return { success: true, application: newApplication };
    },
    [isAuthenticated, jobs]
  ); // Thêm jobs vào dependencies

  const getUserApplications = useCallback(() => {
    return applications;
  }, [applications]);

  const hasAppliedToJob = useCallback(
    (jobId) => {
      return applications.some((app) => app.jobId === parseInt(jobId));
    },
    [applications]
  );

  const contextValue = {
    jobs,
    loading,
    error,
    toggleSaveJob,
    isJobSaved,
    getJobById,
    getSavedJobs,
    submitApplication,
    getUserApplications,
    hasAppliedToJob,
    setJobs, // Cung cấp setJobs nếu cần thiết từ bên ngoài (ví dụ: khi filter)
    setLoading, // Cung cấp setLoading nếu cần
  };

  return (
    <JobsContext.Provider value={contextValue}>{children}</JobsContext.Provider>
  );
};
