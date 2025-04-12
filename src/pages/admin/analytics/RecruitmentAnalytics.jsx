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
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const RecruitmentAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [timeframe, setTimeframe] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [recruitmentResponse, interviewResponse] = await Promise.all([
        recruiterAPI.getRecruitmentAnalytics({ timeframe }),
        recruiterAPI.getInterviewAnalytics({ timeframe })
      ]);

      setAnalytics(recruitmentResponse.data);
      setInterviewData(interviewResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch recruitment analytics. Please try again.');
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

  const funnelData = {
    labels: ['Applications', 'Screened', 'Interviewed', 'Offered', 'Hired'],
    datasets: [
      {
        label: 'Recruitment Funnel',
        data: [
          analytics?.funnelMetrics.applications,
          analytics?.funnelMetrics.screened,
          analytics?.funnelMetrics.interviewed,
          analytics?.funnelMetrics.offered,
          analytics?.funnelMetrics.hired
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 99, 132, 0.5)',
        ],
      }
    ]
  };

  const interviewTrendData = {
    labels: interviewData?.interviewTrend.map(item => item.date) || [],
    datasets: [
      {
        label: 'Scheduled Interviews',
        data: interviewData?.interviewTrend.map(item => item.scheduled) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Completed Interviews',
        data: interviewData?.interviewTrend.map(item => item.completed) || [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      }
    ]
  };

  return (
    <div className="recruitment-analytics-page">
      <div className="page-header">
        <h1>Recruitment Process Analytics</h1>
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
          <h3>Time to Hire</h3>
          <div className="metric-value">{analytics?.timeToHire} days</div>
          <div className={`metric-change ${analytics?.timeToHireChange <= 0 ? 'positive' : 'negative'}`}>
            {analytics?.timeToHireChange <= 0 ? '' : '+'}{analytics?.timeToHireChange}% from last period
          </div>
        </div>

        <div className="metric-card">
          <h3>Interview Success Rate</h3>
          <div className="metric-value">{analytics?.interviewSuccessRate}%</div>
          <div className={`metric-change ${analytics?.successRateChange >= 0 ? 'positive' : 'negative'}`}>
            {analytics?.successRateChange >= 0 ? '+' : ''}{analytics?.successRateChange}% from last period
          </div>
        </div>

        <div className="metric-card">
          <h3>Offer Acceptance Rate</h3>
          <div className="metric-value">{analytics?.offerAcceptanceRate}%</div>
          <div className={`metric-change ${analytics?.acceptanceRateChange >= 0 ? 'positive' : 'negative'}`}>
            {analytics?.acceptanceRateChange >= 0 ? '+' : ''}{analytics?.acceptanceRateChange}% from last period
          </div>
        </div>

        <div className="metric-card">
          <h3>Drop-off Rate</h3>
          <div className="metric-value">{analytics?.dropOffRate}%</div>
          <div className={`metric-change ${analytics?.dropOffRateChange <= 0 ? 'positive' : 'negative'}`}>
            {analytics?.dropOffRateChange <= 0 ? '' : '+'}{analytics?.dropOffRateChange}% from last period
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container full-width">
          <h2>Recruitment Funnel</h2>
          <Bar 
            data={funnelData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: 'Recruitment Pipeline Progress'
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>

        <div className="chart-container full-width">
          <h2>Interview Trends</h2>
          <Line 
            data={interviewTrendData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Interview Schedule vs Completion'
                }
              }
            }}
          />
        </div>
      </div>

      <div className="stages-analysis">
        <h2>Stage-wise Analysis</h2>
        <div className="stages-grid">
          {analytics?.stageAnalysis.map((stage, index) => (
            <div key={index} className="stage-card">
              <h3>{stage.name}</h3>
              <div className="stage-metrics">
                <div className="stage-metric">
                  <span className="metric-label">Average Time</span>
                  <span className="metric-value">{stage.avgTime} days</span>
                </div>
                <div className="stage-metric">
                  <span className="metric-label">Pass Rate</span>
                  <span className="metric-value">{stage.passRate}%</span>
                </div>
                <div className="stage-metric">
                  <span className="metric-label">Bottleneck Score</span>
                  <span className={`metric-value ${stage.bottleneckScore > 7 ? 'warning' : ''}`}>
                    {stage.bottleneckScore}/10
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="efficiency-insights">
        <h2>Efficiency Insights</h2>
        <div className="insights-grid">
          {analytics?.efficiencyInsights.map((insight, index) => (
            <div key={index} className="insight-card">
              <div className="insight-header">
                <h3>{insight.title}</h3>
                <span className={`impact-badge ${insight.impact}`}>
                  {insight.impact} Impact
                </span>
              </div>
              <p>{insight.description}</p>
              <div className="recommendation">
                <strong>Recommendation:</strong>
                <p>{insight.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecruitmentAnalytics;