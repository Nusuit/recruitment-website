// src/components/jobs/JobDetails.jsx
// This is a reusable component for displaying job details, distinct from the full JobDetailsPage.
// It might be used in modals or previews.

import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { JobsContext } from "../../contexts/JobsContext";
// import Modal from '../common/Modal'; // Not used directly here, but parent might use it
// import ApplyForm from './ApplyForm'; // ApplyForm might be used in a modal triggered by parent
import { formatDate, formatRelativeTime } from "../../utils/formatters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const JobDetailsComponent = ({
  job,
  showApplyButton = true,
  onApplyClick,
  onSaveClick,
}) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { isJobSaved, hasAppliedToJob } = useContext(JobsContext);
  const navigate = useNavigate();

  if (!job) {
    return (
      <p className="text-center text-gray-500 p-4">
        Job details not available.
      </p>
    );
  }

  const isSaved = isJobSaved(job.id);
  const alreadyApplied = hasAppliedToJob(job.id);
  const canSaveOrApply =
    isAuthenticated && user?.role?.toLowerCase() === "candidate";

  const handleInternalApplyClick = () => {
    if (onApplyClick) {
      onApplyClick(job.id); // Let parent handle modal or navigation
    } else if (canSaveOrApply) {
      navigate(`/applicant/jobs/${job.id}/apply`);
    } else if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/jobs/${job.id}` } } });
    }
  };

  const handleInternalSaveClick = () => {
    if (onSaveClick) {
      onSaveClick(job.id); // Let parent handle context update
    } else if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/jobs/${job.id}` } } });
    }
    // If no onSaveClick, JobCard itself (if used) would handle context via its own save button
  };

  const parseListToArray = (text) => {
    if (!text || typeof text !== "string") return [];
    return text
      .split("\n")
      .map((line) => line.trim().replace(/^[-*]\s*/, ""))
      .filter(Boolean);
  };

  const responsibilities = parseListToArray(job.responsibilities);
  const requirements = parseListToArray(job.requirements);
  const benefits = parseListToArray(job.benefits);
  const skills = job.skills
    ? Array.isArray(job.skills)
      ? job.skills
      : String(job.skills)
          .split(",")
          .map((s) => s.trim())
    : [];

  return (
    <div className="job-details-component p-6 bg-white rounded-lg shadow-md">
      {/* Job Header */}
      <div className="pb-6 mb-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
          <h2 className="text-2xl font-bold text-gray-800 mb-1 sm:mb-0">
            {job.title}
          </h2>
          {showApplyButton && canSaveOrApply && (
            <div className="flex items-center space-x-3 mt-2 sm:mt-0">
              <button
                onClick={handleInternalSaveClick}
                className={`p-2.5 rounded-full border text-lg transition-colors ${
                  isSaved
                    ? "bg-blue-100 text-blue-600 border-blue-500"
                    : "text-gray-500 border-gray-300 hover:text-blue-600 hover:border-blue-500"
                }`}
                aria-label={isSaved ? "Unsave Job" : "Save Job"}
              >
                <FontAwesomeIcon
                  icon={isSaved ? ["fas", "bookmark"] : ["far", "bookmark"]}
                />
              </button>
              <button
                onClick={handleInternalApplyClick}
                disabled={alreadyApplied}
                className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {alreadyApplied ? "Applied" : "Apply Now"}
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-600">
          <span className="flex items-center">
            <FontAwesomeIcon icon="building" className="mr-1.5 text-gray-400" />
            {job.company}
          </span>
          <span className="flex items-center">
            <FontAwesomeIcon
              icon="map-marker-alt"
              className="mr-1.5 text-gray-400"
            />
            {job.location}
          </span>
          <span className="flex items-center">
            <FontAwesomeIcon icon="clock" className="mr-1.5 text-gray-400" />
            {job.type}
          </span>
          <span className="flex items-center">
            <FontAwesomeIcon
              icon="dollar-sign"
              className="mr-1.5 text-gray-400"
            />
            {job.salary || "Competitive"}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Posted: {formatRelativeTime(job.postedDate)} | Deadline:{" "}
          {formatDate(job.deadline)}
        </p>
      </div>

      {/* Job Content Sections */}
      <DetailSection title="Job Description">
        <p className="whitespace-pre-line leading-relaxed">{job.description}</p>
      </DetailSection>

      {responsibilities.length > 0 && (
        <DetailSection title="Key Responsibilities">
          <ul className="list-disc list-inside space-y-1.5">
            {responsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </DetailSection>
      )}
      {requirements.length > 0 && (
        <DetailSection title="Qualifications & Requirements">
          <ul className="list-disc list-inside space-y-1.5">
            {requirements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </DetailSection>
      )}
      {benefits.length > 0 && (
        <DetailSection title="Benefits & Perks">
          <ul className="list-disc list-inside space-y-1.5">
            {benefits.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </DetailSection>
      )}
      {skills.length > 0 && (
        <DetailSection title="Required Skills">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </DetailSection>
      )}
      {/* Add more sections like "About the Company" if needed */}
    </div>
  );
};

const DetailSection = ({ title, children }) => (
  <section className="mb-6">
    <h3 className="text-lg font-semibold text-gray-700 mb-2 pb-1 border-b border-gray-100">
      {title}
    </h3>
    <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
  </section>
);

JobDetailsComponent.propTypes = {
  job: PropTypes.object.isRequired,
  showApplyButton: PropTypes.bool,
  onApplyClick: PropTypes.func, // Callback for parent to handle apply action (e.g., open modal)
  onSaveClick: PropTypes.func, // Callback for parent to handle save action
};

export default JobDetailsComponent;
