import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterAPI } from '../../api/recruiter';
import { formatDate } from '../../utils/formatters';

const HomePage = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    interviews: 0,
    hired: 0
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const jobsResponse = await recruiterAPI.getJobs();
        const jobs = jobsResponse.jobs;

        // Calculate stats
        const activeJobs = jobs.filter(job => job.status === 'active');
        const totalApplications = jobs.reduce((sum, job) => sum + job.applicationsCount, 0);
        const newApplications = jobs.reduce((sum, job) => sum + job.newApplicationsCount, 0);

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
        setError(null);
      } catch (err) {
        setError('Failed to load home page data. Please try again.');
        console.error('Error loading home page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <div className="loading-indicator">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-home-page">
      <div className="page-header">
        <h1>Welcome back, Admin!</h1>
        <div className="header-actions">
          <Link to="/admin/jobs/create" className="create-btn">
            Post New Job
          </Link>
        </div>
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
          <div className="stat-label">Interviews</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.hired}</div>
          <div className="stat-label">Hired</div>
        </div>
      </div>

      <div className="recent-jobs-section">
        <div className="section-header">
          <h2>Recent Job Postings</h2>
          <Link to="/admin/jobs" className="view-all">View All</Link>
        </div>

        <div className="jobs-table">
          <div className="table-header">
            <div className="col-title">Job Title</div>
            <div className="col-applications">Applications</div>
            <div className="col-posted">Posted Date</div>
            <div className="col-status">Status</div>
            <div className="col-actions">Actions</div>
          </div>

          {recentJobs.map(job => (
            <div key={job.id} className="table-row">
              <div className="col-title">
                <h3>{job.title}</h3>
                <span className="department">{job.department}</span>
              </div>

              <div className="col-applications">
                <span className="applications-count">{job.applicationsCount}</span>
                {job.newApplicationsCount > 0 && (
                  <span className="new-badge">
                    +{job.newApplicationsCount} new
                  </span>
                )}
              </div>

              <div className="col-posted">
                {formatDate(job.postedDate)}
              </div>

              <div className="col-status">
                <span className={`status-badge ${job.status}`}>
                  {job.status}
                </span>
              </div>

              <div className="col-actions">
                <Link 
                  to={`/admin/jobs/${job.id}`}
                  className="view-btn"
                >
                  View
                </Link>
                <Link 
                  to={`/admin/jobs/${job.id}/edit`}
                  className="edit-btn"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/jobs/create" className="action-card">
            <div className="action-icon">📝</div>
            <h3>Post New Job</h3>
            <p>Create a new job posting</p>
          </Link>

          <Link to="/admin/applications" className="action-card">
            <div className="action-icon">👥</div>
            <h3>Review Applications</h3>
            <p>Review pending applications</p>
          </Link>

          <Link to="/admin/interviews" className="action-card">
            <div className="action-icon">📅</div>
            <h3>Schedule Interviews</h3>
            <p>Manage interview schedules</p>
          </Link>

          <Link to="/admin/reports" className="action-card">
            <div className="action-icon">📊</div>
            <h3>View Reports</h3>
            <p>Access recruitment analytics</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;