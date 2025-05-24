// src/pages/applicant/SavedJobsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { JobsContext } from "../../contexts/JobsContext";
import { AuthContext } from "../../contexts/AuthContext";
import JobCard from "../../components/jobs/JobCard"; // Assuming JobCard is updated
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SavedJobsPage = () => {
  const {
    getSavedJobs,
    toggleSaveJob,
    loading: jobsContextLoading,
    jobs: allJobs,
  } = useContext(JobsContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [savedJobsList, setSavedJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Not used in current mock, but good for API calls
  const [filters, setFilters] = useState({
    type: "all", // e.g., 'Full Time', 'Part Time'
    location: "",
    sortBy: "date_saved_desc", // 'date_saved_desc', 'deadline_asc', 'salary_desc'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: { pathname: "/applicant/saved-jobs" } },
      });
      return;
    }

    if (!jobsContextLoading) {
      setLoading(true);
      try {
        const userSavedJobs = getSavedJobs(); // This should return the full job objects
        setSavedJobsList(userSavedJobs);
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
        setError("Failed to load saved jobs.");
      } finally {
        setLoading(false);
      }
    }
  }, [isAuthenticated, navigate, getSavedJobs, jobsContextLoading, allJobs]); // Add allJobs to re-fetch if it changes

  const handleUnsaveJob = (jobId) => {
    toggleSaveJob(jobId); // Context handles the actual unsaving and localStorage update
    // The list will re-render due to context change or useEffect dependency on allJobs/getSavedJobs
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getFilteredAndSortedJobs = () => {
    let processedJobs = [...savedJobsList];

    // Filter by type
    if (filters.type !== "all") {
      processedJobs = processedJobs.filter((job) => job.type === filters.type);
    }

    // Filter by location (simple text match)
    if (filters.location) {
      processedJobs = processedJobs.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Sort
    processedJobs.sort((a, b) => {
      switch (filters.sortBy) {
        case "deadline_asc":
          return new Date(a.deadline) - new Date(b.deadline);
        case "salary_desc":
          // Basic salary sort (assuming salary is like "$2500 - $3000" or "Negotiable")
          const getAvgSalary = (salaryStr) => {
            if (!salaryStr || salaryStr.toLowerCase() === "negotiable")
              return 0;
            const parts = salaryStr
              .replace(/[$,kK]/g, "")
              .split("-")
              .map((s) => parseInt(s.trim()));
            return parts.reduce((sum, val) => sum + val, 0) / parts.length;
          };
          return getAvgSalary(b.salary) - getAvgSalary(a.salary);
        case "date_saved_desc":
        default:
          // Assuming jobs are already in order of save date from context, or add a 'savedAt' timestamp
          return 0; // Placeholder if no 'savedAt'
      }
    });
    return processedJobs;
  };

  const displayJobs = getFilteredAndSortedJobs();

  if (loading || jobsContextLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md">{error}</div>
    );
  }

  return (
    <div className="saved-jobs-page p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-gray-600 mt-1">
          Track and manage your bookmarked job opportunities.
        </p>
      </div>

      {savedJobsList.length === 0 ? (
        <EmptyState
          icon="bookmark"
          title="No Saved Jobs Yet"
          description="Jobs you save will appear here. Save jobs that interest you to apply to them later."
          action={
            <Link
              to="/applicant/jobs"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FontAwesomeIcon icon="briefcase" className="mr-2" />
              Browse Jobs
            </Link>
          }
        />
      ) : (
        <>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8 border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Filter by location..."
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="sortBy"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sort By
                </label>
                <select
                  id="sortBy"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="date_saved_desc">Recently Saved</option>
                  <option value="deadline_asc">Application Deadline</option>
                  <option value="salary_desc">Salary (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          {displayJobs.length === 0 ? (
            <EmptyState
              icon="filter"
              title="No Jobs Match Filters"
              description="Try adjusting your filters to find your saved jobs."
              action={
                <button
                  onClick={() =>
                    setFilters({
                      type: "all",
                      location: "",
                      sortBy: "date_saved_desc",
                    })
                  }
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  // onUnsave={() => handleUnsaveJob(job.id)} // JobCard now uses context for save/unsave
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedJobsPage;
