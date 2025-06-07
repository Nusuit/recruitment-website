// src/pages/admin/ReportsPage.jsx
import React, { useState, useEffect } from "react";
import { recruiterAPI } from '../../api/recruiter'; // Assuming API for reports
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Bar, Line, Pie } from "react-chartjs-2";
// Ensure Chart.js elements are registered (typically in App.js or a ChartConfig.js)
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
// ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const ReportsPage = () => {
  const [reportData, setReportData] = useState(null);
  const [timeRange, setTimeRange] = useState("last30days"); // e.g., last7days, last30days, last90days, custom
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await recruiterAPI.getRecruitmentReports({ timeRange });
        setReportData(response.payload);
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError("Failed to load report data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, [timeRange]);

  const handleExportReport = () => {
    // TODO: Implement report export functionality (e.g., CSV, PDF)
    alert("Export functionality to be implemented.");
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading reports..." />;
  }
  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md text-center">
        {error}
      </div>
    );
  }
  if (!reportData) {
    return (
      <div className="p-4 text-gray-600 text-center">
        No report data available for the selected period.
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Chart Title" }, // Placeholder, set per chart
    },
  };

  return (
    <div className="reports-page p-4 md:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">
          Recruitment Reports & Analytics
        </h1>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
            <option value="alltime">All Time</option>
          </select>
          <button
            onClick={handleExportReport}
            className="px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
          >
            <FontAwesomeIcon icon="file-export" /> Export Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Total Applications"
          value={reportData.summaryStats.totalApplications}
          icon="file-alt"
        />
        <StatCard
          title="Total Hires"
          value={reportData.summaryStats.totalHires}
          icon="user-check"
        />
        <StatCard
          title="Avg. Time to Hire"
          value={`${reportData.summaryStats.avgTimeToHire} days`}
          icon="clock"
        />
        <StatCard
          title="Offer Acceptance Rate"
          value={`${reportData.summaryStats.offerAcceptanceRate}%`}
          icon="thumbs-up"
        />
        <StatCard
          title="Cost Per Hire"
          value={`$${reportData.summaryStats.costPerHire}`}
          icon="dollar-sign"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Applications Over Time">
          <Line
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { display: true, text: "Applications Trend" },
              },
            }}
            data={reportData.applicationsOverTime}
          />
        </ChartCard>
        <ChartCard title="Hires by Source">
          <Pie
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { display: true, text: "Candidate Sources" },
              },
            }}
            data={reportData.hiresBySource}
          />
        </ChartCard>
        <ChartCard title="Time to Fill by Department" className="lg:col-span-2">
          <Bar
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Average Days to Fill Role by Department",
                },
              },
            }}
            data={reportData.timeToFillByDepartment}
          />
        </ChartCard>
      </div>

      {/* TODO: Add more detailed tables or data sections as needed */}
      {/* Example: Top Performing Recruiters, Bottlenecks in Pipeline, etc. */}
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className="text-3xl text-blue-500 opacity-70"
        />
      )}
    </div>
  </div>
);

const ChartCard = ({ title, children, className = "" }) => (
  <div
    className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 ${className}`}
  >
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="h-80 md:h-96">
      {" "}
      {/* Fixed height for chart containers */}
      {children}
    </div>
  </div>
);

export default ReportsPage;
