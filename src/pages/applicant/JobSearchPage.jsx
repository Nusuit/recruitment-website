// src/pages/applicant/JobSearchPage.jsx
// This page is very similar to `src/pages/guest/JobsPage.jsx`
// For logged-in users, it might have slight differences, e.g., pre-filled info or direct apply options.
// For this refactor, we'll make it a functional component that largely mirrors GuestJobsPage,
// but you can add applicant-specific features later.

import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { JobsContext } from "../../contexts/JobsContext";
import JobList from "../../components/jobs/JobList";
import JobFilters from "../../components/jobs/JobFilters";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ApplicantJobSearchPage = () => {
  const {
    jobs: allJobs,
    loading: contextLoading,
    error: contextError,
    setLoading: setContextLoading,
  } = useContext(JobsContext);
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
  const JOBS_PER_PAGE = 10;

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

  useEffect(() => {
    parseAndUpdateSearchParams();
  }, [parseAndUpdateSearchParams]);

  useEffect(() => {
    if (!contextLoading && allJobs.length > 0) {
      setContextLoading(true);
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
          job.category?.toLowerCase() === searchParams.category.toLowerCase();
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
      const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
      const endIndex = startIndex + JOBS_PER_PAGE;
      setFilteredJobs(tempFilteredJobs.slice(startIndex, endIndex));
      setContextLoading(false);
    } else if (!contextLoading && allJobs.length === 0) {
      setFilteredJobs([]);
      setTotalJobsCount(0);
      setTotalPages(1);
    }
  }, [allJobs, searchParams, currentPage, contextLoading, setContextLoading]);

  const handleFilterChange = (newFilters) => {
    const updatedSearchParams = { ...searchParams, ...newFilters };
    setSearchParams(updatedSearchParams);
    setCurrentPage(1);
    const query = new URLSearchParams();
    Object.keys(updatedSearchParams).forEach((key) => {
      const value = updatedSearchParams[key];
      if (Array.isArray(value))
        value.forEach((item) => query.append(key, item));
      else if (value) query.append(key, value);
    });
    navigate(`/applicant/jobs?${query.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchParams({
      keyword: "",
      location: "",
      category: "",
      experience: [],
      salary: [],
      jobType: [],
      education: [],
      jobLevel: [],
    });
    setCurrentPage(1);
    navigate("/applicant/jobs");
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
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainSearch = () => {
    setCurrentPage(1);
    const query = new URLSearchParams();
    Object.keys(searchParams).forEach((key) => {
      const value = searchParams[key];
      if (Array.isArray(value)) {
        value.forEach((item) => query.append(key, item));
      } else if (value && ["keyword", "location", "category"].includes(key)) {
        // Only main search params
        query.append(key, value);
      }
    });
    navigate(`/applicant/jobs?${query.toString()}`);
  };

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
    <div className="job-search-page py-8 px-4 md:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Find Your Next Opportunity
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
          Explore job openings tailored to your skills and preferences.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8 flex flex-col md:flex-row items-center gap-3 md:gap-4">
        <div className="w-full md:flex-1 relative">
          <FontAwesomeIcon
            icon="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            name="keyword"
            placeholder="Job title, keywords..."
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
            placeholder="Location"
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
            <option value="">All Categories</option>
            <option value="design">Fashion Design</option>
            <option value="marketing">Marketing</option>
            {/* Add more categories */}
          </select>
          <FontAwesomeIcon
            icon="chevron-down"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
        <button
          onClick={handleMainSearch}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <JobFilters
            filters={searchParams}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>
        <div className="lg:col-span-3">
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
                Showing {filteredJobs.length} of {totalJobsCount} jobs
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
        </div>
      </div>
    </div>
  );
};

export default ApplicantJobSearchPage;
