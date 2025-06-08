// src/components/applicant/ApplicationsList.jsx
// This component displays a list of applications, possibly on a dashboard or a section of a page.
// It's different from ApplicationsPage.jsx which is a full page.

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate, formatApplicationStatus } from "../../utils/formatters";
import EmptyState from "../common/EmptyState";
import LoadingSpinner from "../common/LoadingSpinner";

const ApplicationsList = ({
  applications,
  loading,
  error,
  title = "My Recent Applications",
  limit,
  showViewAllLink = false,
  viewAllLinkPath = "/applicant/applications",
}) => {
  if (loading) {
    return (
      <div className="p-4 text-center">
        <LoadingSpinner message="Loading applications..." />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 p-4 bg-red-50 rounded-md">{error}</p>;
  }

  const applicationsToDisplay = limit
    ? applications.slice(0, limit)
    : applications;

  const getStatusPillClass = (status) => {
    const formattedStatus = formatApplicationStatus(status)
      .toLowerCase()
      .replace(/\s+/g, "");
    switch (formattedStatus) {
      case "pendingreview":
        return "bg-yellow-100 text-yellow-800";
      case "inreview":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-indigo-100 text-indigo-800";
      case "interviewscheduled":
        return "bg-purple-100 text-purple-800";
      case "offerextended":
        return "bg-pink-100 text-pink-800";
      case "hired":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-500";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="applications-list">
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          {showViewAllLink && applications.length > (limit || 0) && (
            <Link
              to={viewAllLinkPath}
              className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1"
            >
              View All <FontAwesomeIcon icon="arrow-right" size="xs" />
            </Link>
          )}
        </div>
      )}

      {applicationsToDisplay.length === 0 ? (
        <EmptyState
          icon="file-alt"
          title="No Applications Found"
          description="You haven't applied for any jobs yet, or no applications match the current view."
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
        <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {" "}
          {/* Added max-height and scroll */}
          {applicationsToDisplay.map((app) => (
            <li
              key={app.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 bg-gray-50/50"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <Link
                    to={`/applicant/jobs/${app.jobId}`}
                    className="font-semibold text-gray-800 hover:text-blue-600 text-md"
                  >
                    {app.jobTitle}
                  </Link>
                  <p className="text-xs text-gray-500">{app.company}</p>
                </div>
                <span
                  className={`mt-2 sm:mt-0 px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusPillClass(
                    app.status
                  )}`}
                >
                  {formatApplicationStatus(app.status)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Applied: {formatDate(app.appliedDate)}
                </p>
                <Link
                  to={`/applicant/applications/${app.id}`}
                  className="mt-2 sm:mt-0 text-xs text-blue-600 hover:underline font-medium flex items-center gap-1"
                >
                  View Details{" "}
                  <FontAwesomeIcon icon="chevron-right" size="xs" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

ApplicationsList.propTypes = {
  applications: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  title: PropTypes.string,
  limit: PropTypes.number, // Max number of applications to show
  showViewAllLink: PropTypes.bool,
  viewAllLinkPath: PropTypes.string,
};

export default ApplicationsList;
