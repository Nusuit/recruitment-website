// src/pages/guest/JobsPage.jsx
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom"; // Import Link
import { JobsContext } from "../../contexts/JobsContext";
import { AuthContext } from "../../contexts/AuthContext"; // Import AuthContext
import JobList from "../../components/jobs/JobList";
import JobFilters from "../../components/jobs/JobFilters";
import JobSearchBar from "../../components/jobs/JobSearch";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import JobCard from '../../components/jobs/JobCard';

const GuestJobsPage = () => {
  const {
    jobs: allJobs,
    loading: contextLoading,
    error: contextError,
    setLoading: setContextLoading,
    totalPages,
    totalElements,
    fetchAllJobs,
  } = useContext(JobsContext);
  const { user, isAuthenticated } = useContext(AuthContext); // Lấy user và isAuthenticated từ AuthContext
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    page: 0,
    size: 10,
    sort: "createdAt,desc"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(!isMobile);

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
      page: parseInt(query.get("page") || "0"),
      size: parseInt(query.get("size") || "10"),
      sort: query.get("sort") || "createdAt,desc"
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

      setFilteredJobs(tempFilteredJobs);
      setContextLoading(false); // Kết thúc loading cục bộ
    } else if (!contextLoading && allJobs.length === 0) {
      setFilteredJobs([]);
    }
  }, [allJobs, searchParams, contextLoading, setContextLoading]);

  const handleFilterChange = (newFilters) => {
    const updatedSearchParams = { 
      ...searchParams, 
      ...newFilters,
      page: 0 // Reset to first page when filters change
    };
    setSearchParams(updatedSearchParams);
    setCurrentPage(1);
    
    const query = new URLSearchParams();
    Object.entries(updatedSearchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => query.append(key, item));
      } else if (value !== null && value !== undefined && value !== '') {
        query.append(key, value);
      }
    });
    
    navigate(`/jobs?${query.toString()}`);
  };

  const handleClearFilters = () => {
    const defaultParams = {
      keyword: "",
      location: "",
      category: "",
      experience: [],
      salary: [],
      jobType: [],
      education: [],
      jobLevel: [],
      page: 0,
      size: 10,
      sort: "createdAt,desc"
    };
    setSearchParams(defaultParams);
    setCurrentPage(1);
    navigate("/jobs");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const query = new URLSearchParams(location.search);
    query.set("page", pageNumber.toString());
    navigate(`?${query.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMainSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleMainSearch = () => {
    const updatedSearchParams = {
      ...searchParams,
      page: 0 // Reset to first page on new search
    };
    setCurrentPage(1);
    
    const query = new URLSearchParams();
    Object.entries(updatedSearchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => query.append(key, item));
      } else if (value !== null && value !== undefined && value !== '' && 
                 ["keyword", "location", "category", "page", "size", "sort"].includes(key)) {
        query.append(key, value);
      }
    });
    
    navigate(`/jobs?${query.toString()}`);
  };

  // Kiểm tra xem người dùng có phải là Recruiter/Admin không
  const isRecruiterOrAdmin = isAuthenticated && (user?.role?.toLowerCase() === 'recruiter' || user?.role?.toLowerCase() === 'admin');

  if (contextLoading && !allJobs.length) {
    return <LoadingSpinner fullPage message="Loading jobs..." />;
  }

  if (contextError) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md">
        {contextError}
      </div>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Find Your Next Opportunity
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
          Explore job openings tailored to your skills and preferences.
        </p>
      </div>

      <JobSearchBar
        searchParams={searchParams}
        onSearchChange={handleMainSearchInputChange}
        onSearch={handleMainSearch}
      />

      <Grid container spacing={3}>
        {/* Mobile Filter Toggle */}
        {isMobile && (
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Grid>
        )}

        {/* Filters Section */}
        {showFilters && (
          <Grid item xs={12} md={3}>
            <JobFilters
              filters={searchParams}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </Grid>
        )}

        {/* Jobs List Section */}
        <Grid item xs={12} md={showFilters ? 9 : 12}>
          {contextLoading && filteredJobs.length === 0 ? (
            <LoadingSpinner />
          ) : filteredJobs.length === 0 ? (
            <EmptyState
              icon="search"
              title="No Jobs Found"
              description="No jobs match your current search criteria. Try adjusting your filters."
              action={
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              }
            />
          ) : (
            <>
              <div className="text-sm text-gray-600 mb-4">
                Showing {filteredJobs.length} of {totalElements} jobs
              </div>
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default GuestJobsPage;
