// src/components/home/LatestJobs.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { JobsContext } from "../../contexts/JobsContext";
import JobCard from "../jobs/JobCard"; // Assuming JobCard is updated
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LatestJobs = ({ limit = 4 }) => {
  // Default limit to 4 jobs
  const {
    jobs,
    loading: jobsLoading,
    error: jobsError,
  } = useContext(JobsContext);

  if (jobsLoading) {
    // Skeleton loader for latest jobs section
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, i) => (
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
        </div>
      </div>
    );
  }

  if (jobsError) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500 bg-red-50 p-4 rounded-md">
          Error loading jobs: {jobsError}
        </p>
      </div>
    );
  }

  // Filter for active jobs and sort by postedDate (most recent first), then take the limit
  const latestActiveJobs = jobs
    .filter((job) => job.status === "ACTIVE" || !job.status) // Assuming 'ACTIVE' or no status means active
    .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
    .slice(0, limit);

  if (latestActiveJobs.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <EmptyState
            icon="folder-open"
            title="No Recent Jobs"
            description="There are no new job openings at the moment. Please check back later!"
          />
        </div>
      </div>
    );
  }

  return (
    <section className="latest-jobs-section py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
            Latest Job Openings
          </h2>
          <Link
            to="/jobs"
            className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200 flex items-center group"
          >
            View All Openings
            <FontAwesomeIcon
              icon="arrow-right"
              className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestActiveJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
};

LatestJobs.propTypes = {
  limit: PropTypes.number,
};

export default LatestJobs;
