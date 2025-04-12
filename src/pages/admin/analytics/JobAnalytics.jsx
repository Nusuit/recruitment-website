import React, { useState, useEffect } from 'react';
import { recruiterAPI } from '../../../api/recruiter';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const JobAnalytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [jobStats, setJobStats] = useState(null);
  const [timeframe, setTimeframe] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [metricsResponse, jobStatsResponse] = await Promise.all([
        recruiterAPI.getRecruitmentMetrics(timeframe),
        recruiterAPI.getJobAnalytics({ timeframe })
      ]);

      setMetrics(metricsResponse.metrics);
      setJobStats(jobStatsResponse.stats);
      setError(null);
    } catch (err) {
      setError('Failed to fetch analytics data. Please try again.');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading analytics...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const jobTrendData = {
    labels: jobStats?.jobTrend.map(item => item.date) || [],
    datasets: [
      {
        label: 'New Jobs Posted',
        data: jobStats?.jobTrend.map(item => item.count) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ]
  };

  const departmentData = {
    labels: jobStats?.byDepartment.map(item => item.department) || [],
    datasets: [
      {
        label: 'Jobs by Department',
        data: jobStats?.byDepartment.map(item => item.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      }
    ]
  };

  const jobTypeData = {
    labels: jobStats?.byType.map(item => item.type) || [],
    datasets: [
      {
        data: jobStats?.byType.map(item => item.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
      }
    ]
  };

  return (
    <div className="job-analytics-page">
      <div className="page-header">
        <h1>Job Analytics</h1>
        <div className="timeframe-selector">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Active Jobs</h3>
          <div className="metric-value">{metrics?.activeJobs}</div>
          <div className="metric-change positive">
            +{metrics?.activeJobsChange}% from last period
          </div>
        </div>

        <div className="metric-card">
          <h3>Average Time to Fill</h3>
          <div className="metric-value">{metrics?.avgTimeToFill} days</div>
          <div className="metric-change negative">
            +{metrics?.avgTimeToFillChange}% from last period
          </div>
        </div>

        <div className="metric-card">
          <h3>Success Rate</h3>
          <div className="metric-value">{metrics?.successRate}%</div>
          <div className="metric-change positive">
            +{metrics?.successRateChange}% from last period
          </div>
        </div>

        <div className="metric-card">
          <h3>Cost per Hire</h3>
          <div className="metric-value">${metrics?.costPerHire}</div>
          <div className="metric-change negative">
            +{metrics?.costPerHireChange}% from last period
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h2>Job Posting Trends</h2>
          <Line 
            data={jobTrendData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Jobs Posted Over Time'
                }
              }
            }}
          />
        </div>

        <div className="chart-container">
          <h2>Jobs by Department</h2>
          <Bar 
            data={departmentData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Job Distribution by Department'
                }
              }
            }}
          />
        </div>

        <div className="chart-container">
          <h2>Job Types Distribution</h2>
          <Pie 
            data={jobTypeData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'Jobs by Employment Type'
                }
              }
            }}
          />
        </div>
      </div>

      <div className="insights-section">
        <h2>Key Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h3>Top Performing Department</h3>
            <p>{jobStats?.insights.topDepartment}</p>
            <span className="insight-value">
              {jobStats?.insights.topDepartmentHires} hires
            </span>
          </div>

          <div className="insight-card">
            <h3>Most Competitive Role</h3>
            <p>{jobStats?.insights.mostCompetitiveRole}</p>
            <span className="insight-value">
              {jobStats?.insights.applicantsPerRole} applicants/role
            </span>
          </div>

          <div className="insight-card">
            <h3>Fastest Hiring Process</h3>
            <p>{jobStats?.insights.fastestHiringDepartment}</p>
            <span className="insight-value">
              {jobStats?.insights.avgHiringDays} days
            </span>
          </div>

          <div className="insight-card">
            <h3>Recruitment Efficiency</h3>
            <p>Interview to Hire Ratio</p>
            <span className="insight-value">
              1:{jobStats?.insights.interviewToHireRatio}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAnalytics;