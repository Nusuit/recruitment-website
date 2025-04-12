import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { candidateAPI } from '../../api/candidate';
import { formatDate } from '../../utils/formatters';
import EmptyState from '../../components/common/EmptyState';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await candidateAPI.getApplications();
        setApplications(response.applications);
        setError(null);
      } catch (err) {
        setError('Failed to fetch applications. Please try again.');
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await candidateAPI.deleteApplication(applicationId);
      setApplications(apps => apps.filter(app => app.id !== applicationId));
    } catch (err) {
      console.error('Error withdrawing application:', err);
      alert('Failed to withdraw application. Please try again.');
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status.toLowerCase() === filter;
  });

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'reviewing':
        return 'status-reviewing';
      case 'shortlisted':
        return 'status-shortlisted';
      case 'interview':
        return 'status-interview';
      case 'offered':
        return 'status-offered';
      case 'hired':
        return 'status-hired';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading applications...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="applications-page">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the status of your job applications</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon="applications"
          title="No applications yet"
          description="You haven't applied to any jobs yet. Start your journey by exploring our job listings."
          action={
            <Link to="/jobs" className="browse-jobs-btn">
              Browse Jobs
            </Link>
          }
        />
      ) : (
        <>
          <div className="filter-tabs">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${filter === 'reviewing' ? 'active' : ''}`}
              onClick={() => setFilter('reviewing')}
            >
              Reviewing
            </button>
            <button 
              className={`filter-btn ${filter === 'shortlisted' ? 'active' : ''}`}
              onClick={() => setFilter('shortlisted')}
            >
              Shortlisted
            </button>
            <button 
              className={`filter-btn ${filter === 'interview' ? 'active' : ''}`}
              onClick={() => setFilter('interview')}
            >
              Interview
            </button>
            <button 
              className={`filter-btn ${filter === 'offered' ? 'active' : ''}`}
              onClick={() => setFilter('offered')}
            >
              Offered
            </button>
            <button 
              className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected
            </button>
          </div>

          <div className="applications-grid">
            {filteredApplications.map(application => (
              <div key={application.id} className="application-card">
                <div className="job-info">
                  <Link 
                    to={`/jobs/${application.jobId}`}
                    className="job-title"
                  >
                    {application.jobTitle}
                  </Link>
                  <div className="company-name">{application.company}</div>
                  <div className="meta-info">
                    <span className="location">
                      <i className="location-icon"></i>
                      {application.location}
                    </span>
                    <span className="job-type">{application.jobType}</span>
                  </div>
                </div>

                <div className="application-info">
                  <div className="applied-date">
                    Applied: {formatDate(application.appliedDate)}
                  </div>
                  <div className={`status ${getStatusClass(application.status)}`}>
                    {application.status}
                  </div>
                </div>

                <div className="application-actions">
                  <Link 
                    to={`/applications/${application.id}`}
                    className="view-details-btn"
                  >
                    View Details
                  </Link>
                  {application.status === 'pending' && (
                    <button
                      onClick={() => handleWithdraw(application.id)}
                      className="withdraw-btn"
                    >
                      Withdraw
                    </button>
                  )}
                  {application.status === 'interview' && application.interviewDetails && (
                    <Link
                      to={`/applications/${application.id}/interview`}
                      className="interview-details-btn"
                    >
                      Interview Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredApplications.length === 0 && (
            <div className="no-results">
              <p>No applications found with the selected filter.</p>
              <button 
                onClick={() => setFilter('all')}
                className="clear-filter-btn"
              >
                Show All Applications
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationsPage;