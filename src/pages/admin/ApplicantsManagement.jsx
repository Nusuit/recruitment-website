// src/pages/admin/ApplicantsManagement.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/common/Modal";
import { recruiterAPI } from "../../api/recruiter"; // Assuming API functions
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate, formatApplicationStatus } from "../../utils/formatters";
import Pagination from "../../components/common/Pagination"; // Assuming Pagination is updated

const ApplicantsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterJob, setFilterJob] = useState("ALL");
  const [sortBy, setSortBy] = useState("appliedDate_desc"); // e.g., 'applicantName_asc', 'appliedDate_desc'

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const [availableJobs, setAvailableJobs] = useState([]); // For the job filter dropdown
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Available statuses for filtering and modal
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
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API calls
        // const appsResponse = await recruiterAPI.getAllApplications();
        // const jobsResponse = await recruiterAPI.getAllJobsForFilter(); // API to get job titles for filter
        // setApplications(appsResponse.applications || []);
        // setAvailableJobs(jobsResponse.jobs || []);

        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockApplications = [
          {
            id: "app101",
            applicantName: "Nguyen Van A",
            email: "nguyenvana@example.com",
            phone: "0901234567",
            jobId: "job1",
            jobTitle: "Senior Fashion Designer",
            appliedDate: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "PENDING_REVIEW",
            resumeUrl: "#",
            rating: 0,
          },
          {
            id: "app102",
            applicantName: "Tran Thi B",
            email: "tranthib@example.com",
            phone: "0902345678",
            jobId: "job2",
            jobTitle: "Retail Store Manager",
            appliedDate: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "SHORTLISTED",
            resumeUrl: "#",
            rating: 0,
          },
          {
            id: "app103",
            applicantName: "Le Van C",
            email: "levanc@example.com",
            phone: "0903456789",
            jobId: "job1",
            jobTitle: "Senior Fashion Designer",
            appliedDate: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "INTERVIEW_SCHEDULED",
            resumeUrl: "#",
            rating: 0,
          },
          {
            id: "app104",
            applicantName: "Pham Thi D",
            email: "phamthid@example.com",
            phone: "0904567890",
            jobId: "job3",
            jobTitle: "Marketing Intern",
            appliedDate: new Date(
              Date.now() - 4 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "HIRED",
            resumeUrl: "#",
            rating: 0,
          },
          {
            id: "app105",
            applicantName: "Hoang Van E",
            email: "hoangvane@example.com",
            phone: "0905678901",
            jobId: "job2",
            jobTitle: "Retail Store Manager",
            appliedDate: new Date(
              Date.now() - 5 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "REJECTED",
            resumeUrl: "#",
            rating: 0,
          },
        ];
        setApplications(mockApplications);
        setAvailableJobs([
          { id: "job1", title: "Senior Fashion Designer" },
          { id: "job2", title: "Retail Store Manager" },
          { id: "job3", title: "Marketing Intern" },
        ]);
      } catch (err) {
        console.error("Error fetching applicants data:", err);
        setError("Failed to load applicant data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedApplication || !newStatus) return;
    // TODO: Implement API call to update application status
    // await recruiterAPI.updateApplicationStatus(selectedApplication.id, newStatus);
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === selectedApplication.id ? { ...app, status: newStatus } : app
      )
    );
    setShowStatusModal(false);
    setSelectedApplication(null);
  };

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const nameMatch = app.applicantName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const emailMatch = app.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const jobTitleMatch = app.jobTitle
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const statusMatch =
          filterStatus === "ALL" || app.status === filterStatus;
        const jobMatch = filterJob === "ALL" || app.jobId === filterJob;
        return (
          (nameMatch || emailMatch || jobTitleMatch) && statusMatch && jobMatch
        );
      })
      .sort((a, b) => {
        const [key, direction] = sortBy.split("_");
        let valA = a[key];
        let valB = b[key];
        if (key === "appliedDate") {
          valA = new Date(valA);
          valB = new Date(valB);
        } else if (typeof valA === "string") {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [applications, searchTerm, filterStatus, filterJob, sortBy]);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredApplications, currentPage]);

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortBy.startsWith(key) && sortBy.endsWith("asc")) {
      direction = "desc";
    }
    setSortBy(`${key}_${direction}`);
  };

  const getSortIcon = (key) => {
    if (!sortBy.startsWith(key))
      return <FontAwesomeIcon icon="sort" className="ml-1 text-gray-400" />;
    if (sortBy.endsWith("asc"))
      return <FontAwesomeIcon icon="sort-up" className="ml-1" />;
    return <FontAwesomeIcon icon="sort-down" className="ml-1" />;
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
    return <LoadingSpinner fullPage message="Loading applicants..." />;
  if (error)
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md text-center">
        {error}
      </div>
    );

  return (
    <div className="applicants-management-page p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Applicants Management
      </h1>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md space-y-4 md:space-y-0 md:flex md:flex-wrap md:justify-between md:items-center gap-4">
        <div className="relative flex-grow md:max-w-md">
          <FontAwesomeIcon
            icon="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, email, job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2.5 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="ALL">All Statuses</option>
            {applicationStatuses.map((status) => (
              <option key={status} value={status}>
                {formatApplicationStatus(status)}
              </option>
            ))}
          </select>
          <select
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="ALL">All Jobs</option>
            {availableJobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {paginatedApplications.length === 0 ? (
        <EmptyState
          icon="users-slash"
          title="No Applicants Found"
          description={
            searchTerm || filterStatus !== "ALL" || filterJob !== "ALL"
              ? "No applicants match your current filters."
              : "There are no applications to display."
          }
        />
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => requestSort("applicantName")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Applicant {getSortIcon("applicantName")}
                </th>
                <th
                  onClick={() => requestSort("jobTitle")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Job Title {getSortIcon("jobTitle")}
                </th>
                <th
                  onClick={() => requestSort("appliedDate")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Applied {getSortIcon("appliedDate")}
                </th>
                <th
                  onClick={() => requestSort("status")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Status {getSortIcon("status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {app.applicantName}
                    </div>
                    <div className="text-xs text-gray-500">{app.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <Link
                      to={`/admin/jobs/${app.jobId}`}
                      className="hover:text-blue-600"
                    >
                      {app.jobTitle}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(app.appliedDate)}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      to={`/admin/applications/${app.id}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <FontAwesomeIcon icon="eye" />
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedApplication(app);
                        setNewStatus(app.status);
                        setShowStatusModal(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Change Status"
                    >
                      <FontAwesomeIcon icon="edit" />
                    </button>
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800"
                      title="Download Resume"
                    >
                      <FontAwesomeIcon icon="file-arrow-down" />
                    </a>
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

      {showStatusModal && selectedApplication && (
        <Modal
          title={`Update Status for ${selectedApplication.applicantName}`}
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          size="md"
        >
          <div className="p-2 space-y-4">
            <p className="text-sm text-gray-600">
              Applied for:{" "}
              <span className="font-semibold">
                {selectedApplication.jobTitle}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Current Status:{" "}
              <span
                className={`font-semibold ${getStatusPillClass(
                  selectedApplication.status
                )} px-2 py-0.5 rounded-full text-xs`}
              >
                {formatApplicationStatus(selectedApplication.status)}
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

export default ApplicantsManagement;
