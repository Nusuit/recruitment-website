import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AnalyticsOverview = () => {
  const analyticsCards = [
    {
      title: "Job Analytics",
      description: "Track job posting performance, department trends, and hiring metrics.",
      icon: "briefcase",
      color: "blue",
      link: "/admin/analytics/jobs",
      metrics: [
        { label: "Active Jobs", value: "32" },
        { label: "Avg Time to Fill", value: "28 days" },
        { label: "Success Rate", value: "65%" },
      ],
    },
    {
      title: "Applicant Analytics",
      description: "Monitor applicant trends, sources, and qualification rates.",
      icon: "users",
      color: "green",
      link: "/admin/analytics/applicants",
      metrics: [
        { label: "Total Applicants", value: "1,250" },
        { label: "Application Rate", value: "12%" },
        { label: "Qualified Rate", value: "45%" },
      ],
    },
    {
      title: "Recruitment Process",
      description: "Analyze recruitment funnel, interview success, and process efficiency.",
      icon: "chart-line",
      color: "purple",
      link: "/admin/analytics/recruitment",
      metrics: [
        { label: "Time to Hire", value: "28 days" },
        { label: "Interview Success", value: "60%" },
        { label: "Offer Acceptance", value: "85%" },
      ],
    },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700",
        text: "text-blue-700",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "text-green-600",
        button: "bg-green-600 hover:bg-green-700",
        text: "text-green-700",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        icon: "text-purple-600",
        button: "bg-purple-600 hover:bg-purple-700",
        text: "text-purple-700",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="analytics-overview-page p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive insights into your recruitment performance and metrics.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Total Jobs</p>
            <FontAwesomeIcon icon="briefcase" className="text-2xl text-blue-400 opacity-80" />
          </div>
          <p className="text-3xl font-bold text-gray-800">32</p>
          <p className="text-xs font-medium mt-1 flex items-center text-green-600">
            <FontAwesomeIcon icon="arrow-up" className="mr-1" />
            +5% from last month
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Active Applicants</p>
            <FontAwesomeIcon icon="users" className="text-2xl text-green-400 opacity-80" />
          </div>
          <p className="text-3xl font-bold text-gray-800">1,250</p>
          <p className="text-xs font-medium mt-1 flex items-center text-green-600">
            <FontAwesomeIcon icon="arrow-up" className="mr-1" />
            +15% from last month
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Avg. Time to Hire</p>
            <FontAwesomeIcon icon="clock" className="text-2xl text-purple-400 opacity-80" />
          </div>
          <p className="text-3xl font-bold text-gray-800">28</p>
          <p className="text-xs font-medium mt-1 flex items-center text-green-600">
            <FontAwesomeIcon icon="arrow-down" className="mr-1" />
            -5% faster than last month
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Success Rate</p>
            <FontAwesomeIcon icon="check-circle" className="text-2xl text-indigo-400 opacity-80" />
          </div>
          <p className="text-3xl font-bold text-gray-800">65%</p>
          <p className="text-xs font-medium mt-1 flex items-center text-green-600">
            <FontAwesomeIcon icon="arrow-up" className="mr-1" />
            +3% from last month
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {analyticsCards.map((card, index) => {
          const colors = getColorClasses(card.color);
          return (
            <div
              key={index}
              className={`${colors.bg} ${colors.border} border rounded-xl shadow-lg overflow-hidden`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <FontAwesomeIcon
                    icon={card.icon}
                    className={`text-3xl ${colors.icon}`}
                  />
                  <span className={`px-3 py-1 ${colors.text} bg-white rounded-full text-xs font-medium`}>
                    Analytics
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {card.description}
                </p>

                {/* Quick Metrics */}
                <div className="space-y-2 mb-6">
                  {card.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{metric.label}:</span>
                      <span className="font-semibold text-gray-800">{metric.value}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={card.link}
                  className={`w-full ${colors.button} text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center`}
                >
                  <FontAwesomeIcon icon="chart-bar" className="mr-2" />
                  View Detailed Analytics
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Insights */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Recent Insights & Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon="lightbulb" className="text-blue-500 text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  AI Team Leading in Applications
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  AI Team positions are attracting 40% more applications than other departments.
                </p>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  High Impact
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon="trend-up" className="text-green-500 text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Improved Interview Success Rate
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Technical assessments showing 70% pass rate, up from last quarter.
                </p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Positive Trend
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon="users" className="text-purple-500 text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  LinkedIn Driving Quality Candidates
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  LinkedIn referrals have a 15% higher hire rate than other sources.
                </p>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  Actionable
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon="clock" className="text-orange-500 text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Optimization Opportunity
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  First interview stage showing bottleneck. Consider additional training.
                </p>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  Needs Attention
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview; 