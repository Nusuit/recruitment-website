// src/components/jobs/JobCard.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatRelativeTime } from "../../utils/formatters"; // Assumes this formatter exists
import { JobsContext } from "../../contexts/JobsContext";
import { AuthContext } from "../../contexts/AuthContext";

const JobCard = ({ job }) => {
  const { toggleSaveJob, isJobSaved } = useContext(JobsContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!job) {
    return null; // Return nothing if job is not provided
  }

  const {
    id,
    title,
    company,
    location,
    type,
    salary,
    postedDate,
    // logoUrl, // Add logoUrl if available in job data
  } = job;

  const logoUrl = "/assets/images/company-logo-placeholder.png"; // Placeholder logo

  const handleSaveClick = (e) => {
    e.preventDefault(); // Prevent navigating when clicking the save button
    e.stopPropagation(); // Prevent event bubbling
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/jobs" } } }); // Redirect to login
    } else {
      toggleSaveJob(id);
    }
  };

  const isSaved = isJobSaved(id);
  const canSave = isAuthenticated && user?.role?.toLowerCase() === "candidate";

  return (
    <Link
      to={`/jobs/${id}`}
      className="job-card block bg-white p-6 rounded-lg shadow-sm border border-transparent hover:shadow-lg hover:border-blue-500 transition-all duration-200 mb-4 no-underline"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border">
          <img
            src={logoUrl}
            alt={`${company} Logo`}
            className="w-12 h-12 object-contain"
          />
        </div>

        {/* Job Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-150">
              {title}
            </h3>
            {canSave && (
              <button
                onClick={handleSaveClick}
                className={`p-2 rounded-full transition-colors duration-200 text-xl ${
                  isSaved
                    ? "text-blue-600 hover:bg-blue-100"
                    : "text-gray-400 hover:text-blue-600 hover:bg-gray-100"
                }`}
                aria-label={isSaved ? "Unsave Job" : "Save Job"}
              >
                <FontAwesomeIcon
                  icon={isSaved ? ["fas", "bookmark"] : ["far", "bookmark"]}
                />
              </button>
            )}
          </div>
          <p className="text-sm font-medium text-gray-700">{company}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon="location-dot" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon="clock" />
              <span>{type}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon="dollar-sign" />
              <span>{salary || "Not specified"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posted Date */}
      <div className="text-xs text-gray-400 text-right mt-3">
        Posted {formatRelativeTime(postedDate)}
      </div>
    </Link>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    salary: PropTypes.string,
    postedDate: PropTypes.string.isRequired,
    logoUrl: PropTypes.string,
  }).isRequired,
};

export default JobCard;
