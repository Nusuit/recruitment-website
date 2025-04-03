import React, { useState, useEffect } from 'react';
import { getJobStats } from '../../api/jobs';
import { getApplicationStats } from '../../api/applications';

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [jobStats, setJobStats] = useState(null);
  const [applicationStats, setApplicationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch report data based on selected time range
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch data from your API with the time range
        // const jobStatsResponse = await getJobStats({ timeRange });
        // const applicationStatsResponse = await getApplicationStats({ timeRange });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample data for jobs
        const jobsData = {
          totalJobs: 25,
          activeJobs: 12,
          expiredJobs: 8,
          draftJobs: 5,
          jobsByDepartment: [
            { name: 'Design', count: 8 },
            { name: 'Marketing', count: 6 },
            { name: 'Sales', count: 5 },
            { name: 'Production', count: 3 },
            { name: 'Management', count: 3 }
          ],
          jobsByLocation: [
            { name: 'HCM', count: 12 },
            { name: 'Hanoi', count: 8 },
            { name: 'Danang', count: 3 },
            { name: 'Remote', count: 2 }
          ],
          jobActivity: [
            { date: '2025-03-01', posted: 2, expired: 1 },
            { date: '2025-03-08', posted: 3, expired: 0 },
            { date: '2025-03-15', posted: 1, expired: 2 },
            { date: '2025-03-22', posted: 4, expired: 1 },
            { date: '2025-03-29', posted: 2, expired: 1 }
          ]
        };
        
        // Sample data for applications
        const applicationsData = {
          totalApplications: 187,
          newApplications: 14,
          processingApplications: 32,
          hiredCandidates: 7,
          rejectedCandidates: 134,
          applicationsByJob: [
            { name: 'Fashion Designer', count: 42 },
            { name: 'Marketing Specialist', count: 35 },
            { name: 'Store Manager', count: 28 },
            { name: 'Sales Associate', count: 26 },
            { name: 'Visual Merchandiser', count: 18 },
            { name: 'Other', count: 38 }
          ],
          applicationsByStatus: [
            { status: 'Pending Review', count: 14 },
            { status: 'Shortlisted', count: 32 },
            { status: 'Interview Scheduled', count: 18 },
            { status: 'Hired', count: 7 },
            { status: 'Rejected', count: 116 }
          ],
          applicationActivity: [
            { date: '2025-03-01', count: 12 },
            { date: '2025-03-08', count: 18 },
            { date: '2025-03-15', count: 15 },
            { date: '2025-03-22', count: 23 },
            { date: '2025-03-29', count: 16 }
          ],
          hiringFunnel: {
            applied: 187,
            reviewed: 173,
            shortlisted: 52,
            interviewed: 25,
            hired: 7
          }
        };
        
        setJobStats(jobsData);
        setApplicationStats(applicationsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError('Failed to load report data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [timeRange]);
  
  // Calculate conversion rates for hiring funnel
  const calculateConversionRate = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current / previous) * 100).toFixed(1);
  };
  
  // Handle time range change
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };
  
  // Render loading state
  if (loading) {
    return <div className="loading-container">Loading report data...</div>;
  }
  
  // Render error state
  if (error) {
    return <div className="error-container">{error}</div>;
  }
  
  // Calculate funnel conversion rates
  const funnel = applicationStats.hiringFunnel;
  const conversionRates = {
    reviewedRate: calculateConversionRate(funnel.reviewed, funnel.applied),
    shortlistedRate: calculateConversionRate(funnel.shortlisted, funnel.reviewed),
    interviewedRate: calculateConversionRate(funnel.interviewed, funnel.shortlisted),
    hiredRate: calculateConversionRate(funnel.hired, funnel.interviewed),
    overallRate: calculateConversionRate(funnel.hired, funnel.applied)
  };
  
  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        
        <div className="report-filters">
          <div className="time-range-filter">
            <label htmlFor="timeRange">Time Range:</label>
            <select
              id="timeRange"
              value={timeRange}
              onChange={handleTimeRangeChange}
            >
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="quarter">Past Quarter</option>
              <option value="year">Past Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <button className="export-btn">
            Export Report
          </button>
        </div>
      </div>
      
      <div className="report-sections">
        <div className="report-section">
          <h2>Job Analytics</h2>
          
          <div className="report-cards">
            <div className="report-card">
              <div className="report-card-title">Total Jobs</div>
              <div className="report-card-value">{jobStats.totalJobs}</div>
            </div>
            <div className="report-card">
              <div className="report-card-title">Active Jobs</div>
              <div className="report-card-value">{jobStats.activeJobs}</div>
            </div>
            <div className="report-card">
              <div className="report-card-title">Expired Jobs</div>
              <div className="report-card-value">{jobStats.expiredJobs}</div>
            </div>
            <div className="report-card">
              <div className="report-card-title">Draft Jobs</div>
              <div className="report-card-value">{jobStats.draftJobs}</div>
            </div>
          </div>
          
          <div className="report-charts">
            <div className="report-chart">
              <h3>Jobs by Department</h3>
              <div className="chart-container">
                {/* In a real app, you would use a charting library like Chart.js or Recharts */}
                <div className="bar-chart">
                  {jobStats.jobsByDepartment.map((item, index) => (
                    <div key={index} className="bar-item">
                      <div className="bar-label">{item.name}</div>
                      <div className="bar-container">
                        <div 
                          className="bar" 
                          style={{ 
                            width: `${(item.count / Math.max(...jobStats.jobsByDepartment.map(d => d.count))) * 100}%` 
                          }}
                        >
                          {item.count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="report-chart">
              <h3>Jobs by Location</h3>
              <div className="chart-container">
                <div className="pie-chart-placeholder">
                  {/* In a real app, you would use a charting library */}
                  <div className="pie-chart-text">
                    <div>HCM: {jobStats.jobsByLocation[0].count}</div>
                    <div>Hanoi: {jobStats.jobsByLocation[1].count}</div>
                    <div>Danang: {jobStats.jobsByLocation[2].count}</div>
                    <div>Remote: {jobStats.jobsByLocation[3].count}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="report-chart full-width">
            <h3>Job Activity Over Time</h3>
            <div className="chart-container">
              <div className="line-chart-placeholder">
                {/* In a real app, you would use a charting library */}
                <div className="line-chart-text">
                  Line chart showing job postings and expirations over time
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="report-section">
          <h2>Application Analytics</h2>
          
          <div className="report-cards">
            <div className="report-card">
              <div className="report-card-title">Total Applications</div>
              <div className="report-card-value">{applicationStats.totalApplications}</div>
            </div>
            <div className="report-card">
              <div className="report-card-title">New Applications</div>
              <div className="report-card-value">{applicationStats.newApplications}</div>
            </div>
            <div className="report-card">
              <div className="report-card-title">Hired Candidates</div>
              <div className="report-card-value">{applicationStats.hiredCandidates}</div>
            </div>
            <div className="report-card">
              <div className="report-card-title">Conversion Rate</div>
              <div className="report-card-value">{conversionRates.overallRate}%</div>
            </div>
          </div>
          
          <div className="report-charts">
            <div className="report-chart">
              <h3>Applications by Job</h3>
              <div className="chart-container">
                <div className="bar-chart">
                  {applicationStats.applicationsByJob.map((item, index) => (
                    <div key={index} className="bar-item">
                      <div className="bar-label">{item.name}</div>
                      <div className="bar-container">
                        <div 
                          className="bar" 
                          style={{ 
                            width: `${(item.count / Math.max(...applicationStats.applicationsByJob.map(d => d.count))) * 100}%` 
                          }}
                        >
                          {item.count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="report-chart">
              <h3>Applications by Status</h3>
              <div className="chart-container">
                <div className="pie-chart-placeholder">
                  {/* In a real app, you would use a charting library */}
                  <div className="pie-chart-text">
                    <div>Pending Review: {applicationStats.applicationsByStatus[0].count}</div>
                    <div>Shortlisted: {applicationStats.applicationsByStatus[1].count}</div>
                    <div>Interview: {applicationStats.applicationsByStatus[2].count}</div>
                    <div>Hired: {applicationStats.applicationsByStatus[3].count}</div>
                    <div>Rejected: {applicationStats.applicationsByStatus[4].count}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="report-chart full-width">
            <h3>Hiring Funnel</h3>
            <div className="chart-container">
              <div className="funnel-chart">
                <div className="funnel-step" style={{ width: '100%' }}>
                  <div className="funnel-label">Applied</div>
                  <div className="funnel-value">{funnel.applied}</div>
                </div>
                <div className="funnel-step" style={{ width: '90%' }}>
                  <div className="funnel-label">Reviewed</div>
                  <div className="funnel-value">{funnel.reviewed} ({conversionRates.reviewedRate}%)</div>
                </div>
                <div className="funnel-step" style={{ width: '60%' }}>
                  <div className="funnel-label">Shortlisted</div>
                  <div className="funnel-value">{funnel.shortlisted} ({conversionRates.shortlistedRate}%)</div>
                </div>
                <div className="funnel-step" style={{ width: '40%' }}>
                  <div className="funnel-label">Interviewed</div>
                  <div className="funnel-value">{funnel.interviewed} ({conversionRates.interviewedRate}%)</div>
                </div>
                <div className="funnel-step" style={{ width: '20%' }}>
                  <div className="funnel-label">Hired</div>
                  <div className="funnel-value">{funnel.hired} ({conversionRates.hiredRate}%)</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="report-chart full-width">
            <h3>Application Activity Over Time</h3>
            <div className="chart-container">
              <div className="line-chart-placeholder">
                {/* In a real app, you would use a charting library */}
                <div className="line-chart-text">
                  Line chart showing application trends over time
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;