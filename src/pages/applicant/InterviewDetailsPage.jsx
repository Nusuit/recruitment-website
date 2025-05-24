// src/pages/applicant/InterviewDetailsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { JobsContext } from "../../contexts/JobsContext"; // To get application details
// import { candidateAPI } from '../../api/candidate'; // If direct API call is preferred
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate, formatTime } from "../../utils/formatters"; // Assuming formatters

const InterviewDetailsPage = () => {
  const { applicationId } = useParams();
  const { getUserApplications, loading: jobsContextLoading } =
    useContext(JobsContext);

  const [application, setApplication] = useState(null);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobsContextLoading) return;

    setLoading(true);
    setError(null);
    try {
      const userApps = getUserApplications();
      const currentApp = userApps.find(
        (app) => app.id.toString() === applicationId
      );

      if (currentApp && currentApp.interviewDetails) {
        // Check for interviewDetails
        setApplication(currentApp);
        setInterview(currentApp.interviewDetails);
      } else if (currentApp) {
        setError("No interview scheduled for this application yet.");
        setApplication(currentApp); // Still set application to show job title etc.
      } else {
        setError("Application not found or interview details are missing.");
      }
    } catch (err) {
      console.error("Error fetching interview details:", err);
      setError("Failed to load interview details.");
    } finally {
      setLoading(false);
    }
  }, [applicationId, getUserApplications, jobsContextLoading]);

  const getInterviewTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "online":
      case "video":
        return "video";
      case "phone":
        return "phone-alt";
      case "in-person":
      case "onsite":
        return "building";
      default:
        return "calendar-alt";
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading interview details..." />;
  }

  if (error && !interview) {
    // If interview details are specifically the problem
    return (
      <div className="p-4 md:p-8 text-center">
        <EmptyState
          title="Interview Details Error"
          description={error}
          icon="exclamation-triangle"
        />
        {application && (
          <Link
            to={`/applicant/applications/${applicationId}`}
            className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Application
          </Link>
        )}
      </div>
    );
  }

  if (!application) {
    return (
      <EmptyState
        title="Application Not Found"
        description="Could not find the application."
        icon="file-excel"
      />
    );
  }
  if (!interview) {
    // This case might be covered by error state, but good to have
    return (
      <div className="p-4 md:p-8 text-center">
        <EmptyState
          title="No Interview Scheduled"
          description="There are no interview details available for this application yet."
          icon="calendar-times"
        />
        <Link
          to={`/applicant/applications/${applicationId}`}
          className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Application
        </Link>
      </div>
    );
  }

  return (
    <div className="interview-details-page container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <Link
          to={`/applicant/applications/${applicationId}`}
          className="text-blue-600 hover:underline flex items-center mb-4 text-sm"
        >
          <FontAwesomeIcon icon="arrow-left" className="mr-2" />
          Back to Application
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Interview for {application.jobTitle}
        </h1>
        <p className="text-gray-600 mt-1">With {application.company}</p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Interview Info */}
          <div className="space-y-6">
            <InfoSection
              title="Schedule & Logistics"
              icon={getInterviewTypeIcon(interview.type)}
            >
              <InfoItem
                label="Date"
                value={formatDate(interview.datetime)}
                icon="calendar-day"
              />
              <InfoItem
                label="Time"
                value={formatTime(interview.datetime)}
                icon="clock"
              />
              <InfoItem
                label="Duration"
                value={`${interview.duration || "N/A"} minutes`}
                icon="hourglass-half"
              />
              <InfoItem
                label="Type"
                value={interview.type || "N/A"}
                icon="info-circle"
              />
            </InfoSection>

            <InfoSection title="Location / Platform" icon="map-marked-alt">
              {interview.type?.toLowerCase() === "online" ||
              interview.type?.toLowerCase() === "video" ? (
                <>
                  <InfoItem
                    label="Platform"
                    value={interview.platform || "N/A"}
                    icon="laptop"
                  />
                  <InfoItem label="Meeting Link" icon="link">
                    {interview.meetingLink ? (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium break-all"
                      >
                        {interview.meetingLink}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </InfoItem>
                </>
              ) : (
                <InfoItem
                  label="Address"
                  value={interview.location || "N/A"}
                  icon="map-pin"
                />
              )}
            </InfoSection>
          </div>

          {/* Right Column - Interviewers & Notes */}
          <div className="space-y-6">
            {interview.interviewers && interview.interviewers.length > 0 && (
              <InfoSection title="Interviewer(s)" icon="users">
                {interview.interviewers.map((interviewer, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 mb-2 p-2 bg-gray-50 rounded-md"
                  >
                    <img
                      src={
                        interviewer.avatarUrl ||
                        "/assets/images/default-avatar.png"
                      }
                      alt={interviewer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {interviewer.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {interviewer.position}
                      </p>
                    </div>
                  </div>
                ))}
              </InfoSection>
            )}

            {interview.notes && (
              <InfoSection title="Important Notes" icon="sticky-note">
                <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                  {interview.notes}
                </p>
              </InfoSection>
            )}
            {interview.preparation && (
              <InfoSection title="What to Prepare" icon="clipboard-list">
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  {Array.isArray(interview.preparation) ? (
                    interview.preparation.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  ) : (
                    <li>{interview.preparation}</li>
                  )}
                </ul>
              </InfoSection>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
          {/* Actions like "Add to Calendar" can be added here */}
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2">
            <FontAwesomeIcon icon="calendar-plus" /> Add to Calendar
          </button>
          <Link
            to={`/applicant/applications/${applicationId}/feedback`}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon="comment-dots" /> Provide Feedback (After
            Interview)
          </Link>
        </div>
      </div>
    </div>
  );
};

// Helper components for consistent section styling
const InfoSection = ({ title, icon, children }) => (
  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
      <FontAwesomeIcon icon={icon} className="mr-3 text-blue-500" />
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const InfoItem = ({ label, value, icon, children }) => (
  <div className="flex items-start">
    {icon && (
      <FontAwesomeIcon
        icon={icon}
        className="text-gray-400 mt-1 mr-3 w-4 text-center"
      />
    )}
    <div className="flex-1">
      <strong className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </strong>
      {value && <span className="text-sm text-gray-800">{value}</span>}
      {children}
    </div>
  </div>
);

export default InterviewDetailsPage;
