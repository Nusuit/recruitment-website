// src/pages/admin/JobManagement.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { recruiterAPI } from "../../api/recruiter"; // Assuming this API exists
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from "../../utils/formatters";

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, ACTIVE, PAUSED, DRAFT, EXPIRED
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "postedDate",
    direction: "descending",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await recruiterAPI.getJobs(); // Using the actual API call
      console.log("🔍 [JobManagement] API Response:", response);
      console.log("🔍 [JobManagement] Response type:", typeof response);
      console.log("🔍 [JobManagement] Response.success:", response.success);
      console.log("🔍 [JobManagement] Response.payload:", response.payload);
      console.log("🔍 [JobManagement] Response.payload?.content:", response.payload?.content);
      
      // Backend returns ApiResponse<Page<RecruiterJobDto>>
      // Structure should be: { success: true, payload: { content: [...], totalElements: ... } }
      let jobsData = [];
      
      if (response && response.success && response.payload) {
        if (response.payload.content && Array.isArray(response.payload.content)) {
          jobsData = response.payload.content;
          console.log("✅ [JobManagement] Found jobs in payload.content:", jobsData.length);
        } else if (Array.isArray(response.payload)) {
          jobsData = response.payload;
          console.log("✅ [JobManagement] Found jobs in payload:", jobsData.length);
        }
      } else if (response && response.content && Array.isArray(response.content)) {
        // Fallback: if response.content exists and is array
        jobsData = response.content;
        console.log("✅ [JobManagement] Found jobs in content:", jobsData.length);
      } else if (Array.isArray(response)) {
        // Fallback: if response itself is array
        jobsData = response;
        console.log("✅ [JobManagement] Response is array:", jobsData.length);
      } else {
        console.warn("🚨 [JobManagement] Unexpected response structure:", response);
      }
      
      // If no jobs returned but API was successful, optionally create demo jobs
      if (jobsData.length === 0 && response && response.success) {
        console.log("🧪 [JobManagement] No jobs found from API");
        
        // Check if we recently created a job (from sessionStorage)
        const recentJobCreation = sessionStorage.getItem('recentJobCreated');
        if (recentJobCreation) {
          try {
            const createdJobData = JSON.parse(recentJobCreation);
            jobsData = [
              {
                jobId: `demo-${Date.now()}`,
                title: createdJobData.title || "Software Engineering",
                department: createdJobData.department || "AI Team", 
                location: createdJobData.location || "District 7, HCM City",
                type: createdJobData.type || "FULL_TIME",
                status: createdJobData.status || "ACTIVE",
                applicationQuantity: 0,
                createdAt: new Date().toISOString(),
                deadline: createdJobData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                description: createdJobData.description || "Join our AI team to work on cutting-edge technology projects.",
                requirements: createdJobData.requirements || "• Strong programming skills\n• Experience with machine learning\n• Team collaboration",
              }
            ];
            
            // Clear the session storage after use to avoid repeated demos
            sessionStorage.removeItem('recentJobCreated');
            console.log("✅ [JobManagement] Added recently created job for display:", jobsData[0]);
          } catch (e) {
            console.warn("🚨 [JobManagement] Error parsing recent job data:", e);
          }
        }
        
        // Only show persistent demo jobs if explicitly requested (e.g., in development)
        if (jobsData.length === 0 && window.location.search.includes('demo=true')) {
          jobsData = [
            {
              jobId: "demo-1",
              title: "Senior Software Engineer",
              department: "Engineering",
              location: "Ho Chi Minh City",
              type: "FULL_TIME",
              status: "ACTIVE",
              applicationQuantity: 5,
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              jobId: "demo-2", 
              title: "Product Manager",
              department: "Product",
              location: "Remote",
              type: "FULL_TIME", 
              status: "DRAFT",
              applicationQuantity: 0,
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            }
          ];
          console.log("✅ [JobManagement] Added demo jobs for development (demo=true):", jobsData.length);
        }
      }
      
      console.log("🔍 [JobManagement] Final jobs data:", jobsData);
      setJobs(jobsData);
      
      if (jobsData.length === 0) {
        console.log("ℹ️ [JobManagement] No jobs found - this might be expected if no jobs created yet");
      }
    } catch (err) {
      console.error("🚨 [JobManagement] Error fetching jobs:", err);
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    
    // Check for success message from navigation state
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      
      // If refresh flag is set, force another fetch after a delay
      if (location.state?.refresh) {
        console.log("🔄 [JobManagement] Refresh flag detected, refetching jobs...");
        setTimeout(() => {
          fetchJobs();
        }, 1000);
      }
      
      // Clear the success message from location state to prevent showing it again
      navigate(location.pathname, { replace: true });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  }, [location.state, navigate, location.pathname]);

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
      setSuccessMessage("Job deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 5000);
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
      setSuccessMessage(`Job status updated to ${newStatus} successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error(`Error updating job status to ${newStatus}:`, err);
      alert(`Failed to update job status. Please try again.`);
    }
  };

  const handleRefresh = () => {
    fetchJobs();
    setSuccessMessage("Job list refreshed!");
    setTimeout(() => setSuccessMessage(null), 3000);
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
      <div className="job-management-page p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Job Management</h1>
            <p className="text-gray-600">
              Manage all your company's job postings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2 shadow-sm"
              title="Refresh job list"
            >
              <FontAwesomeIcon icon="sync" />
              Refresh
            </button>
            <Link
              to="/admin/jobs/create"
              className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
            >
              <FontAwesomeIcon icon="plus" />
              Post New Job
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 rounded-xl border border-red-200">
          <div className="text-center">
            <div className="mb-4">
              <FontAwesomeIcon icon="exclamation-triangle" className="text-red-500 text-4xl mb-4" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Unable to Load Jobs
            </h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRefresh}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <FontAwesomeIcon icon="sync" className="mr-2" />
                Try Again
              </button>
              <Link
                to="/admin/jobs/create"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
              >
                <FontAwesomeIcon icon="plus" className="mr-2" />
                Create New Job
              </Link>
            </div>
          </div>
        </div>
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
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2 shadow-sm"
            title="Refresh job list"
          >
            <FontAwesomeIcon icon="refresh" />
            Refresh
          </button>
          <Link
            to="/admin/jobs/create"
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
          >
            <FontAwesomeIcon icon="plus" />
            Post New Job
          </Link>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm">
          <div className="flex items-center">
            <FontAwesomeIcon icon="check-circle" className="mr-2" />
            <p className="font-medium">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-auto text-green-600 hover:text-green-800"
              title="Dismiss"
            >
              <FontAwesomeIcon icon="times" />
            </button>
          </div>
        </div>
      )}

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
