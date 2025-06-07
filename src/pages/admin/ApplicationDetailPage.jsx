// src/pages/admin/ApplicationDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { recruiterAPI } from "../../api/recruiter"; // Assuming API functions
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal"; // Reusable Modal
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate, formatApplicationStatus } from "../../utils/formatters";

const AdminApplicationDetailPage = () => {
  const { id: applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [recruiterNote, setRecruiterNote] = useState("");
  const [isNoteSaving, setIsNoteSaving] = useState(false);

  const applicationStatuses = [
    "PENDING_REVIEW",
    "IN_REVIEW",
    "SHORTLISTED",
    "INTERVIEW_SCHEDULED",
    "OFFER_EXTENDED",
    "HIRED",
    "REJECTED",
    "WITHDRAWN",
  ];

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await recruiterAPI.getApplicationDetailsForAdmin(applicationId);
        setApplication(response.payload);
        setRecruiterNote(response.payload?.recruiterNote || '');

        // TODO: Replace with actual API call
        // const response = await recruiterAPI.getApplicationDetailsForAdmin(applicationId);
        // setApplication(response.application);
        // setRecruiterNote(response.application?.recruiterNote || '');

        // Mock data
        // await new Promise((resolve) => setTimeout(resolve, 700));
        // const mockApp = {
        //   id: applicationId,
        //   applicantName: `Applicant ${applicationId}`,
        //   email: `applicant${applicationId}@example.com`,
        //   phone: `0900000${applicationId.slice(-3)}`,
        //   jobId: "job1",
        //   jobTitle: "Senior Fashion Designer",
        //   department: "Design",
        //   location: "New York, NY",
        //   appliedDate: new Date(
        //     Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
        //   ).toISOString(),
        //   status:
        //     applicationStatuses[
        //       Math.floor(Math.random() * applicationStatuses.length)
        //     ],
        //   resumeUrl: "#view-resume-link", // Placeholder
        //   coverLetter:
        //     "Passionate and driven fashion enthusiast with 5 years of experience in haute couture and ready-to-wear collections. Eager to contribute innovative designs to MyaCorp.",
        //   education: "Master's in Fashion Design, Parsons School of Design",
        //   experience:
        //     "5 years as Lead Designer at XYZ Couture, 2 years as Junior Designer at ABC Prints",
        //   skills: [
        //     "Adobe Creative Suite",
        //     "Pattern Making",
        //     "Trend Forecasting",
        //     "Textile Knowledge",
        //   ],
        //   linkedinProfile: "linkedin.com/in/applicantxyz",
        //   portfolioUrl: "portfolio.example.com/applicantxyz",
        //   recruiterNote:
        //     "Strong portfolio, seems like a good fit for the team culture. Recommended for initial screening.",
        //   timeline: [
        //     {
        //       date: new Date(
        //         Date.now() - 5 * 24 * 60 * 60 * 1000
        //       ).toISOString(),
        //       title: "Application Submitted",
        //       description: "Candidate applied for the role.",
        //     },
        //     {
        //       date: new Date(
        //         Date.now() - 3 * 24 * 60 * 60 * 1000
        //       ).toISOString(),
        //       title: "Application Viewed",
        //       description: "Recruiter John Smith viewed the application.",
        //     },
        //   ],
        // };
        // if (mockApp.status === "INTERVIEW_SCHEDULED") {
        //   mockApp.interviewDetails = {
        //     datetime: new Date(
        //       Date.now() + 5 * 24 * 60 * 60 * 1000
        //     ).toISOString(),
        //     type: "Online Video Call",
        //     location: "Google Meet (link will be sent via email)", // Or actual link
        //     interviewer: "Jane Doe (Hiring Manager)",
        //     notes: "Prepare a 15-min presentation on your recent project.",
        //   };
        //   mockApp.timeline.push({
        //     date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        //     title: "Interview Scheduled",
        //     description: "First round interview with Jane Doe.",
        //   });
        // }
        // setApplication(mockApp);
        // setRecruiterNote(mockApp.recruiterNote || "");
      } catch (err) {
        console.error("Error fetching application details:", err);
        setError("Failed to load application details. Please try again.");
        if (err.response?.status === 404) setApplication(null);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicationDetail();
  }, [applicationId]);

  const handleUpdateStatus = async () => {
    if (!application || !newStatus) return;
    try {
      await recruiterAPI.updateApplicationStatus(application.id, { status: newStatus });
      setApplication((prev) => ({ ...prev, status: newStatus }));
      setShowStatusModal(false);
    } catch (err) {
      console.error("Error updating application status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleSaveNote = async () => {
    if (!application) return;
    setIsNoteSaving(true);
    try {
      await recruiterAPI.updateApplicationNote(application.id, { note: recruiterNote });
      setApplication((prev) => ({ ...prev, recruiterNote })); // Optimistic update
      alert("Note saved successfully!");
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Failed to save note. Please try again.");
    } finally {
      setIsNoteSaving(false);
    }
  };

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

  if (loading)
    return <LoadingSpinner fullPage message="Loading application details..." />;
  if (error && !application)
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md text-center">
        {error}
      </div>
    );
  if (!application)
    return (
      <EmptyState
        title="Application Not Found"
        description="The requested application could not be found."
        icon="file-excel"
      />
    );

  return (
    <div className="admin-application-detail-page p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div>
          <Link
            to={`/admin/jobs/${application.jobId}`}
            className="text-sm text-blue-600 hover:underline flex items-center mb-1"
          >
            <FontAwesomeIcon icon="arrow-left" className="mr-2" /> Back to Job
            Applications
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Application: {application.applicantName}
          </h1>
          <p className="text-gray-600">
            For:{" "}
            <Link
              to={`/admin/jobs/${application.jobId}`}
              className="font-medium hover:underline"
            >
              {application.jobTitle}
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1.5 text-sm font-semibold rounded-full ${getStatusPillClass(
              application.status
            )}`}
          >
            {formatApplicationStatus(application.status)}
          </span>
          <button
            onClick={() => {
              setNewStatus(application.status);
              setShowStatusModal(true);
            }}
            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 text-sm flex items-center gap-2"
          >
            <FontAwesomeIcon icon="edit" /> Change Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Applicant Details, Documents, Notes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-8">
          <DetailSection title="Applicant Information" icon="user-tie">
            <InfoItem label="Full Name" value={application.applicantName} />
            <InfoItem label="Email" value={application.email} type="email" />
            <InfoItem label="Phone" value={application.phone} type="tel" />
            <InfoItem
              label="Applied On"
              value={formatDate(application.appliedDate)}
            />
          </DetailSection>

          <DetailSection title="Professional Background" icon="briefcase">
            <InfoItem
              label="Education"
              value={application.education}
              multiline
            />
            <InfoItem
              label="Experience"
              value={application.experience}
              multiline
            />
            <InfoItem label="Skills">
              <div className="flex flex-wrap gap-2 mt-1">
                {application.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </InfoItem>
          </DetailSection>

          <DetailSection title="Submitted Documents" icon="folder-open">
            <InfoItem label="Resume/CV">
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium flex items-center gap-1"
              >
                <FontAwesomeIcon icon="file-pdf" /> View Resume
              </a>
            </InfoItem>
            {application.coverLetter && (
              <InfoItem
                label="Cover Letter"
                value={application.coverLetter}
                multiline
              />
            )}
            {application.linkedinProfile && (
              <InfoItem
                label="LinkedIn"
                value={application.linkedinProfile}
                type="url"
              />
            )}
            {application.portfolioUrl && (
              <InfoItem
                label="Portfolio"
                value={application.portfolioUrl}
                type="url"
              />
            )}
          </DetailSection>

          <DetailSection title="Recruiter Notes" icon="sticky-note">
            <textarea
              value={recruiterNote}
              onChange={(e) => setRecruiterNote(e.target.value)}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Add internal notes about this candidate..."
            />
            <button
              onClick={handleSaveNote}
              disabled={isNoteSaving}
              className="mt-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 disabled:bg-gray-300"
            >
              {isNoteSaving ? "Saving..." : "Save Note"}
            </button>
          </DetailSection>
        </div>

        {/* Sidebar: Timeline & Interview Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FontAwesomeIcon icon="list-ol" className="mr-2 text-blue-500" />
              Application Timeline
            </h3>
            <ul className="space-y-4">
              {application.timeline?.map((event, index) => (
                <li
                  key={index}
                  className="relative pl-6 border-l-2 border-blue-200 last:border-l-transparent"
                >
                  <span className="absolute -left-[0.3rem] top-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white"></span>
                  <p className="text-xs text-gray-500">
                    {formatDate(event.date, { includeTime: true })}
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {event.title}
                  </p>
                  {event.description && (
                    <p className="text-xs text-gray-600">{event.description}</p>
                  )}
                </li>
              ))}
              {!application.timeline?.length && (
                <p className="text-xs text-gray-500">No timeline events yet.</p>
              )}
            </ul>
          </div>

          {application.interviewDetails && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FontAwesomeIcon
                  icon="calendar-check"
                  className="mr-2 text-purple-500"
                />
                Interview Details
              </h3>
              <InfoItem
                label="Date & Time"
                value={formatDate(application.interviewDetails.datetime, {
                  includeTime: true,
                })}
              />
              <InfoItem
                label="Type"
                value={application.interviewDetails.type}
              />
              <InfoItem
                label="Location/Link"
                value={application.interviewDetails.location}
                type={
                  application.interviewDetails.type === "Online Video Call"
                    ? "url"
                    : "text"
                }
              />
              <InfoItem
                label="Interviewer"
                value={application.interviewDetails.interviewer}
              />
              {application.interviewDetails.notes && (
                <InfoItem
                  label="Notes"
                  value={application.interviewDetails.notes}
                  multiline
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <Modal
          title={`Update Status for ${application.applicantName}`}
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          size="md"
        >
          <div className="p-2 space-y-4">
            <p className="text-sm text-gray-600">
              Current Status:{" "}
              <span
                className={`font-semibold ${getStatusPillClass(
                  application.status
                )} px-2 py-0.5 rounded-full text-xs`}
              >
                {formatApplicationStatus(application.status)}
              </span>
            </p>
            <div>
              <label
                htmlFor="newStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Status:
              </label>
              <select
                id="newStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {applicationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {formatApplicationStatus(status)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const DetailSection = ({ title, icon, children }) => (
  <section className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
      <FontAwesomeIcon icon={icon} className="mr-3 text-blue-500" />
      {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </section>
);

const InfoItem = ({
  label,
  value,
  type = "text",
  multiline = false,
  children,
}) => (
  <div>
    <strong className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
      {label}
    </strong>
    {children ? (
      <div className="text-sm text-gray-800 mt-0.5">{children}</div>
    ) : multiline ? (
      <p className="text-sm text-gray-800 whitespace-pre-line mt-0.5">
        {value || "N/A"}
      </p>
    ) : type === "email" ? (
      <a
        href={`mailto:${value}`}
        className="text-sm text-blue-600 hover:underline mt-0.5"
      >
        {value || "N/A"}
      </a>
    ) : type === "tel" ? (
      <a
        href={`tel:${value}`}
        className="text-sm text-blue-600 hover:underline mt-0.5"
      >
        {value || "N/A"}
      </a>
    ) : type === "url" ? (
      <a
        href={value && !value.startsWith("http") ? `https://${value}` : value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline mt-0.5 break-all"
      >
        {value || "N/A"}
      </a>
    ) : (
      <span className="text-sm text-gray-800 mt-0.5">{value || "N/A"}</span>
    )}
  </div>
);

export default AdminApplicationDetailPage;
