// src/pages/guest/JobsPage.jsx
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom"; // Import Link
import { JobsContext } from "../../contexts/JobsContext";
import { AuthContext } from "../../contexts/AuthContext"; // Import AuthContext
import JobList from "../../components/jobs/JobList";
import JobFilters from "../../components/jobs/JobFilters";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GuestJobsPage = () => {
  const {
    jobs: allJobs,
    loading: contextLoading,
    error: contextError,
    setLoading: setContextLoading,
  } = useContext(JobsContext);
  const { user, isAuthenticated } = useContext(AuthContext); // Lấy user và isAuthenticated từ AuthContext
  const location = useLocation();
  const navigate = useNavigate();

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    location: "",
    category: "",
    experience: [],
    salary: [],
    jobType: [],
    education: [],
    jobLevel: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const JOBS_PER_PAGE = 10; // Số lượng jobs mỗi trang

  // Hàm parse query params từ URL và cập nhật state
  const parseAndUpdateSearchParams = useCallback(() => {
    const query = new URLSearchParams(location.search);
    const newSearchParams = {
      keyword: query.get("keyword") || "",
      location: query.get("location") || "",
      category: query.get("category") || "",
      experience: query.getAll("experience") || [],
      salary: query.getAll("salary") || [],
      jobType: query.getAll("jobType") || [],
      education: query.getAll("education") || [],
      jobLevel: query.getAll("jobLevel") || [],
    };
    setSearchParams(newSearchParams);
    setCurrentPage(parseInt(query.get("page") || "1"));
  }, [location.search]);

  // Parse query params khi component mount hoặc URL thay đổi
  useEffect(() => {
    parseAndUpdateSearchParams();
  }, [parseAndUpdateSearchParams]);

  // Lọc và phân trang jobs khi allJobs, searchParams hoặc currentPage thay đổi
  useEffect(() => {
    if (!contextLoading && allJobs.length > 0) {
      setContextLoading(true); // Bắt đầu loading cục bộ
      // Logic lọc jobs (tương tự như trong class component của bạn)
      let tempFilteredJobs = allJobs.filter((job) => {
        const keywordMatch =
          !searchParams.keyword ||
          job.title
            .toLowerCase()
            .includes(searchParams.keyword.toLowerCase()) ||
          job.company
            .toLowerCase()
            .includes(searchParams.keyword.toLowerCase());

        const locationMatch =
          !searchParams.location ||
          job.location
            .toLowerCase()
            .includes(searchParams.location.toLowerCase());

        const categoryMatch =
          !searchParams.category ||
          job.category?.toLowerCase() === searchParams.category.toLowerCase(); // Giả sử job có 'category'

        const experienceMatch =
          searchParams.experience.length === 0 ||
          searchParams.experience.some((exp) =>
            job.experience?.includes(exp.replace("_", "-"))
          );

        const salaryMatch =
          searchParams.salary.length === 0 ||
          searchParams.salary.some((salRange) => {
            if (!job.salary) return false;
            const [jobMinStr, jobMaxStr] = job.salary
              .replace(/[$,kK]/g, "")
              .split("-")
              .map((s) => s.trim());
            const jobMin =
              parseInt(jobMinStr) *
              (job.salary.toLowerCase().includes("k") ? 1000 : 1);
            const jobMax = jobMaxStr
              ? parseInt(jobMaxStr) *
                (job.salary.toLowerCase().includes("k") ? 1000 : 1)
              : jobMin;

            const [filterMinStr, filterMaxStr] = salRange
              .replace(/[$,kK+]/g, "")
              .split("-")
              .map((s) => s.trim());
            const filterMin =
              parseInt(filterMinStr) *
              (salRange.toLowerCase().includes("k") ? 1000 : 1);
            const filterMax = filterMaxStr
              ? parseInt(filterMaxStr) *
                (salRange.toLowerCase().includes("k") ? 1000 : 1)
              : Infinity;

            return jobMin >= filterMin && jobMax <= filterMax;
          });

        const jobTypeMatch =
          searchParams.jobType.length === 0 ||
          searchParams.jobType.includes(job.type);

        const educationMatch =
          searchParams.education.length === 0 ||
          searchParams.education.includes(job.education);

        const jobLevelMatch =
          searchParams.jobLevel.length === 0 ||
          searchParams.jobLevel.some((level) =>
            job.title
              ?.toLowerCase()
              .includes(level.toLowerCase().replace(" level", ""))
          );

        return (
          keywordMatch &&
          locationMatch &&
          categoryMatch &&
          experienceMatch &&
          salaryMatch &&
          jobTypeMatch &&
          educationMatch &&
          jobLevelMatch
        );
      });

      setTotalJobsCount(tempFilteredJobs.length);
      setTotalPages(Math.ceil(tempFilteredJobs.length / JOBS_PER_PAGE));

      // Phân trang
      const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
      const endIndex = startIndex + JOBS_PER_PAGE;
      setFilteredJobs(tempFilteredJobs.slice(startIndex, endIndex));
      setContextLoading(false); // Kết thúc loading cục bộ
    } else if (!contextLoading && allJobs.length === 0) {
      setFilteredJobs([]);
      setTotalJobsCount(0);
      setTotalPages(1);
    }
  }, [allJobs, searchParams, currentPage, contextLoading, setContextLoading]);

  const handleFilterChange = (newFilters) => {
    // newFilters là một object chứa một key filter đã thay đổi, ví dụ { experience: ['0_1 Years'] }
    // hoặc { keyword: 'new keyword' }
    const updatedSearchParams = {
      ...searchParams,
      ...newFilters,
    };
    setSearchParams(updatedSearchParams);
    setCurrentPage(1); // Reset về trang 1 khi filter thay đổi

    const query = new URLSearchParams();
    Object.keys(updatedSearchParams).forEach((key) => {
      const value = updatedSearchParams[key];
      if (Array.isArray(value)) {
        value.forEach((item) => query.append(key, item));
      } else if (value) {
        query.append(key, value);
      }
    });
    navigate(`/jobs?${query.toString()}`);
  };

  const handleClearFilters = () => {
    const clearedSearchParams = {
      keyword: "",
      location: "",
      category: "",
      experience: [],
      salary: [],
      jobType: [],
      education: [],
      jobLevel: [],
    };
    setSearchParams(clearedSearchParams);
    setCurrentPage(1);
    navigate("/jobs");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const query = new URLSearchParams(location.search);
    query.set("page", pageNumber);
    navigate(`?${query.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMainSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainSearch = () => {
    setCurrentPage(1); // Reset về trang 1 khi thực hiện search mới
    const query = new URLSearchParams();
    Object.keys(searchParams).forEach((key) => {
      const value = searchParams[key];
      if (Array.isArray(value)) {
        value.forEach((item) => query.append(key, item));
      } else if (
        value &&
        key !== "experience" &&
        key !== "salary" &&
        key !== "jobType" &&
        key !== "education" &&
        key !== "jobLevel"
      ) {
        // Chỉ thêm các param của main search
        query.append(key, value);
      }
    });
    navigate(`/jobs?${query.toString()}`);
  };

  // Kiểm tra xem người dùng có phải là Recruiter/Admin không
  const isRecruiterOrAdmin = isAuthenticated && (user?.role?.toLowerCase() === 'recruiter' || user?.role?.toLowerCase() === 'admin');

  if (contextLoading && !allJobs.length) {
    // Chỉ hiển thị loading ban đầu khi chưa có jobs nào
    return <LoadingSpinner fullPage />;
  }

  if (contextError) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
        {contextError}
      </div>
    );
  }

  return (
    <div className="job-search-page py-8 px-4 md:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Khám phá các cơ hội việc làm của chúng tôi
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
          Duyệt qua danh sách việc làm của chúng tôi và thực hiện bước đầu tiên
          hướng tới một sự nghiệp thú vị với chúng tôi.
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8 flex flex-col md:flex-row items-center gap-3 md:gap-4">
        <div className="w-full md:flex-1 relative">
          <FontAwesomeIcon
            icon="magnifying-glass"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            name="keyword"
            placeholder="Chức danh, từ khóa..."
            value={searchParams.keyword}
            onChange={handleMainSearchInputChange}
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="w-full md:flex-1 relative">
          <FontAwesomeIcon
            icon="location-dot"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            name="location"
            placeholder="Địa điểm"
            value={searchParams.location}
            onChange={handleMainSearchInputChange}
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="w-full md:flex-1 relative">
          <FontAwesomeIcon
            icon="briefcase"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <select
            name="category"
            value={searchParams.category}
            onChange={handleMainSearchInputChange}
            className="w-full p-3 pl-10 pr-8 border border-gray-300 rounded-md appearance-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="">Chọn danh mục</option>
            <option value="design">Thiết kế thời trang</option>
            <option value="marketing">Tiếp thị</option>
            <option value="sales">Bán hàng</option>
            <option value="production">Sản xuất</option>
            <option value="management">Quản lý</option>
            <option value="retail">Bán lẻ</option>
            {/* Thêm các category khác */}
          </select>
          <FontAwesomeIcon
            icon="chevron-down"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
        <button
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
          onClick={handleMainSearch}
        >
          Tìm việc
        </button>
      </div>

      {/* NEW: Nút "Đăng Job Mới" cho Recruiter/Admin */}
      {isRecruiterOrAdmin && (
        <div className="flex justify-end mb-6"> {/* Sử dụng flex justify-end để căn phải */}
          <Link
            to="/admin/jobs/create"
            className="px-5 py-2.5 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
          >
            <FontAwesomeIcon icon="plus" /> Đăng Job Mới
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <JobFilters
            filters={searchParams}
            onFilterChange={handleFilterChange} // Truyền hàm này xuống
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Job Results */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Hiển thị {filteredJobs.length} trong số {totalJobsCount} việc
              làm
            </div>
            {/* Nút Đăng Job Mới đã được di chuyển ra ngoài khối này */}
          </div>

          {contextLoading && filteredJobs.length === 0 ? ( // Hiển thị loading khi đang lọc và chưa có kết quả
            <LoadingSpinner />
          ) : filteredJobs.length === 0 ? (
            <EmptyState
              icon="search" // Hoặc một icon phù hợp hơn
              title="Không tìm thấy việc làm nào"
              description="Không có việc làm nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử điều chỉnh bộ lọc hoặc xóa bớt tiêu chí."
              action={
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Xóa tất cả bộ lọc
                </button>
              }
            />
          ) : (
            <>
              <JobList jobs={filteredJobs} />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestJobsPage;
