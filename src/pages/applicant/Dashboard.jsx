import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    shortlisted: 0,
    interviews: 0,
    hired: 0
  });
  
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Sample data
        setStats({
          totalJobs: 25,
          activeJobs: 12,
          totalApplications: 187,
          newApplications: 14,
          shortlisted: 32,
          interviews: 18,
          hired: 7
        });
        
        setRecentJobs([
          {
            id: 1,
            title: 'Fashion Designer',
            location: 'HCM, Vietnam',
            type: 'Full Time',
            applications: 28,
            postedDate: '2025-03-20',
            daysRemaining: 12
          },
          {
            id: 2,
            title: 'Store Manager',
            location: 'Hanoi, Vietnam',
            type: 'Full Time',
            applications: 15,
            postedDate: '2025-03-18',
            daysRemaining: 10
          },
          {
            id: 3,
            title: 'Marketing Specialist',
            location: 'HCM, Vietnam',
            type: 'Remote',
            applications: 42,
            postedDate: '2025-03-15',
            daysRemaining: 7
          },
          {
            id: 4,
            title: 'Sales Associate',
            location: 'Danang, Vietnam',
            type: 'Part Time',
            applications: 19,
            postedDate: '2025-03-22',
            daysRemaining: 14
          }
        ]);
        
        setRecentApplications([
          {
            id: 101,
            applicantName: 'Nguyen Van A',
            jobTitle: 'Fashion Designer',
            appliedDate: '2025-03-27',
            status: 'Pending Review'
          },
          {
            id: 102,
            applicantName: 'Tran Thi B',
            jobTitle: 'Store Manager',
            appliedDate: '2025-03-26',
            status: 'Shortlisted'
          },
          {
            id: 103,
            applicantName: 'Le Van C',
            jobTitle: 'Marketing Specialist',
            appliedDate: '2025-03-25',
            status: 'Interview Scheduled'
          },
          {
            id: 104,
            applicantName: 'Pham Thi D',
            jobTitle: 'Sales Associate',
            appliedDate: '2025-03-24',
            status: 'Pending Review'
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status class for styling
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending review':
        return 'status-pending';
      case 'shortlisted':
        return 'status-shortlisted';
      case 'interview scheduled':
        return 'status-interview';
      case 'rejected':
        return 'status-rejected';
      case 'hired':
        return 'status-hired';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return <div className="loading-container">Loading dashboard data...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon jobs-icon"></div>
          <div className="stat-content">
            <h2>{stats.totalJobs}</h2>
            <p>Total Jobs</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon active-jobs-icon"></div>
          <div className="stat-content">
            <h2>{stats.activeJobs}</h2>
            <p>Active Jobs</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon applications-icon"></div>
          <div className="stat-content">
            <h2>{stats.totalApplications}</h2>
            <p>Total Applications</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon new-applications-icon"></div>
          <div className="stat-content">
            <h2>{stats.newApplications}</h2>
            <p>New Applications</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Job Postings</h2>
            <Link to="/admin/jobs" className="view-all-link">View All</Link>
          </div>
          
          <div className="section-content">
            <div className="recent-jobs-table">
              <div className="table-header">
                <div className="col-job">Job Position</div>
                <div className="col-date">Posted Date</div>
                <div className="col-applications">Applications</div>
                <div className="col-status">Days Remaining</div>
                <div className="col-actions">Actions</div>
              </div>
              
              {recentJobs.map(job => (
                <div key={job.id} className="job-row">
                  <div className="col-job">
                    <h3>{job.title}</h3>
                    <div className="job-meta">
                      <span className="job-location">{job.location}</span>
                      <span className="job-type">{job.type}</span>
                    </div>
                  </div>
                  <div className="col-date">{formatDate(job.postedDate)}</div>
                  <div className="col-applications">{job.applications}</div>
                  <div className="col-status">
                    <span className={job.daysRemaining < 7 ? 'expiring-soon' : ''}>
                      {job.daysRemaining} days
                    </span>
                  </div>
                  <div className="col-actions">
                    <Link to={`/admin/jobs/${job.id}`} className="view-btn">View</Link>
                    <Link to={`/admin/jobs/${job.id}/edit`} className="edit-btn">Edit</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Applications</h2>
            <Link to="/admin/applicants" className="view-all-link">View All</Link>
          </div>
          
          <div className="section-content">
            <div className="recent-applications-table">
              <div className="table-header">
                <div className="col-applicant">Applicant</div>
                <div className="col-job">Job Position</div>
                <div className="col-date">Applied Date</div>
                <div className="col-status">Status</div>
                <div className="col-actions">Actions</div>
              </div>
              
              {recentApplications.map(application => (
                <div key={application.id} className="application-row">
                  <div className="col-applicant">{application.applicantName}</div>
                  <div className="col-job">{application.jobTitle}</div>
                  <div className="col-date">{formatDate(application.appliedDate)}</div>
                  <div className="col-status">
                    <span className={`status-badge ${getStatusClass(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  <div className="col-actions">
                    <Link to={`/admin/applicants/${application.id}`} className="view-btn">View</Link>
                    <button className="change-status-btn">Change Status</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-summary">
        <div className="summary-section">
          <h2>Application Status Summary</h2>
          <div className="status-summary">
            <div className="status-item">
              <div className="status-count">{stats.newApplications}</div>
              <div className="status-label">New</div>
            </div>
            <div className="status-item">
              <div className="status-count">{stats.shortlisted}</div>
              <div className="status-label">Shortlisted</div>
            </div>
            <div className="status-item">
              <div className="status-count">{stats.interviews}</div>
              <div className="status-label">Interviews</div>
            </div>
            <div className="status-item">
              <div className="status-count">{stats.hired}</div>
              <div className="status-label">Hired</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <Link to="/admin/jobs/create" className="create-job-btn">
          Post New Job
        </Link>
        <Link to="/admin/reports" className="view-reports-btn">
          View Reports
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;