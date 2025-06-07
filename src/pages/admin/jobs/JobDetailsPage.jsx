// src/pages/admin/jobs/JobDetailsPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { recruiterAPI } from "../../../api/recruiter"; // Assuming API functions
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EmptyState from "../../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate, formatApplicationStatus, formatSalaryRange } from "../../../utils/formatters";
import Pagination from "../../../components/common/Pagination";

const AdminJobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5; // Number of applications per page

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
    if (!jobId) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const jobResponse = await recruiterAPI.getJobDetail(jobId);
        const appsResponse = await recruiterAPI.getAllApplications({ jobId, status: filterStatus });

        setJob(jobResponse.payload);
        setApplications(appsResponse.payload.content || []);

        // Mock data removed


      } catch (err) {
        console.error("Error fetching job data:", err);
        setError("Failed to load job data. Please try again.");
        if (err.response?.status === 404) setJob(null); // Handle job not found
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId, filterStatus]); // Re-fetch when jobId or filterStatus changes

  const filteredApplications = useMemo(() => {
    // Already filtered by API or in useEffect, but can add client-side search here if needed
    return applications;
  }, [applications]);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredApplications, currentPage]);

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

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
    return <LoadingSpinner fullPage message="Loading job details..." />;
  if (error && !job)
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md text-center">
        {error}
      </div>
    );
  if (!job)
    return (
      <EmptyState
        title="Job Not Found"
        description="The requested job posting could not be found."
        icon="search"
      />
    );

  return (
    <div className="admin-job-details-page p-4 md:p-6 space-y-8">
      {/* Job Header */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
            <div className="text-sm text-gray-500 mt-1">
              <span>
                <FontAwesomeIcon icon="map-marker-alt" className="mr-1.5" />
                {job.location}
              </span>
              <span className="mx-2">|</span>
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusPillClass(
                  job.status
                )}`}
              >
                {job.status}
              </span>
            </div>
          </div>
          <Link
            to={`/admin/jobs/${jobId}/edit`}
            className="px-5 py-2.5 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors shadow-sm flex items-center gap-2 text-sm"
          >
            <FontAwesomeIcon icon="pen" /> Edit Job
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm text-gray-700">
          <InfoPill label="Salary" value={formatSalaryRange(job.minSalary, job.maxSalary)} icon="dollar-sign" />
          <InfoPill
            label="Posted"
            value={formatDate(job.createdAt)}
            icon="calendar-alt"
          />
          <InfoPill
            label="Deadline"
            value={formatDate(job.deadline)}
            icon="calendar-times"
          />
          <InfoPill
            label="Total Apps"
            value={job.applicationQuantity}
            icon="users"
          />
        </div>
      </div>

      {/* Job Description & Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-6">
          <ContentSection title="Job Description" content={job.description} />
          <ContentSection
            title="Key Responsibilities"
            content={job.requirement}
            isList
          />
          <ContentSection
            title="Benefits Offered"
            content={job.benefit}
            isList
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Skills Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills?.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats / Actions for Job */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Job Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => alert("Share job functionality TBD")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                <FontAwesomeIcon icon="share-alt" /> Share Job
              </button>
              {/* Add more actions like "Pause Job", "Close Job" */}
            </div>
          </div>
          {/* You can add more summary cards here if needed */}
        </div>
      </div>

      {/* Applications Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Applications for this Job ({filteredApplications.length})
          </h2>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            <option value="ALL">All Statuses</option>
            {applicationStatuses.map((status) => (
              <option key={status} value={status}>
                {formatApplicationStatus(status)}
              </option>
            ))}
          </select>
        </div>

        {paginatedApplications.length === 0 ? (
          <EmptyState
            icon="file-excel"
            title="No Applications"
            description={
              filterStatus !== "ALL"
                ? "No applications match the current status filter."
                : "No applications received for this job yet."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {app.applicantName}
                      </div>
                      <div className="text-xs text-gray-500">{app.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(app.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusPillClass(
                          app.status
                        )}`}
                      >
                        {formatApplicationStatus(app.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/admin/applications/${app.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Application"
                      >
                        <FontAwesomeIcon icon="eye" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

const InfoPill = ({ label, value, icon }) => (
  <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 border border-gray-200">
    {icon && <FontAwesomeIcon icon={icon} className="text-blue-500 text-lg" />}
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-sm text-gray-800 font-semibold">{value || "N/A"}</p>
    </div>
  </div>
);

const ContentSection = ({ title, content, isList = false }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    {isList ? (
      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 pl-1 leading-relaxed">
        {content
          ?.split("\n")
          .map(
            (item, index) =>
              item.trim() && (
                <li key={index}>{item.trim().replace(/^[-*]\s*/, "")}</li>
              )
          )}
      </ul>
    ) : (
      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
        {content}
      </p>
    )}
  </div>
);

export default AdminJobDetailsPage;
