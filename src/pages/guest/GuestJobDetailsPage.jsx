import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { JobsContext } from "../../contexts/JobsContext";
import { AuthContext } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatTimeAgo } from "../../utils/formatters";

const GuestJobDetailsPage = () => {
  const { jobId } = useParams();
  const { getJobById } = useContext(JobsContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("GuestJobDetailsPage - Auth state:", { isAuthenticated, user });
    console.log("GuestJobDetailsPage - Job ID:", jobId);
    
    if (!jobId) {
      setError("Job ID is required");
      return;
    }

    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const jobData = await getJobById(jobId);
        if (jobData) {
          setJob(jobData);
          console.log("GuestJobDetailsPage - Fetched job:", jobData);
        } else {
          setError("Job not found.");
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, getJobById, isAuthenticated, user]);

  const handleApplyClick = (e) => {
    e.preventDefault();
    console.log("GuestJobDetailsPage - Apply button clicked");
    console.log("Current auth state:", { isAuthenticated, user });
    
    try {
      if (!isAuthenticated) {
        navigate("/login", { state: { from: { pathname: `/applicant/jobs/${job.id}/apply` } } });
      } else if (user?.role?.toLowerCase() === "applicant") {
        console.log("Navigating to apply page:", `/applicant/jobs/${job.id}/apply`);
        navigate(`/applicant/jobs/${job.id}/apply`, { replace: true });
      } else {
        console.log("User role is not applicant:", user?.role);
        alert("You need an applicant account to apply for jobs.");
      }
    } catch (err) {
      console.error("Error during navigation:", err);
      alert("An error occurred. Please try again.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <EmptyState message={error} />;
  if (!job) return <EmptyState message="Job not found." />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                {job.logoUrl ? (
                  <img
                    src={job.logoUrl}
                    alt={`${job.company} logo`}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon="building"
                    className="text-3xl text-gray-400"
                  />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-gray-600">{job.company}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="inline-block px-6 py-3 text-center text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg no-underline transform hover:scale-[1.02]"
                  >
                    Login to Apply
                  </Link>
                  <Link
                    to="/register"
                    className="inline-block px-6 py-3 text-center text-blue-600 border-2 border-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg no-underline"
                  >
                    Create Account
                  </Link>
                </>
              ) : user?.role?.toLowerCase() === "applicant" && (
                <button
                  onClick={handleApplyClick}
                  className="inline-block px-6 py-3 text-center text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg no-underline transform hover:scale-[1.02]"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Job Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon="location-dot"
                    className="text-gray-400"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon="clock"
                    className="text-gray-400"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Job Type</p>
                    <p className="text-gray-900">{job.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon="dollar-sign"
                    className="text-gray-400"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="text-gray-900">{job.salary || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon="calendar"
                    className="text-gray-400"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Posted</p>
                    <p className="text-gray-900">
                      {formatTimeAgo(job.postedDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Job Description
              </h2>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: job.description }} />
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Requirements
              </h2>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
              </div>
            </div>

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Benefits
                </h2>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: job.benefits }} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About the Company
              </h2>
              <div className="prose max-w-none">
                <p>{job.companyDescription || "No company description available."}</p>
              </div>
            </div>

            {/* Tags/Skills */}
            {job.tags && job.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Skills & Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(job.tags)
                    ? job.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))
                    : typeof job.tags === "string" &&
                      job.tags.split(",").map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-blue-50 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Ready to Apply?
              </h3>
              <p className="text-blue-700 mb-4">
                {!isAuthenticated 
                  ? "Create an account or sign in to apply for this position and track your application status."
                  : user?.role?.toLowerCase() === "applicant"
                  ? "Click below to view full details and apply for this position."
                  : "You need a candidate account to apply for jobs."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestJobDetailsPage; 