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
  const [lastRefresh, setLastRefresh] = useState(Date.now());

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

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch applications and jobs data with sorting
      const [appsResponse, jobsResponse] = await Promise.all([
        recruiterAPI.getAllApplications({
          sort: "createdAt,desc" // Always sort by creation date descending
        }),
        recruiterAPI.getJobs()
      ]);

      if (appsResponse.success && jobsResponse.success) {
        // Handle applications
        const applications = Array.isArray(appsResponse.payload) 
          ? appsResponse.payload 
          : (appsResponse.payload?.content || []);
        setApplications(applications);

        // Handle jobs for filtering
        const jobs = Array.isArray(jobsResponse.payload)
          ? jobsResponse.payload
          : (jobsResponse.payload?.content || []);
        setAvailableJobs(jobs.map(job => ({ id: job.id, title: job.title })));
      } else {
        throw new Error(appsResponse.message || jobsResponse.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching applicants data:", err);
      setError("Failed to load applicant data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Refresh data every 30 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setLastRefresh(Date.now());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data whenever lastRefresh changes
  useEffect(() => {
    fetchData();
  }, [lastRefresh]);

  const handleRefresh = () => {
    setLastRefresh(Date.now());
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication || !newStatus) return;
    
    setLoading(true);
    try {
      const response = await recruiterAPI.updateApplicationStatus(selectedApplication.id, newStatus);
      if (response.success) {
        // Update the local state with the new status
        setApplications(prevApps =>
          prevApps.map(app =>
            app.id === selectedApplication.id ? { ...app, status: newStatus } : app
          )
        );
        setShowStatusModal(false);
        setSelectedApplication(null);
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      setError("Failed to update application status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const searchTermLower = searchTerm.toLowerCase();
        const nameMatch = (app.applicantName || '')
          .toLowerCase()
          .includes(searchTermLower);
        const emailMatch = (app.email || '')
          .toLowerCase()
          .includes(searchTermLower);
        const jobTitleMatch = (app.jobTitle || '')
          .toLowerCase()
          .includes(searchTermLower);
        const statusMatch =
          filterStatus === "ALL" || app.status === filterStatus;
        const jobMatch = filterJob === "ALL" || app.jobId === filterJob;
        return (
          (nameMatch || emailMatch || jobTitleMatch) && statusMatch && jobMatch
        );
      })
      .sort((a, b) => {
        const [key, direction] = sortBy.split("_");
        let valA = a[key] || '';
        let valB = b[key] || '';
        if (key === "appliedDate") {
          valA = new Date(valA || 0);
          valB = new Date(valB || 0);
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Applicant Management</h1>
        <div className="flex gap-4">
          <Link
            to="/admin/interviews"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon="calendar-check" />
            Manage Interviews
          </Link>
        </div>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <FontAwesomeIcon icon="sync" className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Jobs</option>
          {availableJobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {/* Applications Table */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
      ) : applications.length === 0 ? (
        <EmptyState
          message="No applications found"
          description="There are currently no applications in the system."
        />
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
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
              {applications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.candidateName || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.candidateEmail || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {application.job?.title || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(application.appliedDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusPillClass(
                        application.status
                      )}`}
                    >
                      {formatApplicationStatus(application.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/applications/${application.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setNewStatus(application.status);
                          setShowStatusModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Update Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedApplication(null);
        }}
        title="Update Application Status"
      >
        <div className="p-4">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          >
            {applicationStatuses.map((status) => (
              <option key={status} value={status}>
                {formatApplicationStatus(status)}
              </option>
            ))}
          </select>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setShowStatusModal(false);
                setSelectedApplication(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStatus}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </div>
      </Modal>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(applications.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case "PENDING_REVIEW":
      return "bg-yellow-100 text-yellow-800";
    case "IN_REVIEW":
      return "bg-blue-100 text-blue-800";
    case "SHORTLISTED":
      return "bg-indigo-100 text-indigo-800";
    case "INTERVIEW_SCHEDULED":
      return "bg-purple-100 text-purple-800";
    case "OFFER_EXTENDED":
      return "bg-pink-100 text-pink-800";
    case "HIRED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "WITHDRAWN":
      return "bg-gray-100 text-gray-500";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default ApplicantsManagement;
