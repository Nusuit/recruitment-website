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
import { Bar, Line, Doughnut } from 'react-chartjs-2';

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

const ApplicantAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [timeframe, setTimeframe] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await recruiterAPI.getApplicationAnalytics({ timeframe });
      setAnalytics(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch applicant analytics. Please try again.');
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

  const applicationTrendData = {
    labels: analytics?.applicationTrend.map(item => item.date) || [],
    datasets: [
      {
        label: 'Applications',
        data: analytics?.applicationTrend.map(item => item.count) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ]
  };

  const sourceData = {
    labels: analytics?.applicationSources.map(source => source.name) || [],
    datasets: [
      {
        data: analytics?.applicationSources.map(source => source.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      }
    ]
  };

  const statusData = {
    labels: analytics?.applicationStatus.map(status => status.status) || [],
    datasets: [
      {
        label: 'Applications by Status',
        data: analytics?.applicationStatus.map(status => status.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
      }
    ]
  };

  return (
    <div className="applicant-analytics-page">
      <div className="page-header">
        <h1>Applicant Analytics</h1>
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
          <h3>Total Applicants</h3>
          <div className="metric-value">{analytics?.totalApplicants}</div>
          <div className={`metric-change ${analytics?.applicantChange >= 0 ? 'positive' : 'negative'}`}>
            {analytics?.applicantChange >= 0 ? '+' : ''}{analytics?.applicantChange}% from last period
          </div>
        </div>

        <div className="metric-card">
          <h3>Application Rate</h3>
          <div className="metric-value">{analytics?.applicationRate}%</div>
          <div className={`metric-change ${analytics?.rateChange >= 0 ? 'positive' : 'negative'}`}>
            {analytics?.rateChange >= 0 ? '+' : ''}{analytics?.rateChange}% from last period
          </div>
        </div>

        <div className="metric-card">
          <h3>Average Applications per Job</h3>
          <div className="metric-value">{analytics?.avgApplicationsPerJob}</div>
          <div className={`metric-change ${analytics?.avgChange >= 0 ? 'positive' : 'negative'}`}>
            {analytics?.avgChange >= 0 ? '+' : ''}{analytics?.avgChange}% from last period
          </div>
        </div>

        <div className="metric-card">
          <h3>Qualified Candidate Rate</h3>
          <div className="metric-value">{analytics?.qualifiedRate}%</div>
          <div className={`metric-change ${analytics?.qualifiedChange >= 0 ? 'positive' : 'negative'}`}>
            {analytics?.qualifiedChange >= 0 ? '+' : ''}{analytics?.qualifiedChange}% from last period
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h2>Application Trends</h2>
          <Line 
            data={applicationTrendData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Applications Over Time'
                }
              }
            }}
          />
        </div>

        <div className="chart-container">
          <h2>Application Sources</h2>
          <Doughnut 
            data={sourceData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'Where Applicants Come From'
                }
              }
            }}
          />
        </div>

        <div className="chart-container">
          <h2>Application Status Distribution</h2>
          <Bar 
            data={statusData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: 'Applications by Current Status'
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
            <h3>Most Popular Jobs</h3>
            <ul className="insight-list">
              {analytics?.popularJobs.map((job, index) => (
                <li key={index}>
                  <span className="job-title">{job.title}</span>
                  <span className="application-count">{job.applications} applications</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="insight-card">
            <h3>Top Skills in Demand</h3>
            <ul className="insight-list">
              {analytics?.topSkills.map((skill, index) => (
                <li key={index}>
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-demand">{skill.demand}% of jobs</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="insight-card">
            <h3>Best Performing Sources</h3>
            <ul className="insight-list">
              {analytics?.bestSources.map((source, index) => (
                <li key={index}>
                  <span className="source-name">{source.name}</span>
                  <span className="success-rate">{source.successRate}% success rate</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="insight-card">
            <h3>Time to Fill Analysis</h3>
            <ul className="insight-list">
              {analytics?.timeToFill.map((category, index) => (
                <li key={index}>
                  <span className="category-name">{category.name}</span>
                  <span className="avg-days">{category.days} days avg.</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantAnalytics;