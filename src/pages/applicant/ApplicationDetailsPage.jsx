import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { candidateAPI } from '../../api/candidate';
import ApplicationStatus from '../../components/applicant/ApplicationStatus';
import { formatDate } from '../../utils/formatters';

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const response = await candidateAPI.getApplicationDetail(id);
        setApplication(response.application);
        setError(null);
      } catch (err) {
        setError('Failed to fetch application details. Please try again.');
        console.error('Error fetching application:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  const handleWithdraw = async () => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await candidateAPI.deleteApplication(id);
      // Redirect back to applications list
      window.location.href = '/applications';
    } catch (err) {
      setError('Failed to withdraw application. Please try again.');
      console.error('Error withdrawing application:', err);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading application details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!application) {
    return <div className="not-found">Application not found</div>;
  }

  return (
    <div className="application-details-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Application Details</h1>
          <Link to="/applications" className="back-link">
            ← Back to Applications
          </Link>
        </div>
      </div>

      <div className="application-content">
        <div className="main-content">
          <div className="job-section">
            <div className="job-header">
              <h2>{application.jobTitle}</h2>
              <span className="company-name">{application.company}</span>
            </div>

            <div className="job-meta">
              <div className="meta-item">
                <span className="label">Applied Date:</span>
                <span className="value">{formatDate(application.submittedAt)}</span>
              </div>
              <div className="meta-item">
                <span className="label">Location:</span>
                <span className="value">{application.location}</span>
              </div>
              <div className="meta-item">
                <span className="label">Job Type:</span>
                <span className="value">{application.jobType}</span>
              </div>
            </div>
          </div>

          <div className="application-section">
            <h3>Application Details</h3>
            
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Full Name</span>
                <span className="value">
                  {application.firstName} {application.lastName}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Email</span>
                <span className="value">{application.email}</span>
              </div>

              <div className="detail-item">
                <span className="label">Phone</span>
                <span className="value">{application.phone}</span>
              </div>

              {application.coverLetter && (
                <div className="detail-item full-width">
                  <span className="label">Cover Letter</span>
                  <div className="cover-letter">
                    {application.coverLetter}
                  </div>
                </div>
              )}

              <div className="detail-item">
                <span className="label">Resume</span>
                <a 
                  href={application.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resume-link"
                >
                  View Resume
                </a>
              </div>
            </div>
          </div>

          {application.interviewDetails && (
            <div className="interview-section">
              <h3>Interview Details</h3>
              <div className="interview-details">
                <div className="detail-item">
                  <span className="label">Date & Time:</span>
                  <span className="value">
                    {formatDate(application.interviewDetails.datetime, true)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Location:</span>
                  <span className="value">
                    {application.interviewDetails.location}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Interviewer:</span>
                  <span className="value">
                    {application.interviewDetails.interviewer}
                  </span>
                </div>
                {application.interviewDetails.notes && (
                  <div className="detail-item full-width">
                    <span className="label">Additional Notes:</span>
                    <div className="interview-notes">
                      {application.interviewDetails.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="side-content">
          <div className="status-section">
            <ApplicationStatus status={application.status} />
          </div>

          <div className="actions-section">
            {application.status === 'pending review' && (
              <button 
                className="withdraw-btn"
                onClick={handleWithdraw}
              >
                Withdraw Application
              </button>
            )}

            <Link 
              to={`/jobs/${application.jobId}`}
              className="view-job-btn"
            >
              View Job Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;