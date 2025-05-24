// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { recruiterAPI } from "../../api/recruiter"; // Assuming this API exists and has dashboard functions
import { AuthContext } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from "../../utils/formatters"; // Assuming this utility exists

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplicationsToday: 0,
    interviewsScheduled: 0,
    candidatesHiredThisMonth: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real application, these would be separate API calls
        // const statsData = await recruiterAPI.getDashboardStats();
        // const jobsData = await recruiterAPI.getRecentJobs({ limit: 5 });
        // const appsData = await recruiterAPI.getRecentApplications({ limit: 5 });

        // Mocking data for now
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

        setStats({
          totalJobs: 58,
          activeJobs: 32,
          totalApplications: 450,
          newApplicationsToday: 12,
          interviewsScheduled: 25,
          candidatesHiredThisMonth: 5,
        });

        setRecentJobs([
          {
            id: "job1",
            title: "Senior Fashion Designer",
            applicationsCount: 35,
            status: "ACTIVE",
            postedDate: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            id: "job2",
            title: "Retail Store Manager",
            applicationsCount: 22,
            status: "ACTIVE",
            postedDate: new Date(
              Date.now() - 5 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            id: "job3",
            title: "Digital Marketing Lead",
            applicationsCount: 58,
            status: "PAUSED",
            postedDate: new Date(
              Date.now() - 10 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        ]);

        setRecentApplications([
          {
            id: "app1",
            applicantName: "Alice Wonderland",
            jobTitle: "Senior Fashion Designer",
            appliedDate: new Date().toISOString(),
            status: "PENDING_REVIEW",
          },
          {
            id: "app2",
            applicantName: "Bob The Builder",
            jobTitle: "Retail Store Manager",
            appliedDate: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "SHORTLISTED",
          },
          {
            id: "app3",
            applicantName: "Charlie Brown",
            jobTitle: "Digital Marketing Lead",
            appliedDate: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "INTERVIEW_SCHEDULED",
          },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "paused":
        return "bg-yellow-100 text-yellow-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "pending_review":
        return "bg-blue-100 text-blue-700";
      case "shortlisted":
        return "bg-indigo-100 text-indigo-700";
      case "interview_scheduled":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="admin-dashboard p-4 md:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.firstName || user?.name || "Admin"}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your recruitment activities.
          </p>
        </div>
        <Link
          to="/admin/jobs/create"
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
        >
          <FontAwesomeIcon icon="plus" />
          Post New Job
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Total Jobs Posted",
            value: stats.totalJobs,
            icon: "briefcase",
            color: "blue",
          },
          {
            title: "Active Job Openings",
            value: stats.activeJobs,
            icon: "check-circle",
            color: "green",
          },
          {
            title: "Total Applications Received",
            value: stats.totalApplications,
            icon: "file-invoice",
            color: "indigo",
          },
          {
            title: "New Applications Today",
            value: stats.newApplicationsToday,
            icon: "bell",
            color: "yellow",
          },
          {
            title: "Interviews Scheduled",
            value: stats.interviewsScheduled,
            icon: "calendar-alt",
            color: "purple",
          },
          {
            title: "Hired This Month",
            value: stats.candidatesHiredThisMonth,
            icon: "user-check",
            color: "teal",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-${stat.color}-500`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div
                className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}
              >
                <FontAwesomeIcon icon={stat.icon} size="lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Jobs and Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Job Postings */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Job Postings
            </h2>
            <Link
              to="/admin/jobs"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              View All
            </Link>
          </div>
          {recentJobs.length > 0 ? (
            <ul className="space-y-4">
              {recentJobs.map((job) => (
                <li
                  key={job.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        to={`/admin/jobs/${job.id}`}
                        className="font-semibold text-gray-800 hover:text-blue-600"
                      >
                        {job.title}
                      </Link>
                      <p className="text-xs text-gray-500">
                        Posted: {formatDate(job.postedDate)}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusClass(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {job.applicationsCount} Applications
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No recent job postings.
            </p>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Applications
            </h2>
            <Link
              to="/admin/applicants"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              View All
            </Link>
          </div>
          {recentApplications.length > 0 ? (
            <ul className="space-y-4">
              {recentApplications.map((app) => (
                <li
                  key={app.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {app.applicantName}
                      </p>
                      <Link
                        to={`/admin/jobs/${app.jobId}`}
                        className="text-xs text-blue-500 hover:underline"
                      >
                        Applied for: {app.jobTitle}
                      </Link>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusClass(
                        app.status
                      )}`}
                    >
                      {app.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Applied: {formatDate(app.appliedDate)}
                  </p>
                  <Link
                    to={`/admin/applications/${app.id}`}
                    className="text-xs text-blue-600 hover:underline font-medium mt-1 inline-block"
                  >
                    View Details
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No recent applications.
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/jobs/create"
            className="bg-blue-500 text-white p-6 rounded-lg hover:bg-blue-600 transition-colors shadow-md flex flex-col items-center justify-center text-center"
          >
            <FontAwesomeIcon icon="plus-circle" size="2x" className="mb-2" />
            <span className="font-medium">Post a New Job</span>
          </Link>
          <Link
            to="/admin/applicants"
            className="bg-green-500 text-white p-6 rounded-lg hover:bg-green-600 transition-colors shadow-md flex flex-col items-center justify-center text-center"
          >
            <FontAwesomeIcon icon="users" size="2x" className="mb-2" />
            <span className="font-medium">Manage Applicants</span>
          </Link>
          <Link
            to="/admin/reports"
            className="bg-purple-500 text-white p-6 rounded-lg hover:bg-purple-600 transition-colors shadow-md flex flex-col items-center justify-center text-center"
          >
            <FontAwesomeIcon icon="chart-pie" size="2x" className="mb-2" />
            <span className="font-medium">View Reports</span>
          </Link>
          <Link
            to="/admin/settings"
            className="bg-gray-700 text-white p-6 rounded-lg hover:bg-gray-800 transition-colors shadow-md flex flex-col items-center justify-center text-center"
          >
            <FontAwesomeIcon icon="cog" size="2x" className="mb-2" />
            <span className="font-medium">System Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
