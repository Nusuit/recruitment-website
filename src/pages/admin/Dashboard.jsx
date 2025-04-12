import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterAPI } from '../../api/recruiter';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    interviews: 0,
    hired: 0
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch jobs
        const jobsResponse = await recruiterAPI.getJobs();
        const jobs = jobsResponse.jobs;
        
        // Calculate stats
        const activeJobs = jobs.filter(job => job.status === 'active');
        const totalApplications = jobs.reduce((sum, job) => sum + job.applicationsCount, 0);
        const newApplications = jobs.reduce((sum, job) => 
          sum + job.newApplicationsCount, 0
        );
        
        setStats({
          totalJobs: jobs.length,
          activeJobs: activeJobs.length,
          totalApplications,
          newApplications,
          interviews: jobs.reduce((sum, job) => sum + job.interviewsCount, 0),
          hired: jobs.reduce((sum, job) => sum + job.hiredCount, 0)
        });

        // Get recent jobs
        setRecentJobs(jobs.slice(0, 5));

        // Get recent applications
        const recentApps = [];
        for (const job of jobs) {
          if (recentApps.length >= 5) break;
          
          const appsResponse = await recruiterAPI.getJobApplications(job.id);
          recentApps.push(...appsResponse.applications);
        }
        
        setRecentApplications(recentApps.slice(0, 5));
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading-indicator">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="recruiter-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/recruiter/jobs/new" className="post-job-btn">
          Post New Job
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalJobs}</div>
          <div className="stat-label">Total Jobs</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.activeJobs}</div>
          <div className="stat-label">Active Jobs</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.totalApplications}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.newApplications}</div>
          <div className="stat-label">New Applications</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.interviews}</div>
          <div className="stat-label">Interviews Scheduled</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.hired}</div>
          <div className="stat-label">Candidates Hired</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-jobs">
          <div className="section-header">
            <h2>Recent Job Posts</h2>
            <Link to="/recruiter/jobs" className="view-all">
              View All Jobs
            </Link>
          </div>

          <div className="jobs-list">
            {recentJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className={`status ${job.status}`}>{job.status}</span>
                </div>
                
                <div className="job-meta">
                  <span className="location">{job.location}</span>
                  <span className="type">{job.type}</span>
                  <span className="applications">
                    {job.applicationsCount} applications
                  </span>
                </div>

                <div className="job-actions">
                  <Link 
                    to={`/recruiter/jobs/${job.id}/applications`}
                    className="view-applications"
                  >
                    View Applications
                  </Link>
                  <Link 
                    to={`/recruiter/jobs/${job.id}/edit`}
                    className="edit-job"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-applications">
          <div className="section-header">
            <h2>Recent Applications</h2>
            <Link to="/recruiter/applications" className="view-all">
              View All Applications
            </Link>
          </div>

          <div className="applications-list">
            {recentApplications.map(application => (
              <div key={application.id} className="application-card">
                <div className="applicant-info">
                  <h3>{application.applicantName}</h3>
                  <p className="job-title">
                    Applied for: {application.jobTitle}
                  </p>
                </div>

                <div className="application-meta">
                  <span className="date">
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </span>
                  <span className={`status ${application.status.toLowerCase()}`}>
                    {application.status}
                  </span>
                </div>

                <Link 
                  to={`/recruiter/applications/${application.id}`}
                  className="view-details"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;