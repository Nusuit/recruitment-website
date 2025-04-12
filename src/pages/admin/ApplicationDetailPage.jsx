import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { recruiterAPI } from '../../api/recruiter';

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [note, setNote] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        setLoading(true);
        const response = await recruiterAPI.getApplicationDetail(id);
        setApplication(response.application);
        setNote(response.application.note || '');
        setError(null);
      } catch (err) {
        setError('Failed to load application details. Please try again.');
        console.error('Error loading application:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetail();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusUpdateLoading(true);
      await recruiterAPI.updateApplicationStatus(id, newStatus);
      
      setApplication(prev => ({
        ...prev,
        status: newStatus
      }));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update application status');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleNoteSubmit = async () => {
    try {
      await recruiterAPI.addApplicationNote(id, note);
      alert('Note updated successfully');
    } catch (err) {
      console.error('Error updating note:', err);
      alert('Failed to update note');
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
    <div className="application-detail-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Application Details</h1>
          <Link 
            to={`/recruiter/jobs/${application.jobId}/applications`}
            className="back-link"
          >
            ← Back to Applications
          </Link>
        </div>

        <div className="application-status">
          <span className={`status-badge ${application.status.toLowerCase()}`}>
            {application.status}
          </span>
          {!statusUpdateLoading && (
            <div className="status-actions">
              <button 
                onClick={() => handleStatusChange('shortlisted')}
                disabled={application.status === 'shortlisted'}
              >
                Shortlist
              </button>
              <button 
                onClick={() => handleStatusChange('interview')}
                disabled={application.status === 'interview'}
              >
                Schedule Interview
              </button>
              <button 
                onClick={() => handleStatusChange('hired')}
                disabled={application.status === 'hired'}
              >
                Hire
              </button>
              <button 
                onClick={() => handleStatusChange('rejected')}
                disabled={application.status === 'rejected'}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="application-content">
        <div className="main-content">
          <div className="applicant-section">
            <h2>Applicant Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Full Name:</span>
                <span className="value">{application.applicantName}</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{application.email}</span>
              </div>
              <div className="info-item">
                <span className="label">Phone:</span>
                <span className="value">{application.phone}</span>
              </div>
              <div className="info-item">
                <span className="label">Applied Date:</span>
                <span className="value">
                  {new Date(application.appliedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="job-section">
            <h2>Job Details</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Position:</span>
                <span className="value">{application.jobTitle}</span>
              </div>
              <div className="info-item">
                <span className="label">Department:</span>
                <span className="value">{application.department}</span>
              </div>
              <div className="info-item">
                <span className="label">Location:</span>
                <span className="value">{application.location}</span>
              </div>
            </div>
          </div>

          <div className="documents-section">
            <h2>Documents</h2>
            <div className="documents-grid">
              <div className="document-item">
                <span className="label">Resume:</span>
                <a 
                  href={application.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="document-link"
                >
                  View Resume
                </a>
              </div>
              {application.coverLetter && (
                <div className="document-item">
                  <span className="label">Cover Letter:</span>
                  <div className="cover-letter-content">
                    {application.coverLetter}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="evaluation-section">
            <h2>Evaluation Notes</h2>
            <div className="notes-editor">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes about the candidate..."
                rows={4}
              />
              <button onClick={handleNoteSubmit}>Save Notes</button>
            </div>
          </div>
        </div>

        <div className="side-content">
          <div className="timeline-section">
            <h3>Application Timeline</h3>
            <div className="timeline">
              {application.timeline.map((event, index) => (
                <div key={index} className="timeline-event">
                  <div className="event-date">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="event-content">
                    <div className="event-title">{event.title}</div>
                    {event.description && (
                      <div className="event-description">
                        {event.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {application.interview && (
            <div className="interview-section">
              <h3>Interview Details</h3>
              <div className="interview-info">
                <div className="info-item">
                  <span className="label">Date & Time:</span>
                  <span className="value">
                    {new Date(application.interview.dateTime).toLocaleString()}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Type:</span>
                  <span className="value">{application.interview.type}</span>
                </div>
                <div className="info-item">
                  <span className="label">Location/Link:</span>
                  <span className="value">{application.interview.location}</span>
                </div>
                {application.interview.notes && (
                  <div className="info-item">
                    <span className="label">Interview Notes:</span>
                    <div className="interview-notes">
                      {application.interview.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;