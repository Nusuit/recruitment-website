// src/components/home/LatestJobs.jsx
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { JobsContext } from "../../contexts/JobsContext";
import JobCard from "../jobs/JobCard";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LatestJobs = ({ limit = 4 }) => {
  const {
    jobs,
    loading: jobsLoading,
    error: jobsError,
    fetchAllJobs
  } = useContext(JobsContext);

  // Fetch latest jobs on mount
  useEffect(() => {
    fetchAllJobs({ 
      page: 0,
      size: limit,
      sort: 'createdAt,desc'
    });
  }, [fetchAllJobs, limit]);

  if (jobsLoading) {
    return (
      <section className="latest-jobs-section py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
              Latest job open
            </h2>
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-lg animate-pulse border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <div className="h-5 bg-gray-300 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="flex space-x-2">
                  <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (jobsError) {
    return (
      <section className="latest-jobs-section py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500 bg-red-50 p-4 rounded-md">
            Error loading jobs: {jobsError}
          </p>
        </div>
      </section>
    );
  }

  const latestJobs = jobs.slice(0, limit);

  if (latestJobs.length === 0 && !jobsLoading) {
    return (
      <section className="latest-jobs-section py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
              Latest job open
            </h2>
            <Link
              to="/jobs"
              className="text-purple-600 font-semibold hover:text-purple-700 transition-colors duration-200 flex items-center group text-sm"
            >
              See Job available
              <FontAwesomeIcon
                icon="arrow-right"
                className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
              />
            </Link>
          </div>
          <EmptyState
            icon="folder-open"
            title="No Recent Job Openings"
            description="We currently don't have any new job openings. Please check back later."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="latest-jobs-section py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
            Latest job open
          </h2>
          <Link
            to="/jobs"
            className="text-purple-600 font-semibold hover:text-purple-700 transition-colors duration-200 flex items-center group text-sm"
          >
            See Job available
            <FontAwesomeIcon
              icon="arrow-right"
              className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestJobs.map((job) => (
            <JobCard 
              key={job.jobId || job.id} 
              job={job} 
              designVersion="v2" 
            />
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
