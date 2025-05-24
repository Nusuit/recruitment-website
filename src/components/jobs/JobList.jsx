// src/components/jobs/JobList.jsx
import React from "react";
import PropTypes from "prop-types";
import JobCard from "./JobCard"; // Assuming JobCard is refactored and uses context for save status
import EmptyState from "../common/EmptyState"; // Assuming EmptyState is refactored

const JobList = ({ jobs, loading, error }) => {
  if (loading) {
    // You might want a more subtle loading indicator here if it's part of a larger page
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map(
          (
            _,
            i // Skeleton loaders
          ) => (
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
          )
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="py-10">
        <EmptyState
          icon="search" // Or a more specific "no results" icon
          title="No Jobs Found"
          description="We couldn't find any jobs matching your criteria at the moment. Please try broadening your search or check back later."
        />
      </div>
    );
  }

  return (
    <div className="job-list space-y-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

JobList.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      // Add other essential job prop types if JobCard expects them
      title: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      // ... other job properties
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
};

JobList.defaultProps = {
  jobs: [],
  loading: false,
  error: null,
};

export default JobList;
