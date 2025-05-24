// src/pages/admin/analytics/ApplicantAnalytics.jsx
import React, { useState, useEffect } from "react";
// import { recruiterAPI } from '../../../api/recruiter';
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Bar, Line, Doughnut } from "react-chartjs-2";
// Ensure Chart.js elements are registered (globally or locally)

const chartOptionsBase = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top", labels: { font: { size: 10 } } },
    title: { display: true, font: { size: 14, weight: "bold" } },
    tooltip: { bodyFont: { size: 10 }, titleFont: { size: 12 } },
  },
  scales: {
    x: { ticks: { font: { size: 10 } }, grid: { display: false } },
    y: { ticks: { font: { size: 10 } }, beginAtZero: true },
  },
};

const ApplicantAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [timeframe, setTimeframe] = useState("last30days");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API call
        // const response = await recruiterAPI.getApplicantAnalyticsData({ timeframe });
        // setAnalytics(response.data);

        await new Promise((resolve) => setTimeout(resolve, 800));
        setAnalytics({
          totalApplicants: 1250,
          applicantChange: 15, // percentage
          applicationRate: 12, // percentage of site visitors who apply
          rateChange: 2,
          avgApplicationsPerJob: 21,
          avgChange: -1,
          qualifiedRate: 45, // percentage of applicants deemed qualified
          qualifiedChange: 5,
          applicationTrend: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            data: [150, 200, 180, 220, 250, 210],
          },
          applicationSources: [
            { name: "LinkedIn", count: 400 },
            { name: "Company Website", count: 350 },
            { name: "Referrals", count: 200 },
            { name: "Job Boards", count: 250 },
            { name: "Other", count: 50 },
          ],
          applicationStatusDistribution: [
            // Renamed from applicationStatus
            { status: "Pending Review", count: 300 },
            { status: "In Review", count: 250 },
            { status: "Shortlisted", count: 150 },
            { status: "Interviewing", count: 100 },
            { status: "Offered", count: 80 },
            { status: "Hired", count: 75 },
            { status: "Rejected", count: 295 },
          ],
          popularJobs: [
            { title: "Senior Fashion Designer", applications: 75 },
            { title: "Marketing Manager", applications: 60 },
            { title: "Retail Store Supervisor", applications: 55 },
          ],
          topSkills: [
            { name: "Adobe Creative Suite", demand: 60 },
            { name: "Digital Marketing", demand: 55 },
            { name: "Sales Strategy", demand: 50 },
          ],
          bestSources: [
            // Source effectiveness
            { name: "Referrals", hireRate: 25 }, // 25% of referred applicants hired
            { name: "LinkedIn", hireRate: 15 },
            { name: "Company Website", hireRate: 10 },
          ],
          timeToProgress: [
            // Avg days per stage
            { stage: "Application to Screen", days: 3 },
            { stage: "Screen to Interview", days: 7 },
            { stage: "Interview to Offer", days: 10 },
            { stage: "Offer to Hire", days: 5 },
          ],
        });
      } catch (err) {
        console.error("Error fetching applicant analytics:", err);
        setError("Failed to load applicant analytics data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeframe]);

  if (loading)
    return <LoadingSpinner fullPage message="Loading applicant analytics..." />;
  if (error)
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md text-center">
        {error}
      </div>
    );
  if (!analytics)
    return (
      <div className="p-4 text-gray-600 text-center">
        No applicant data available.
      </div>
    );

  const applicationTrendChartData = {
    labels: analytics.applicationTrend.labels,
    datasets: [
      {
        label: "Applications Received",
        data: analytics.applicationTrend.data,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
        fill: true,
      },
    ],
  };
  const sourceChartData = {
    labels: analytics.applicationSources.map((s) => s.name),
    datasets: [
      {
        data: analytics.applicationSources.map((s) => s.count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };
  const statusChartData = {
    labels: analytics.applicationStatusDistribution.map((s) => s.status),
    datasets: [
      {
        label: "Applications by Status",
        data: analytics.applicationStatusDistribution.map((s) => s.count),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };

  const getChangeClass = (change) =>
    change >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="applicant-analytics-page p-4 md:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Applicant Analytics
        </h1>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
        >
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="last90days">Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Applicants"
          value={analytics.totalApplicants}
          change={analytics.applicantChange}
          icon="users"
        />
        <MetricCard
          title="Application Rate"
          value={`${analytics.applicationRate}%`}
          change={analytics.rateChange}
          icon="chart-line"
        />
        <MetricCard
          title="Avg. Apps Per Job"
          value={analytics.avgApplicationsPerJob}
          change={analytics.avgChange}
          lowerIsBetter
          icon="file-invoice"
        />
        <MetricCard
          title="Qualified Rate"
          value={`${analytics.qualifiedRate}%`}
          change={analytics.qualifiedChange}
          icon="user-check"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Application Trends Over Time">
          <Line
            options={{
              ...chartOptionsBase,
              plugins: {
                ...chartOptionsBase.plugins,
                title: {
                  ...chartOptionsBase.plugins.title,
                  text: "Daily/Weekly Applications",
                },
              },
            }}
            data={applicationTrendChartData}
          />
        </ChartCard>
        <ChartCard title="Application Sources">
          <Doughnut
            options={{
              ...chartOptionsBase,
              plugins: {
                ...chartOptionsBase.plugins,
                title: {
                  ...chartOptionsBase.plugins.title,
                  text: "Where Applicants Come From",
                },
                legend: { position: "right" },
              },
            }}
            data={sourceChartData}
          />
        </ChartCard>
        <ChartCard
          title="Application Status Distribution"
          className="lg:col-span-2"
        >
          <Bar
            options={{
              ...chartOptionsBase,
              plugins: {
                ...chartOptionsBase.plugins,
                title: {
                  ...chartOptionsBase.plugins.title,
                  text: "Current Status of Applications",
                },
              },
            }}
            data={statusChartData}
          />
        </ChartCard>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Key Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InsightList
            title="Most Popular Jobs"
            items={analytics.popularJobs}
            valueKey="applications"
            unit="apps"
            icon="fire"
          />
          <InsightList
            title="Top Skills in Demand"
            items={analytics.topSkills}
            valueKey="demand"
            unit="% demand"
            icon="star"
          />
          <InsightList
            title="Best Performing Sources"
            items={analytics.bestSources}
            valueKey="hireRate"
            unit="% hire rate"
            icon="bullhorn"
          />
          <InsightList
            title="Average Time per Stage"
            items={analytics.timeToProgress.map((s) => ({
              name: s.stage,
              value: s.days,
            }))}
            valueKey="value"
            unit="days"
            icon="hourglass-half"
          />
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, lowerIsBetter = false, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className="text-2xl text-indigo-400 opacity-80"
        />
      )}
    </div>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    {typeof change === "number" && (
      <p
        className={`text-xs font-medium mt-1 flex items-center ${
          lowerIsBetter
            ? change <= 0
              ? "text-green-600"
              : "text-red-600"
            : change >= 0
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        <FontAwesomeIcon
          icon={
            lowerIsBetter
              ? change <= 0
                ? "arrow-down"
                : "arrow-up"
              : change >= 0
              ? "arrow-up"
              : "arrow-down"
          }
          className="mr-1"
        />
        {change >= 0 ? "+" : ""}
        {change}% from last period
      </p>
    )}
  </div>
);

const ChartCard = ({ title, children, className = "" }) => (
  <div
    className={`bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 ${className}`}
  >
    <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">
      {title}
    </h2>
    <div className="h-72 md:h-80">{children}</div>
  </div>
);

const InsightList = ({ title, items, valueKey, unit, icon }) => (
  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
    <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
      {icon && <FontAwesomeIcon icon={icon} className="mr-2 text-indigo-500" />}
      {title}
    </h3>
    {items && items.length > 0 ? (
      <ul className="space-y-1.5 text-sm">
        {items.slice(0, 5).map(
          (
            item,
            index // Show top 5
          ) => (
            <li
              key={index}
              className="flex justify-between items-center text-gray-600"
            >
              <span>{item.title || item.name}</span>
              <span className="font-medium text-gray-800">
                {item[valueKey]} {unit}
              </span>
            </li>
          )
        )}
      </ul>
    ) : (
      <p className="text-xs text-gray-500">No data available.</p>
    )}
  </div>
);

export default ApplicantAnalytics;
