// src/components/jobs/JobCard.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatRelativeTime } from "../../utils/formatters";
import { AuthContext } from "../../contexts/AuthContext";
import { saveJob, unsaveJob } from "../../api/jobs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobCard = ({ job, designVersion = "v1", onSaveStatusChange }) => {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [isSaving, setIsSaving] = useState(false);
  const { isAuthenticated, user } = React.useContext(AuthContext);
  const navigate = useNavigate();

  if (!job) {
    return null;
  }

  const {
    id,
    title,
    company,
    location,
    type,
    salary,
    postedDate,
    logoUrl = "/assets/images/company-logo-placeholder.png",
    tags,
  } = job;

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem("token")) {
      toast.info("Please login to save jobs", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setIsSaving(true);
      if (isSaved) {
        await unsaveJob(id);
        toast.success("Job unsaved successfully", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        await saveJob(id);
        toast.success("Job saved successfully", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setIsSaved(!isSaved);
      if (onSaveStatusChange) {
        onSaveStatusChange(id, !isSaved);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update save status", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/jobs/${id}`);
  };

  const canSave = isAuthenticated && user?.role?.toLowerCase() === "candidate";

  // Design V2
  if (designVersion === "v2") {
    const displayTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim())
      : [];

    return (
      <Link
        to={`/jobs/${id}`}
        className="job-card-v2 block bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
      >
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center border border-yellow-200">
            {logoUrl && !logoUrl.includes("placeholder") ? (
              <img
                src={logoUrl}
                alt={`${company} Logo`}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <FontAwesomeIcon
                icon="dollar-sign"
                className="text-yellow-500 text-2xl"
              />
            )}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-md font-semibold text-gray-800 hover:text-teal-600 transition-colors duration-150 truncate">
              {title}
            </h3>
            <p className="text-xs text-gray-500">{location}</p>
          </div>
          {canSave && (
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className={`p-2 rounded-full transition-colors duration-200 text-lg ml-auto
                  ${
                    isSaved
                      ? "text-teal-500 hover:bg-teal-50"
                      : "text-gray-400 hover:text-teal-500 hover:bg-gray-100"
                  }
                  ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label={isSaved ? "Unsave Job" : "Save Job"}
            >
              <FontAwesomeIcon
                icon={isSaved ? ["fas", "bookmark"] : ["far", "bookmark"]}
                spin={isSaving}
              />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {type && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
              {type}
            </span>
          )}
          {displayTags.map((tag, index) => (
            <span
              key={index}
              className={`text-xs px-2.5 py-1 rounded-full font-medium
                ${
                  tag.toLowerCase() === "marketing"
                    ? "bg-orange-100 text-orange-700"
                    : tag.toLowerCase() === "sale"
                    ? "bg-pink-100 text-pink-700"
                    : tag.toLowerCase() === "design"
                    ? "bg-blue-100 text-blue-700"
                    : tag.toLowerCase() === "ui/ux"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600"
                }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    );
  }

  // Design V1
  return (
    <Link
      to={`/jobs/${id}`}
      className="job-card block bg-white p-6 rounded-lg shadow-sm border border-transparent hover:shadow-lg hover:border-blue-500 transition-all duration-200 mb-4 no-underline"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border">
          <img
            src={logoUrl}
            alt={`${company} Logo`}
            className="w-12 h-12 object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-150">
              {title}
            </h3>
            {canSave && (
              <button
                onClick={handleSaveClick}
                disabled={isSaving}
                className={`p-2 rounded-full transition-colors duration-200 text-xl ${
                  isSaved
                    ? "text-blue-600 hover:bg-blue-100"
                    : "text-gray-400 hover:text-blue-600 hover:bg-gray-100"
                } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                aria-label={isSaved ? "Unsave Job" : "Save Job"}
              >
                <FontAwesomeIcon
                  icon={isSaved ? ["fas", "bookmark"] : ["far", "bookmark"]}
                  spin={isSaving}
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
    tags: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
    isSaved: PropTypes.bool,
  }).isRequired,
  designVersion: PropTypes.oneOf(["v1", "v2"]),
  onSaveStatusChange: PropTypes.func,
};

JobCard.defaultProps = {
  designVersion: "v1",
  onSaveStatusChange: () => {},
};

export default JobCard;
