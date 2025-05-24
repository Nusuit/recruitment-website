// src/pages/applicant/JobDetailsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { JobsContext } from "../../contexts/JobsContext";
import { AuthContext } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatTimeAgo } from "../../utils/formatters"; // Assumes this formatter exists

const JobDetailsPage = () => {
  const { id } = useParams(); // Get job ID from URL
  const {
    getJobById,
    toggleSaveJob,
    isJobSaved,
    hasAppliedToJob,
    loading: jobsLoading,
  } = useContext(JobsContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    try {
      // Wait for jobs context to finish loading before trying to get job
      if (!jobsLoading) {
        const fetchedJob = getJobById(id); // Use context function
        if (fetchedJob) {
          setJob(fetchedJob);
          setError(null);
        } else {
          setError("Job not found.");
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("Failed to load job details.");
      setIsLoading(false);
    }
  }, [id, getJobById, jobsLoading]); // Re-run when ID or context changes

  const handleApplyNow = () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: { pathname: `/jobs/${id}/apply` } },
      });
    } else if (user?.role?.toLowerCase() === "candidate") {
      navigate(`/applicant/jobs/${id}/apply`);
    } else {
      // Handle cases where non-candidates try to apply (e.g., show a message)
      alert("Only candidates can apply for jobs.");
    }
  };

  const handleSaveJob = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/jobs/${id}` } } });
    } else {
      toggleSaveJob(job.id);
    }
  };

  if (isLoading || jobsLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error"
        description={error}
        icon="exclamation-triangle"
      />
    );
  }

  if (!job) {
    return (
      <EmptyState
        title="Job Not Found"
        description="The job you are looking for does not exist or may have been removed."
        icon="search"
      />
    );
  }

  const isAlreadyApplied = hasAppliedToJob(job.id);
  const isSaved = isJobSaved(job.id);

  return (
    <div className="job-details-page container mx-auto p-4 md:p-8">
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-0">
              {job.title}
            </h1>
            <div className="flex items-center space-x-3 mt-2 md:mt-0">
              {isAuthenticated && user?.role?.toLowerCase() === "candidate" && (
                <button
                  onClick={handleSaveJob}
                  className={`p-3 rounded-full border transition-colors duration-200 ${
                    isSaved
                      ? "bg-blue-100 text-blue-600 border-blue-600"
                      : "bg-white text-gray-500 border-gray-300 hover:text-blue-600 hover:border-blue-600"
                  }`}
                  aria-label={isSaved ? "Unsave Job" : "Save Job"}
                >
                  <FontAwesomeIcon
                    icon={isSaved ? ["fas", "bookmark"] : ["far", "bookmark"]}
                  />
                </button>
              )}
              <button
                onClick={handleApplyNow}
                disabled={isAlreadyApplied}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isAlreadyApplied ? "Applied" : "Apply Now"}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon="building" className="text-gray-500" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon="location-dot" className="text-gray-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon="clock" className="text-gray-500" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon="dollar-sign" className="text-gray-500" />
              <span>{job.salary || "Competitive"}</span>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-3">
            <span>Posted {formatTimeAgo(job.postedDate)}</span>
            <span className="mx-2">|</span>
            <span>
              Apply before {new Date(job.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Description & Details */}
          <div className="lg:col-span-2">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Job Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Responsibilities
              </h2>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                {job.responsibilities?.split("\n").map((res, index) => (
                  <li key={index}>{res}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Requirements
              </h2>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                {job.requirements?.split("\n").map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Benefits
              </h2>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                {job.benefits?.split("\n").map((ben, index) => (
                  <li key={index}>{ben}</li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Column: Job Overview & Company Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 sticky top-20">
              <h3 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-3">
                Job Overview
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex justify-between">
                  <strong className="font-medium text-gray-600">
                    Posted Date:
                  </strong>
                  <span>{new Date(job.postedDate).toLocaleDateString()}</span>
                </li>
                <li className="flex justify-between">
                  <strong className="font-medium text-gray-600">
                    Location:
                  </strong>
                  <span>{job.location}</span>
                </li>
                <li className="flex justify-between">
                  <strong className="font-medium text-gray-600">
                    Job Type:
                  </strong>
                  <span>{job.type}</span>
                </li>
                <li className="flex justify-between">
                  <strong className="font-medium text-gray-600">
                    Experience:
                  </strong>
                  <span>{job.experience}</span>
                </li>
                <li className="flex justify-between">
                  <strong className="font-medium text-gray-600">
                    Education:
                  </strong>
                  <span>{job.education}</span>
                </li>
                <li className="flex justify-between">
                  <strong className="font-medium text-gray-600">Salary:</strong>
                  <span>{job.salary || "Negotiable"}</span>
                </li>
                <li className="flex justify-between">
                  <strong className="font-medium text-gray-600">
                    Deadline:
                  </strong>
                  <span>{new Date(job.deadline).toLocaleDateString()}</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8 border-b pb-3">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills?.split(",").map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>

              {/* TODO: Add Company Info Section Here */}
              {/* <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8 border-b pb-3">About MyaCorp</h3>
                            <p className="text-sm text-gray-600 mb-4">...</p>
                            <Link to="/about" className="text-blue-600 hover:underline">Learn More</Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
