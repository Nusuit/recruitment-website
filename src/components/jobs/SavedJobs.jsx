// src/components/jobs/SavedJobs.jsx
// This component displays a list of saved jobs, possibly on a dashboard.
// It's different from SavedJobsPage.jsx which is a full page.

import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { JobsContext } from "../../contexts/JobsContext";
import JobCard from "./JobCard"; // Assuming JobCard is updated
import EmptyState from "../common/EmptyState";
import LoadingSpinner from "../common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SavedJobsComponent = ({
  limit,
  showViewAllLink = true,
  listTitle = "Your Saved Jobs",
}) => {
  const {
    getSavedJobs,
    loading: jobsContextLoading,
    error: jobsContextError,
  } = useContext(JobsContext);

  // getSavedJobs from context should already return the job objects
  const savedJobs = getSavedJobs();

  if (jobsContextLoading) {
    return (
      <div className="p-4 text-center">
        <LoadingSpinner message="Loading saved jobs..." />
      </div>
    );
  }

  if (jobsContextError) {
    return (
      <p className="text-red-500 p-4 bg-red-50 rounded-md">
        {jobsContextError}
      </p>
    );
  }

  const jobsToDisplay = limit ? savedJobs.slice(0, limit) : savedJobs;

  return (
    <div className="saved-jobs-component bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">{listTitle}</h3>
        {showViewAllLink && savedJobs.length > (limit || 0) && (
          <Link
            to="/applicant/saved-jobs"
            className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1"
          >
            View All <FontAwesomeIcon icon="arrow-right" size="xs" />
          </Link>
        )}
      </div>

      {jobsToDisplay.length === 0 ? (
        <EmptyState
          icon="bookmark"
          title="No Saved Jobs"
          description="You haven't saved any jobs yet. Start exploring and save opportunities that interest you!"
          action={
            <Link
              to="/applicant/jobs"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600"
            >
              <FontAwesomeIcon icon="search" className="mr-2" />
              Find Jobs
            </Link>
          }
        />
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {" "}
          {/* Added max-height and scroll */}
          {jobsToDisplay.map((job) => (
            <JobCard key={job.id} job={job} />
            // Note: JobCard now handles its own save/unsave logic via context.
            // If you need a specific "Unsave" button here, you'd add it and call toggleSaveJob from context.
          ))}
        </div>
      )}
    </div>
  );
};

SavedJobsComponent.propTypes = {
  limit: PropTypes.number,
  showViewAllLink: PropTypes.bool,
  listTitle: PropTypes.string,
};

export default SavedJobsComponent;
