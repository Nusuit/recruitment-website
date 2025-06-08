// src/components/jobs/JobList.jsx
import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { JobsContext } from "../../contexts/JobsContext";
import JobCard from "./JobCard";
import EmptyState from "../common/EmptyState";
import Pagination from "../common/Pagination";

const JobList = ({ filters, onError }) => {
  const {
    jobs,
    loading: jobsLoading,
    error: jobsError,
    totalPages,
    totalElements,
    fetchAllJobs
  } = useContext(JobsContext);

  // Fetch jobs when filters change
  useEffect(() => {
    fetchAllJobs(filters);
  }, [filters, fetchAllJobs]);

  if (jobsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow-md animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobsError) {
    onError?.(jobsError);
    return (
      <div className="text-center py-10">
        <p className="text-red-500 bg-red-100 p-4 rounded-md">{jobsError}</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="py-10">
        <EmptyState
          icon="search"
          title="No Jobs Found"
          description="We couldn't find any jobs matching your criteria at the moment. Please try broadening your search or check back later."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="job-list space-y-6">
        {jobs.map((job) => (
          <JobCard key={job.id || job.jobId} job={job} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={filters.page || 1}
            totalPages={totalPages}
            onPageChange={(page) => fetchAllJobs({ ...filters, page })}
          />
        </div>
      )}
    </div>
  );
};

JobList.propTypes = {
  filters: PropTypes.shape({
    keyword: PropTypes.string,
    category: PropTypes.string,
    location: PropTypes.string,
    experience: PropTypes.arrayOf(PropTypes.string),
    salary: PropTypes.arrayOf(PropTypes.string),
    jobType: PropTypes.arrayOf(PropTypes.string),
    education: PropTypes.arrayOf(PropTypes.string),
    jobLevel: PropTypes.arrayOf(PropTypes.string),
    page: PropTypes.number
  }),
  onError: PropTypes.func
};

JobList.defaultProps = {
  filters: {},
  onError: () => {}
};

export default JobList;
