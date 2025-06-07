// src/pages/admin/analytics/RecruitmentAnalytics.jsx
import React, { useState, useEffect } from "react";
import { recruiterAPI } from '../../../api/recruiter';
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Bar, Line } from "react-chartjs-2";
// Ensure Chart.js elements are registered

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

const RecruitmentAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [interviewData, setInterviewData] = useState(null); // Assuming this comes from a different or combined endpoint
  const [timeframe, setTimeframe] = useState("last30days");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const [recruitmentResponse, interviewResponse] = await Promise.all([
            recruiterAPI.getOverallRecruitmentAnalytics({ timeframe }),
            recruiterAPI.getInterviewFunnelAnalytics({ timeframe }) // Example
        ]);
        setAnalytics(recruitmentResponse.payload);
        setInterviewData(interviewResponse.payload);

        // TODO: Replace with actual API calls
        // const [recruitmentResponse, interviewResponse] = await Promise.all([
        //     recruiterAPI.getOverallRecruitmentAnalytics({ timeframe }),
        //     recruiterAPI.getInterviewFunnelAnalytics({ timeframe }) // Example
        // ]);
        // setAnalytics(recruitmentResponse.data);
        // setInterviewData(interviewResponse.data);

        // await new Promise((resolve) => setTimeout(resolve, 800));
        // setAnalytics({
        //   timeToHire: 28,
        //   timeToHireChange: -5, // days, percentage
        //   interviewSuccessRate: 60,
        //   successRateChange: 2, // percentage
        //   offerAcceptanceRate: 85,
        //   acceptanceRateChange: 3,
        //   dropOffRate: 15,
        //   dropOffRateChange: -2, // percentage of candidates dropping off
        //   funnelMetrics: {
        //     applications: 500,
        //     screened: 300,
        //     interviewed: 150,
        //     offered: 90,
        //     hired: 75,
        //   },
        //   stageAnalysis: [
        //     {
        //       name: "Application Screening",
        //       avgTime: 3,
        //       passRate: 60,
        //       bottleneckScore: 4,
        //     },
        //     {
        //       name: "First Interview",
        //       avgTime: 7,
        //       passRate: 50,
        //       bottleneckScore: 6,
        //     },
        //     {
        //       name: "Technical Assessment",
        //       avgTime: 5,
        //       passRate: 70,
        //       bottleneckScore: 3,
        //     },
        //     {
        //       name: "Final Interview",
        //       avgTime: 7,
        //       passRate: 80,
        //       bottleneckScore: 2,
        //     },
        //     {
        //       name: "Offer Stage",
        //       avgTime: 4,
        //       passRate: 85,
        //       bottleneckScore: 1,
        //     },
        //   ],
        //   efficiencyInsights: [
        //     {
        //       title: "Screening Bottleneck",
        //       description: "High drop-off after initial screening.",
        //       recommendation:
        //         "Review screening criteria or provide more training to screeners.",
        //       impact: "High",
        //     },
        //     {
        //       title: "Offer Acceptance High",
        //       description:
        //         "Strong offer acceptance rate indicates competitive offers.",
        //       recommendation: "Maintain current offer strategy.",
        //       impact: "Low",
        //     },
        //   ],
        // });
        // setInterviewData({
        //   interviewTrend: {
        //     labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        //     scheduled: [20, 25, 22, 30],
        //     completed: [18, 22, 20, 28],
        //   },
        // });
      } catch (err) {
        console.error("Error fetching recruitment analytics:", err);
        setError("Failed to load recruitment analytics data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeframe]);

  if (loading)
    return (
      <LoadingSpinner fullPage message="Loading recruitment analytics..." />
    );
  if (error)
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md text-center">
        {error}
      </div>
    );
  if (!analytics || !interviewData)
    return (
      <div className="p-4 text-gray-600 text-center">
        No analytics data available.
      </div>
    );

  const funnelChartData = {
    labels: ["Applications", "Screened", "Interviewed", "Offered", "Hired"],
    datasets: [
      {
        label: "Recruitment Funnel",
        data: [
          analytics.funnelMetrics.applications,
          analytics.funnelMetrics.screened,
          analytics.funnelMetrics.interviewed,
          analytics.funnelMetrics.offered,
          analytics.funnelMetrics.hired,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 99, 132, 0.7)",
        ],
      },
    ],
  };

  const interviewTrendChartData = {
    labels: interviewData.interviewTrend.labels,
    datasets: [
      {
        label: "Scheduled Interviews",
        data: interviewData.interviewTrend.scheduled,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
        fill: true,
      },
      {
        label: "Completed Interviews",
        data: interviewData.interviewTrend.completed,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const getImpactClass = (impact) => {
    switch (impact?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="recruitment-analytics-page p-4 md:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Recruitment Process Analytics
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
          title="Avg. Time to Hire"
          value={`${analytics.timeToHire} days`}
          change={analytics.timeToHireChange}
          lowerIsBetter
          icon="clock"
        />
        <MetricCard
          title="Interview Success Rate"
          value={`${analytics.interviewSuccessRate}%`}
          change={analytics.successRateChange}
          icon="thumbs-up"
        />
        <MetricCard
          title="Offer Acceptance Rate"
          value={`${analytics.offerAcceptanceRate}%`}
          change={analytics.acceptanceRateChange}
          icon="handshake"
        />
        <MetricCard
          title="Overall Drop-off Rate"
          value={`${analytics.dropOffRate}%`}
          change={analytics.dropOffRateChange}
          lowerIsBetter
          icon="user-minus"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard
          title="Recruitment Funnel Overview"
          className="lg:col-span-2"
        >
          <Bar
            options={{
              ...chartOptionsBase,
              indexAxis: "y",
              plugins: {
                ...chartOptionsBase.plugins,
                legend: { display: false },
                title: {
                  ...chartOptionsBase.plugins.title,
                  text: "Candidate Progression Through Stages",
                },
              },
            }}
            data={funnelChartData}
          />
        </ChartCard>
        <ChartCard title="Interview Trends">
          <Line
            options={{
              ...chartOptionsBase,
              plugins: {
                ...chartOptionsBase.plugins,
                title: {
                  ...chartOptionsBase.plugins.title,
                  text: "Scheduled vs. Completed Interviews",
                },
              },
            }}
            data={interviewTrendChartData}
          />
        </ChartCard>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Stage-wise Analysis
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {analytics.stageAnalysis.map((stage, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <h3 className="text-md font-semibold text-gray-700 mb-2">
                {stage.name}
              </h3>
              <div className="space-y-1 text-sm">
                <p className="flex justify-between">
                  <span>Avg. Time:</span>{" "}
                  <span className="font-medium">{stage.avgTime} days</span>
                </p>
                <p className="flex justify-between">
                  <span>Pass Rate:</span>{" "}
                  <span className="font-medium">{stage.passRate}%</span>
                </p>
                <p className="flex justify-between">
                  <span>Bottleneck Score:</span>
                  <span
                    className={`font-medium ${
                      stage.bottleneckScore > 6
                        ? "text-red-600"
                        : stage.bottleneckScore > 3
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {stage.bottleneckScore}/10
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Efficiency Insights & Recommendations
        </h2>
        <div className="space-y-6">
          {analytics.efficiencyInsights.map((insight, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-semibold text-gray-700">
                  {insight.title}
                </h3>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getImpactClass(
                    insight.impact
                  )}`}
                >
                  {insight.impact} Impact
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {insight.description}
              </p>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs font-medium text-blue-600">
                  Recommendation:
                </p>
                <p className="text-xs text-gray-500">
                  {insight.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Re-usable MetricCard and ChartCard components (can be moved to common components)
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
    <div className="h-72 md:h-80">{children}</div>
  </div>
);

export default RecruitmentAnalytics;
