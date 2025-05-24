// src/pages/applicant/ApplicationDetailsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { JobsContext } from "../../contexts/JobsContext"; // To get job details if needed
// import { candidateAPI } from '../../api/candidate'; // If direct API call needed
import ApplicationStatus from "../../components/applicant/ApplicationStatus"; // Assuming this component is updated
import { formatDate, formatApplicationStatus } from "../../utils/formatters";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ApplicationDetailsPage = () => {
  const { id: applicationId } = useParams(); // Application ID from URL
  const { getUserApplications, jobs } = useContext(JobsContext); // Get applications and all jobs
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [jobDetails, setJobDetails] = useState(null); // To store details of the job applied for
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const userApps = getUserApplications(); // Get all applications from context
      const currentApp = userApps.find(
        (app) => app.id.toString() === applicationId
      );

      if (currentApp) {
        setApplication(currentApp);
        // Find job details from the main jobs list in JobsContext
        const relatedJob = jobs.find(
          (job) => job.id.toString() === currentApp.jobId.toString()
        );
        setJobDetails(relatedJob);
      } else {
        setError("Application not found.");
      }
    } catch (err) {
      console.error("Error fetching application details:", err);
      setError("Failed to load application details.");
    } finally {
      setLoading(false);
    }
  }, [applicationId, getUserApplications, jobs]);

  const handleWithdraw = async () => {
    if (
      !window.confirm("Are you sure you want to withdraw this application?")
    ) {
      return;
    }
    try {
      // TODO: Implement API call for withdrawing and update context/localStorage
      // await candidateAPI.withdrawApplication(applicationId);
      alert("Application withdrawn (mock). Implement API call.");
      navigate("/applicant/applications");
    } catch (err) {
      console.error("Error withdrawing application:", err);
      setError("Failed to withdraw application. Please try again.");
    }
  };

  if (loading) {
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

  if (!application) {
    return (
      <EmptyState
        title="Application Not Found"
        description="The application details could not be retrieved."
        icon="file-excel"
      />
    );
  }

  const formattedStatus = formatApplicationStatus(application.status);

  return (
    <div className="application-details-page p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <Link
          to="/applicant/applications"
          className="text-blue-600 hover:underline flex items-center mb-4"
        >
          <FontAwesomeIcon icon="arrow-left" className="mr-2" />
          Back to My Applications
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Application for: {application.jobTitle}
        </h1>
        <p className="text-gray-600 mt-1">At {application.company}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <section className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Application Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="block text-gray-500">Applied Date:</strong>
                <span className="text-gray-700">
                  {formatDate(application.appliedDate)}
                </span>
              </div>
              <div>
                <strong className="block text-gray-500">Job Location:</strong>
                <span className="text-gray-700">
                  {application.location || jobDetails?.location}
                </span>
              </div>
              <div>
                <strong className="block text-gray-500">Job Type:</strong>
                <span className="text-gray-700">
                  {application.jobType || jobDetails?.type}
                </span>
              </div>
              <div>
                <strong className="block text-gray-500">Current Status:</strong>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    application.status
                      ? application.status.toLowerCase().replace(/\s+/g, "-")
                      : ""
                  }-status-badge`}
                >
                  {formattedStatus}
                </span>
              </div>
            </div>
          </section>

          <section className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Your Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="block text-gray-500">Full Name:</strong>
                <span className="text-gray-700">
                  {application.firstName} {application.lastName}
                </span>
              </div>
              <div>
                <strong className="block text-gray-500">Email:</strong>
                <span className="text-gray-700">{application.email}</span>
              </div>
              <div>
                <strong className="block text-gray-500">Phone:</strong>
                <span className="text-gray-700">{application.phone}</span>
              </div>
              {application.expectedSalary && (
                <div>
                  <strong className="block text-gray-500">
                    Expected Salary:
                  </strong>
                  <span className="text-gray-700">
                    {application.expectedSalary}
                  </span>
                </div>
              )}
              {application.availableDate && (
                <div>
                  <strong className="block text-gray-500">
                    Available From:
                  </strong>
                  <span className="text-gray-700">
                    {formatDate(application.availableDate)}
                  </span>
                </div>
              )}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Documents
            </h2>
            <div className="space-y-3">
              {application.resumeUrl || application.resume ? ( // Check both new and old property
                <a
                  href={
                    application.resumeUrl ||
                    URL.createObjectURL(application.resume)
                  } // Handle file object or URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
                >
                  <FontAwesomeIcon icon="file-pdf" /> View Resume/CV
                </a>
              ) : (
                <p className="text-gray-500 text-sm">No resume submitted.</p>
              )}
              {application.coverLetter && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">
                    Cover Letter:
                  </h4>
                  <p className="text-gray-600 text-sm whitespace-pre-line p-3 bg-gray-50 rounded-md border">
                    {application.coverLetter}
                  </p>
                </div>
              )}
            </div>
          </section>
          {/* Interview Details Section - if available */}
          {application.interviewDetails && (
            <section className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Interview Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="block text-gray-500">Date & Time:</strong>
                  <span className="text-gray-700">
                    {formatDate(application.interviewDetails.datetime, {
                      includeTime: true,
                    })}
                  </span>
                </div>
                <div>
                  <strong className="block text-gray-500">Type:</strong>
                  <span className="text-gray-700">
                    {application.interviewDetails.type}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <strong className="block text-gray-500">
                    Location/Link:
                  </strong>
                  {application.interviewDetails.type?.toLowerCase() ===
                  "online" ? (
                    <a
                      href={application.interviewDetails.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {application.interviewDetails.location}
                    </a>
                  ) : (
                    <span className="text-gray-700">
                      {application.interviewDetails.location}
                    </span>
                  )}
                </div>
                {application.interviewDetails.interviewer && (
                  <div>
                    <strong className="block text-gray-500">
                      Interviewer(s):
                    </strong>
                    <span className="text-gray-700">
                      {application.interviewDetails.interviewer}
                    </span>
                  </div>
                )}
                {application.interviewDetails.notes && (
                  <div className="sm:col-span-2">
                    <strong className="block text-gray-500">Notes:</strong>
                    <p className="text-gray-700 whitespace-pre-line">
                      {application.interviewDetails.notes}
                    </p>
                  </div>
                )}
              </div>
              <Link
                to={`/applicant/applications/${application.id}/interview`}
                className="mt-4 inline-block px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200"
              >
                View Full Interview Details
              </Link>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Application Timeline
            </h3>
            <ApplicationStatus status={application.status} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Actions
            </h3>
            <div className="space-y-3">
              {jobDetails && (
                <Link
                  to={`/jobs/${application.jobId}`}
                  className="w-full block text-center px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <FontAwesomeIcon icon="briefcase" className="mr-2" />
                  View Job Details
                </Link>
              )}
              {(formattedStatus === "Pending Review" ||
                formattedStatus === "In Review") && (
                <button
                  onClick={handleWithdraw}
                  className="w-full px-4 py-2.5 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                >
                  <FontAwesomeIcon icon="times-circle" className="mr-2" />
                  Withdraw Application
                </button>
              )}
              {formattedStatus.toLowerCase().replace(/\s+/g, "") ===
                "interviewscheduled" && (
                <Link
                  to={`/applicant/applications/${application.id}/feedback`}
                  className="w-full block text-center px-4 py-2.5 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
                >
                  <FontAwesomeIcon icon="comment-dots" className="mr-2" />
                  Provide Interview Feedback
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;
