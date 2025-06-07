// src/pages/admin/JobManagement.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { recruiterAPI } from "../../api/recruiter"; // Assuming this API exists
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from "../../utils/formatters";

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, ACTIVE, PAUSED, DRAFT, EXPIRED
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "postedDate",
    direction: "descending",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await recruiterAPI.getJobs(); // Using the actual API call
        setJobs(response.content || []);

        // Mock data removed

      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this job posting? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      await recruiterAPI.deleteJob(jobId); // Actual API call
      setJobs((prevJobs) => prevJobs.filter((job) => job.jobId !== jobId));
      // Add a success notification if desired
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job. Please try again.");
    }
  };

  const handleUpdateJobStatus = async (jobId, newStatus) => {
    try {
      await recruiterAPI.updateJobStatus(jobId, { status: newStatus }); // Actual API call
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.jobId === jobId ? { ...job, status: newStatus } : job
        )
      );
    } catch (err) {
      console.error(`Error updating job status to ${newStatus}:`, err);
      alert(`Failed to update job status. Please try again.`);
    }
  };

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = [...jobs];
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((job) => job.status === filterStatus);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (sortConfig.key === "postedDate" || sortConfig.key === "deadline") {
        valA = new Date(valA);
        valB = new Date(valB);
      } else if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (valA > valB) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    return filtered;
  }, [jobs, filterStatus, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <FontAwesomeIcon icon="sort" className="ml-1 text-gray-400" />;
    if (sortConfig.direction === "asc")
      return <FontAwesomeIcon icon="sort-up" className="ml-1" />;
    return <FontAwesomeIcon icon="sort-down" className="ml-1" />;
  };

  const getStatusPillClass = (status) => {
    switch (status) {
      case "ACTIVE":
      case "OPEN":
        return "bg-green-100 text-green-700";
      case "PAUSED":
        return "bg-yellow-100 text-yellow-700";
      case "DRAFT":
        return "bg-gray-100 text-gray-700";
      case "EXPIRED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading job postings..." />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="job-management-page p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Job Management</h1>
          <p className="text-gray-600">
            Manage all your company's job postings.
          </p>
        </div>
        {/* Nút "Post New Job" đã được thêm vào đây */}
        <Link
          to="/admin/jobs/create" // Đảm bảo đây là đường dẫn đúng đến trang tạo job
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
        >
          <FontAwesomeIcon icon="plus" />
          Post New Job
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
        <div className="relative flex-grow md:max-w-xs">
          <FontAwesomeIcon
            icon="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by title or location..."
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
            <option value="ACTIVE">Active</option>
            <option value="OPEN">Open</option>
            <option value="PAUSED">Paused</option>
            <option value="DRAFT">Draft</option>
            <option value="EXPIRED">Expired</option>
          </select>
          {/* Add more filters like department if needed */}
        </div>
      </div>

      {filteredAndSortedJobs.length === 0 ? (
        <EmptyState
          icon="folder-open"
          title="No Job Postings Found"
          description={
            searchTerm || filterStatus !== "ALL"
              ? "No jobs match your current filters."
              : "You haven't posted any jobs yet."
          }
          action={
            !searchTerm &&
            filterStatus === "ALL" && (
              <Link
                to="/admin/jobs/create"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Job Post
              </Link>
            )
          }
        />
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => requestSort("title")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Title {getSortIcon("title")}
                </th>
                <th
                  onClick={() => requestSort("status")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Status {getSortIcon("status")}
                </th>
                <th
                  onClick={() => requestSort("applicationsCount")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Apps {getSortIcon("applicationsCount")}
                </th>
                <th
                  onClick={() => requestSort("postedDate")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Posted {getSortIcon("postedDate")}
                </th>
                <th
                  onClick={() => requestSort("deadline")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Deadline {getSortIcon("deadline")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedJobs.map((job) => (
                <tr
                  key={job.jobId}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/admin/jobs/${job.jobId}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {job.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {job.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusPillClass(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.applicationQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(job.createdAt)} {/* Posted Date */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(job.deadline)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from firing
                        navigate(`/admin/jobs/${job.jobId}/edit`);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Edit Job"
                    >
                      <FontAwesomeIcon icon="edit" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from firing
                        handleDeleteJob(job.jobId);
                      }}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Job"
                    >
                      <FontAwesomeIcon icon="trash" />
                    </button>
                    {/* Add other actions like View Applicants */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/jobs/${job.jobId}/applicants`);
                      }}
                      className="text-purple-600 hover:text-purple-900 ml-3"
                      title="View Applicants"
                    >
                      <FontAwesomeIcon icon="users" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
