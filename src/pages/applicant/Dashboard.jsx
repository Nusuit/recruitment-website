// src/pages/applicant/Dashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { JobsContext } from "../../contexts/JobsContext"; // To get applications and saved jobs
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate, formatApplicationStatus } from "../../utils/formatters";

const ApplicantDashboard = () => {
  const { user } = useContext(AuthContext);
  const {
    getUserApplications,
    getSavedJobs,
    loading: jobsContextLoading,
    error: jobsContextError,
  } = useContext(JobsContext);

  const [stats, setStats] = useState({
    applied: 0,
    inReview: 0,
    interviews: 0,
    saved: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (jobsContextLoading) return; // Wait for JobsContext to load

      setLoading(true);
      setError(jobsContextError); // Propagate error from context

      try {
        const applications = getUserApplications(); // This might be from localStorage initially
        const savedJobs = getSavedJobs();

        // Calculate stats
        let inReviewCount = 0;
        let interviewsCount = 0;
        const upcomingInterviewsList = [];

        applications.forEach((app) => {
          const status = formatApplicationStatus(app.status).toLowerCase();
          if (status === "in review" || status === "pending review") {
            inReviewCount++;
          }
          if (status === "interview scheduled" || status === "interview") {
            interviewsCount++;
            // Assuming app.interviewDetails.datetime exists for interviews
            if (
              app.interviewDetails &&
              new Date(app.interviewDetails.datetime) >= new Date()
            ) {
              upcomingInterviewsList.push({
                ...app,
                interviewDate: app.interviewDetails.datetime,
                interviewType: app.interviewDetails.type,
              });
            }
          }
        });

        setStats({
          applied: applications.length,
          inReview: inReviewCount,
          interviews: interviewsCount,
          saved: savedJobs.length,
        });

        setRecentApplications(
          applications
            .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
            .slice(0, 3)
        );
        setUpcomingInterviews(
          upcomingInterviewsList
            .sort(
              (a, b) => new Date(a.interviewDate) - new Date(b.interviewDate)
            )
            .slice(0, 3)
        );
      } catch (err) {
        console.error("Error processing dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getUserApplications, getSavedJobs, jobsContextLoading, jobsContextError]);

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
      case "interview":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="applicant-dashboard p-4 md:p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.firstName || user?.name || "Applicant"}!
        </h1>
        <p className="text-gray-600">
          Here's a summary of your job seeking activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Applications Sent",
            value: stats.applied,
            icon: "file-alt",
            color: "blue",
          },
          {
            title: "Currently In Review",
            value: stats.inReview,
            icon: "hourglass-half",
            color: "yellow",
          },
          {
            title: "Interviews Scheduled",
            value: stats.interviews,
            icon: "calendar-check",
            color: "purple",
          },
          {
            title: "Saved Jobs",
            value: stats.saved,
            icon: "bookmark",
            color: "indigo",
          },
        ].map((stat) => (
          <div
            key={stat.title}
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

      {/* Recent Applications & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Applications
            </h2>
            <Link
              to="/applicant/applications"
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
                      <Link
                        to={`/jobs/${app.jobId}`}
                        className="font-semibold text-gray-800 hover:text-blue-600"
                      >
                        {app.jobTitle}
                      </Link>
                      <p className="text-xs text-gray-500">{app.company}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusPillClass(
                        app.status
                      )}`}
                    >
                      {formatApplicationStatus(app.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Applied: {formatDate(app.appliedDate)}
                  </p>
                  <Link
                    to={`/applicant/applications/${app.id}`}
                    className="text-xs text-blue-600 hover:underline font-medium mt-1 inline-block"
                  >
                    View Details
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon="file-alt"
              title="No Recent Applications"
              description="Your recent job applications will appear here."
            />
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Upcoming Interviews
            </h2>
            {/* Link to a dedicated interviews page if you have one */}
          </div>
          {upcomingInterviews.length > 0 ? (
            <ul className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <li
                  key={interview.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <Link
                    to={`/applicant/applications/${interview.id}/interview`}
                    className="font-semibold text-gray-800 hover:text-blue-600"
                  >
                    {interview.jobTitle}
                  </Link>
                  <p className="text-xs text-gray-500">
                    With: {interview.company}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <FontAwesomeIcon
                      icon="calendar-alt"
                      className="mr-2 text-purple-500"
                    />
                    {formatDate(interview.interviewDate, { includeTime: true })}{" "}
                    ({interview.interviewType})
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon="calendar-check"
              title="No Upcoming Interviews"
              description="Your scheduled interviews will appear here."
            />
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/applicant/jobs"
            className="bg-blue-500 text-white p-6 rounded-lg hover:bg-blue-600 transition-colors shadow-md flex flex-col items-center justify-center text-center"
          >
            <FontAwesomeIcon icon="search" size="2x" className="mb-2" />
            <span className="font-medium">Find New Jobs</span>
          </Link>
          <Link
            to="/applicant/profile"
            className="bg-green-500 text-white p-6 rounded-lg hover:bg-green-600 transition-colors shadow-md flex flex-col items-center justify-center text-center"
          >
            <FontAwesomeIcon icon="user-edit" size="2x" className="mb-2" />
            <span className="font-medium">Update Your Profile</span>
          </Link>
          <Link
            to="/applicant/saved-jobs"
            className="bg-indigo-500 text-white p-6 rounded-lg hover:bg-indigo-600 transition-colors shadow-md flex flex-col items-center justify-center text-center"
          >
            <FontAwesomeIcon icon="bookmark" size="2x" className="mb-2" />
            <span className="font-medium">View Saved Jobs</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
