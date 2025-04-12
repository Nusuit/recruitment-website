import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { candidateAPI } from '../../api/candidate';

const ApplicationsList = () => {
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
        setError('Failed to fetch applications');
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = filter === 'all' 
    ? applications
    : applications.filter(app => app.status.toLowerCase() === filter);

  const handleWithdraw = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await candidateAPI.deleteApplication(applicationId);
        setApplications(apps => apps.filter(app => app.id !== applicationId));
      } catch (err) {
        console.error('Error withdrawing application:', err);
        alert('Failed to withdraw application. Please try again.');
      }
    }
  };

  if (loading) return <div className="loading">Loading applications...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="applications-list">
      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={filter === 'reviewing' ? 'active' : ''}
          onClick={() => setFilter('reviewing')}
        >
          Reviewing
        </button>
        <button 
          className={filter === 'accepted' ? 'active' : ''}
          onClick={() => setFilter('accepted')}
        >
          Accepted
        </button>
        <button 
          className={filter === 'rejected' ? 'active' : ''}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="no-applications">
          <p>No applications found</p>
        </div>
      ) : (
        <div className="applications-grid">
          {filteredApplications.map(application => (
            <div key={application.id} className="application-card">
              <div className="job-info">
                <h3>{application.jobTitle}</h3>
                <p className="company">{application.company}</p>
              </div>

              <div className="application-meta">
                <span className="applied-date">
                  Applied: {new Date(application.appliedDate).toLocaleDateString()}
                </span>
                <span className={`status ${application.status.toLowerCase()}`}>
                  {application.status}
                </span>
              </div>

              <div className="application-actions">
                <Link 
                  to={`/applications/${application.id}`}
                  className="view-details"
                >
                  View Details
                </Link>
                {application.status === 'pending' && (
                  <button
                    onClick={() => handleWithdraw(application.id)}
                    className="withdraw-button"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;