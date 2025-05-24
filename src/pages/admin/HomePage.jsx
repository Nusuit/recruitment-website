// src/pages/admin/HomePage.jsx
// This page might be very similar to AdminDashboard.jsx.
// If so, consider redirecting from /admin/home to /admin/dashboard or using AdminDashboard directly.
// For this refactor, I'll make it a simplified version that could act as a welcome/overview.

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card"; // Assuming Card component is updated

const AdminHomePage = () => {
  const { user } = useContext(AuthContext);

  const quickActions = [
    {
      label: "Manage Jobs",
      path: "/admin/jobs",
      icon: "briefcase",
      description: "View, edit, and create new job postings.",
    },
    {
      label: "View Applicants",
      path: "/admin/applicants",
      icon: "users",
      description: "Review and manage candidate applications.",
    },
    {
      label: "Company Profile",
      path: "/admin/company-profile",
      icon: "building",
      description: "Update your company's public information.",
    },
    {
      label: "System Settings",
      path: "/admin/settings",
      icon: "cog",
      description: "Configure recruitment portal settings.",
    },
  ];

  return (
    <div className="admin-home-page p-4 md:p-6 space-y-8">
      <Card>
        <div className="p-6 text-center md:text-left md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to MyaCorp Admin
            </h1>
            <p className="text-gray-600 mt-2">
              Hello,{" "}
              <span className="font-semibold">
                {user?.firstName || user?.name || "Admin"}
              </span>
              ! Manage your recruitment process efficiently.
            </p>
          </div>
          <img
            src="/assets/images/admin-welcome-banner.svg"
            alt="Admin Welcome"
            className="hidden md:block h-32 mt-4 md:mt-0"
          />{" "}
          {/* Placeholder image */}
        </div>
      </Card>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Card
              key={action.path}
              className="text-center hover:shadow-xl transition-shadow"
              hoverEffect={true}
            >
              <div className="p-6">
                <FontAwesomeIcon
                  icon={action.icon}
                  className="text-4xl text-blue-500 mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {action.label}
                </h3>
                <p className="text-xs text-gray-500 mb-4 h-10">
                  {action.description}
                </p>
                <Button
                  to={action.path}
                  variant="outline-primary"
                  size="sm"
                  fullWidth
                >
                  Go to {action.label}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Placeholder for a summary or key stats if different from dashboard */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Active Jobs">
            <p className="text-4xl font-bold text-blue-600">32</p>{" "}
            {/* Mock Data */}
            <p className="text-sm text-gray-500">Currently open positions</p>
          </Card>
          <Card title="New Applicants (Today)">
            <p className="text-4xl font-bold text-green-600">12</p>{" "}
            {/* Mock Data */}
            <p className="text-sm text-gray-500">Candidates applied today</p>
          </Card>
          <Card title="Pending Reviews">
            <p className="text-4xl font-bold text-yellow-600">45</p>{" "}
            {/* Mock Data */}
            <p className="text-sm text-gray-500">
              Applications awaiting review
            </p>
          </Card>
        </div>
        <div className="mt-6 text-center">
          <Button to="/admin/dashboard" variant="primary" size="lg">
            View Full Dashboard
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AdminHomePage;
