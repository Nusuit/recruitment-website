// src/pages/admin/analytics/JobAnalytics.jsx
import React, { useState, useEffect, useRef } from "react";
import { recruiterAPI } from '../../../api/recruiter'; // API for fetching analytics data
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Bar, Line, Pie } from "react-chartjs-2";
import { defaultChartOptions } from "../../../config/chartConfig";
// Chart.js elements should be registered globally, e.g., in App.js or a chart config file
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
// ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const JobAnalytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [jobStats, setJobStats] = useState(null);
  const [timeframe, setTimeframe] = useState("last30days");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRefs = useRef({});

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const metricsResponse = await recruiterAPI.getRecruitmentMetrics(timeframe);
        const jobStatsResponse = await recruiterAPI.getJobAnalytics({ timeframe });
        setMetrics(metricsResponse.payload.metrics);
        setJobStats(jobStatsResponse.payload.stats);

        // Mock data for now
        // await new Promise((resolve) => setTimeout(resolve, 800));
        // setMetrics({
        //   activeJobs: 32,
        //   activeJobsChange: 5, // percentage change
        //   avgTimeToFill: 28,
        //   avgTimeToFillChange: -2, // percentage change (negative is good)
        //   successRate: 65,
        //   successRateChange: 3,
        //   costPerHire: 1150,
        //   costPerHireChange: 10,
        // });
        // setJobStats({
        //   jobTrend: {
        //     labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        //     data: [10, 15, 12, 18],
        //   },
        //   byDepartment: [
        //     { department: "Design", count: 12 },
        //     { department: "Marketing", count: 8 },
        //     { department: "Sales", count: 7 },
        //     { department: "Engineering", count: 5 },
        //   ],
        //   byType: [
        //     { type: "Full Time", count: 20 },
        //     { type: "Part Time", count: 5 },
        //     { type: "Contract", count: 4 },
        //     { type: "Internship", count: 3 },
        //   ],
        //   insights: {
        //     topDepartment: "Design",
        //     topDepartmentHires: 10, // Example
        //     mostCompetitiveRole: "Senior Fashion Designer",
        //     applicantsPerRole: 50,
        //     fastestHiringDepartment: "Marketing",
        //     avgHiringDays: 22,
        //     interviewToHireRatio: 3, // 3 interviews per hire
        //   },
        // });
      } catch (err) {
        console.error("Error fetching job analytics:", err);
        setError("Failed to load job analytics data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeframe]);

  // Cleanup charts on unmount
  useEffect(() => {
    return () => {
      Object.values(chartRefs.current).forEach(chart => {
        if (chart) {
          chart.destroy();
        }
      });
    };
  }, []);

  if (loading)
    return <LoadingSpinner fullPage message="Loading job analytics..." />;
  if (error)
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md text-center">
        {error}
      </div>
    );
  if (!metrics || !jobStats)
    return (
      <div className="p-4 text-gray-600 text-center">
        No analytics data available.
      </div>
    );

  const jobTrendChartData = {
    labels: jobStats.jobTrend.labels,
    datasets: [
      {
        label: "New Jobs Posted",
        data: jobStats.jobTrend.data,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const departmentChartData = {
    labels: jobStats.byDepartment.map((item) => item.department),
    datasets: [
      {
        label: "Jobs by Department",
        data: jobStats.byDepartment.map((item) => item.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
      },
    ],
  };

  const jobTypeChartData = {
    labels: jobStats.byType.map((item) => item.type),
    datasets: [
      {
        data: jobStats.byType.map((item) => item.count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const getChangeClass = (change) =>
    change >= 0 ? "text-green-600" : "text-red-600";
  const getChangeIcon = (change) => (change >= 0 ? "arrow-up" : "arrow-down");

  return (
    <div className="job-analytics-page p-4 md:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Job Posting Analytics
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

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Jobs"
          value={metrics.activeJobs}
          change={metrics.activeJobsChange}
          icon="briefcase"
        />
        <MetricCard
          title="Avg. Time to Fill"
          value={`${metrics.avgTimeToFill} days`}
          change={metrics.avgTimeToFillChange}
          lowerIsBetter
          icon="clock"
        />
        <MetricCard
          title="Job Success Rate"
          value={`${metrics.successRate}%`}
          change={metrics.successRateChange}
          icon="check-circle"
        />
        <MetricCard
          title="Est. Cost Per Hire"
          value={`$${metrics.costPerHire}`}
          change={metrics.costPerHireChange}
          lowerIsBetter
          icon="dollar-sign"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Job Posting Trends">
          <Line
            ref={(ref) => (chartRefs.current.jobTrend = ref?.chartInstance)}
            options={{
              ...defaultChartOptions,
              plugins: {
                ...defaultChartOptions.plugins,
                title: {
                  ...defaultChartOptions.plugins.title,
                  text: "Jobs Posted Over Time",
                },
              },
            }}
            data={jobTrendChartData}
          />
        </ChartCard>
        <ChartCard title="Job Types Distribution">
          <Pie
            ref={(ref) => (chartRefs.current.jobType = ref?.chartInstance)}
            options={{
              ...defaultChartOptions,
              plugins: {
                ...defaultChartOptions.plugins,
                title: {
                  ...defaultChartOptions.plugins.title,
                  text: "Jobs by Employment Type",
                },
                legend: { position: "right" },
              },
            }}
            data={jobTypeChartData}
          />
        </ChartCard>
        <ChartCard title="Jobs by Department" className="lg:col-span-2">
          <Bar
            ref={(ref) => (chartRefs.current.department = ref?.chartInstance)}
            options={{
              ...defaultChartOptions,
              plugins: {
                ...defaultChartOptions.plugins,
                title: {
                  ...defaultChartOptions.plugins.title,
                  text: "Job Distribution by Department",
                },
              },
            }}
            data={departmentChartData}
          />
        </ChartCard>
      </div>

      {/* Key Insights Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Key Insights & Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InsightCard
            title="Top Performing Department"
            value={jobStats.insights.topDepartment}
            subValue={`${jobStats.insights.topDepartmentHires} hires`}
            icon="trophy"
          />
          <InsightCard
            title="Most Competitive Role"
            value={jobStats.insights.mostCompetitiveRole}
            subValue={`${jobStats.insights.applicantsPerRole} applicants/role`}
            icon="users"
          />
          <InsightCard
            title="Fastest Hiring Department"
            value={jobStats.insights.fastestHiringDepartment}
            subValue={`${jobStats.insights.avgHiringDays} days avg.`}
            icon="tachometer-alt"
          />
          <InsightCard
            title="Recruitment Efficiency"
            value={`1:${jobStats.insights.interviewToHireRatio}`}
            subValue="Interview to Hire Ratio"
            icon="bullseye"
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
          className="text-2xl text-blue-400 opacity-80"
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
    <div className="h-72 md:h-80">
      {" "}
      {/* Fixed height for chart containers */}
      {children}
    </div>
  </div>
);

const InsightCard = ({ title, value, subValue, icon }) => (
  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className="text-2xl text-indigo-500 mt-1"
        />
      )}
      <div>
        <h3 className="text-md font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-indigo-600 my-1">{value}</p>
        {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
      </div>
    </div>
  </div>
);

export default JobAnalytics;
