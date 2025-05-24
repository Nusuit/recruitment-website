// src/pages/applicant/ApplicationsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { JobsContext } from "../../contexts/JobsContext"; // Assuming this context provides applications
import { AuthContext } from "../../contexts/AuthContext";
import { candidateAPI } from "../../api/candidate"; // For withdrawing application
import { formatDate, formatApplicationStatus } from "../../utils/formatters"; // Assuming formatters are updated
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ApplicationsPage = () => {
  const {
    getUserApplications,
    loading: jobsContextLoading,
    error: jobsContextError,
  } = useContext(JobsContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: { pathname: "/applicant/applications" } },
      });
      return;
    }

    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real app, this would fetch from an API via JobsContext or directly
        // For now, we use what JobsContext provides (which might be localStorage based)
        const userApps = getUserApplications(); // This should ideally be an async call
        setApplications(userApps || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to fetch your applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (!jobsContextLoading) {
      // Wait for JobsContext to load its initial data
      fetchApplications();
    }
  }, [isAuthenticated, navigate, getUserApplications, jobsContextLoading]);

  const handleWithdraw = async (applicationId) => {
    if (
      !window.confirm("Are you sure you want to withdraw this application?")
    ) {
      return;
    }
    try {
      // TODO: Implement API call for withdrawing
      // await candidateAPI.withdrawApplication(applicationId);
      setApplications((prevApps) =>
        prevApps.filter((app) => app.id !== applicationId)
      );
      // Update localStorage or context state if necessary
      const updatedApps = applications.filter(
        (app) => app.id !== applicationId
      );
      localStorage.setItem("applications", JSON.stringify(updatedApps)); // Example if still using localStorage
      alert("Application withdrawn successfully.");
    } catch (err) {
      console.error("Error withdrawing application:", err);
      alert("Failed to withdraw application. Please try again.");
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    // Normalize status for comparison, e.g., "Pending Review" vs "pending"
    return (
      formatApplicationStatus(app.status).toLowerCase().replace(/\s+/g, "") ===
      filter.toLowerCase().replace(/\s+/g, "")
    );
  });

  const getStatusClass = (status) => {
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
      case "notselected":
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterButtons = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pendingreview" },
    { label: "In Review", value: "inreview" },
    { label: "Shortlisted", value: "shortlisted" },
    { label: "Interview", value: "interviewscheduled" },
    { label: "Offered", value: "offerextended" },
    { label: "Hired", value: "hired" },
    { label: "Rejected", value: "rejected" }, // or 'notselected'
  ];

  if (loading || jobsContextLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (error || jobsContextError) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md">
        {error || jobsContextError}
      </div>
    );
  }

  return (
    <div className="applications-page p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-1">
          Track the status of your job applications.
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon="file-invoice" // FontAwesome icon name
          title="No Applications Yet"
          description="You haven't applied to any jobs. Start your journey by exploring our job listings."
          action={
            <Link
              to="/applicant/jobs"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FontAwesomeIcon icon="briefcase" className="mr-2" />
              Browse Jobs
            </Link>
          }
        />
      ) : (
        <>
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 border-b border-gray-200 pb-2">
              {filterButtons.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap ${
                    filter === btn.value
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <EmptyState
              icon="filter"
              title="No Applications Match Filters"
              description="Try adjusting your filters to find what you're looking for."
              action={
                <button
                  onClick={() => setFilter("all")}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Show All Applications
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-3">
                      <Link
                        to={`/jobs/${app.jobId}`}
                        className="text-xl font-semibold text-blue-600 hover:underline"
                      >
                        {app.jobTitle}
                      </Link>
                      <p className="text-sm text-gray-500">{app.company}</p>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <p>
                        <FontAwesomeIcon
                          icon="map-marker-alt"
                          className="mr-2 text-gray-400"
                        />
                        {app.location}
                      </p>
                      <p>
                        <FontAwesomeIcon
                          icon="briefcase"
                          className="mr-2 text-gray-400"
                        />
                        {app.jobType}
                      </p>
                      <p>
                        <FontAwesomeIcon
                          icon="calendar-alt"
                          className="mr-2 text-gray-400"
                        />
                        Applied: {formatDate(app.appliedDate)}
                      </p>
                    </div>
                    <div className="mb-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                          app.status
                        )}`}
                      >
                        {formatApplicationStatus(app.status)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto flex flex-col sm:flex-row gap-2">
                    <Link
                      to={`/applicant/applications/${app.id}`}
                      className="flex-1 text-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      View Details
                    </Link>
                    {(formatApplicationStatus(app.status).toLowerCase() ===
                      "pending review" ||
                      formatApplicationStatus(app.status).toLowerCase() ===
                        "in review") && (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        className="flex-1 text-center px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                      >
                        Withdraw
                      </button>
                    )}
                    {formatApplicationStatus(app.status)
                      .toLowerCase()
                      .replace(/\s+/g, "") === "interviewscheduled" &&
                      app.interviewDetails && (
                        <Link
                          to={`/applicant/applications/${app.id}/interview`}
                          className="flex-1 text-center px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 transition-colors"
                        >
                          Interview Details
                        </Link>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationsPage;
