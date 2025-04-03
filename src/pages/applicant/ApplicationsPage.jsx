import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobsContext from '../../contexts/JobsContext';

const ApplicationsPage = () => {
  const { getUserApplications, loading } = useContext(JobsContext);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      // Get user applications from context
      const userApplications = getUserApplications();
      setApplications(userApplications);
      setIsLoading(false);
    };

    // Wait for the jobs context to load before fetching applications
    if (!loading) {
      fetchApplications();
    }
  }, [loading, getUserApplications]);

  // Filter applications by status
  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status.toLowerCase() === filterStatus.toLowerCase());

  // Get status class for styling
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending review':
        return 'status-pending';
      case 'in review':
        return 'status-reviewing';
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

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="applications-page">
      <h1>My Applications</h1>
      <p className="page-description">
        Keep track of your job applications and their current status.
      </p>

      <div className="applications-filters">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Applications
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'pending review' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending review')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'shortlisted' ? 'active' : ''}`}
            onClick={() => setFilterStatus('shortlisted')}
          >
            Shortlisted
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'interview scheduled' ? 'active' : ''}`}
            onClick={() => setFilterStatus('interview scheduled')}
          >
            Interviews
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'hired' ? 'active' : ''}`}
            onClick={() => setFilterStatus('hired')}
          >
            Hired
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilterStatus('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-indicator">Loading applications...</div>
      ) : filteredApplications.length === 0 ? (
        <div className="no-applications">
          <div className="empty-state">
            <i className="application-icon large"></i>
            {filterStatus === 'all' ? (
              <>
                <h3>No applications yet</h3>
                <p>
                  You haven't applied to any jobs yet. Start browsing jobs and submit your applications.
                </p>
              </>
            ) : (
              <>
                <h3>No {filterStatus} applications</h3>
                <p>
                  You don't have any applications with status "{filterStatus}".
                </p>
              </>
            )}
            <Link to="/jobs" className="browse-jobs-btn">
              Browse Jobs
            </Link>
          </div>
        </div>
      ) : (
        <div className="applications-list">
          <div className="applications-table">
            <div className="table-header">
              <div className="col-job">Job Position</div>
              <div className="col-date">Applied Date</div>
              <div className="col-status">Status</div>
              <div className="col-actions">Actions</div>
            </div>
            
            {filteredApplications.map(application => (
              <div key={application.id} className="application-row">
                <div className="col-job">
                  <h3>{application.jobTitle}</h3>
                  <span className="company-name">{application.company}</span>
                </div>
                <div className="col-date">
                  {formatDate(application.appliedDate)}
                </div>
                <div className="col-status">
                  <span className={`status-badge ${getStatusClass(application.status)}`}>
                    {application.status}
                  </span>
                </div>
                <div className="col-actions">
                  <Link to={`/jobs/${application.jobId}`} className="view-job-btn">
                    View Job
                  </Link>
                  {application.status === 'Interview Scheduled' && (
                    <button className="interview-details-btn">
                      Interview Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;