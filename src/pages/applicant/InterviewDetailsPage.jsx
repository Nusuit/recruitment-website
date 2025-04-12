import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { candidateAPI } from '../../api/candidate';
import { formatDate } from '../../utils/formatters';

const InterviewDetailsPage = () => {
  const { applicationId } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        setLoading(true);
        const response = await candidateAPI.getApplicationDetail(applicationId);
        if (!response.application.interview) {
          throw new Error('No interview details found');
        }
        setInterview(response.application.interview);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load interview details');
        console.error('Error fetching interview:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [applicationId]);

  if (loading) {
    return <div className="loading-indicator">Loading interview details...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-message">{error}</div>
        <Link to="/applicant/applications" className="back-link">
          Return to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="interview-details-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Interview Details</h1>
          <Link 
            to={`/applicant/applications/${applicationId}`}
            className="back-link"
          >
            ← Back to Application
          </Link>
        </div>
      </div>

      <div className="interview-content">
        <div className="interview-card">
          <div className="interview-header">
            <div className="interview-type">
              <i className={`interview-icon ${interview.type.toLowerCase()}`}></i>
              <span>{interview.type} Interview</span>
            </div>
            <div className="interview-status">
              {interview.status}
            </div>
          </div>

          <div className="interview-details">
            <div className="detail-group">
              <h3>Schedule</h3>
              <div className="detail-item">
                <i className="calendar-icon"></i>
                <div className="detail-content">
                  <div className="label">Date</div>
                  <div className="value">
                    {formatDate(interview.dateTime, 'full')}
                  </div>
                </div>
              </div>
              <div className="detail-item">
                <i className="clock-icon"></i>
                <div className="detail-content">
                  <div className="label">Time</div>
                  <div className="value">
                    {formatDate(interview.dateTime, 'time')}
                  </div>
                </div>
              </div>
              <div className="detail-item">
                <i className="duration-icon"></i>
                <div className="detail-content">
                  <div className="label">Duration</div>
                  <div className="value">{interview.duration} minutes</div>
                </div>
              </div>
            </div>

            <div className="detail-group">
              <h3>Location</h3>
              {interview.type === 'ONLINE' ? (
                <>
                  <div className="detail-item">
                    <i className="platform-icon"></i>
                    <div className="detail-content">
                      <div className="label">Platform</div>
                      <div className="value">{interview.platform}</div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <i className="link-icon"></i>
                    <div className="detail-content">
                      <div className="label">Meeting Link</div>
                      <a 
                        href={interview.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="meeting-link"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="detail-item">
                  <i className="location-icon"></i>
                  <div className="detail-content">
                    <div className="label">Address</div>
                    <div className="value">{interview.location}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="detail-group">
              <h3>Interviewers</h3>
              {interview.interviewers.map((interviewer, index) => (
                <div key={index} className="interviewer-item">
                  <img 
                    src={interviewer.avatar || '/default-avatar.png'} 
                    alt={interviewer.name}
                    className="interviewer-avatar"
                  />
                  <div className="interviewer-info">
                    <div className="interviewer-name">{interviewer.name}</div>
                    <div className="interviewer-position">{interviewer.position}</div>
                  </div>
                </div>
              ))}
            </div>

            {interview.instructions && (
              <div className="detail-group">
                <h3>Instructions</h3>
                <div className="instructions">
                  {interview.instructions}
                </div>
              </div>
            )}

            {interview.requirements && (
              <div className="detail-group">
                <h3>What to Prepare</h3>
                <ul className="requirements-list">
                  {interview.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="interview-actions">
            {interview.type === 'ONLINE' && (
              <a 
                href={interview.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="join-meeting-btn"
              >
                Join Meeting
              </a>
            )}
            <button className="add-calendar-btn">
              Add to Calendar
            </button>
            <button className="download-details-btn">
              Download Details
            </button>
          </div>
        </div>

        <div className="preparation-tips">
          <h3>Interview Preparation Tips</h3>
          <div className="tips-list">
            <div className="tip-item">
              <i className="research-icon"></i>
              <h4>Research the Company</h4>
              <p>Learn about our company's history, values, products, and recent news.</p>
            </div>
            <div className="tip-item">
              <i className="review-icon"></i>
              <h4>Review the Job Description</h4>
              <p>Understand the role requirements and prepare relevant examples.</p>
            </div>
            <div className="tip-item">
              <i className="practice-icon"></i>
              <h4>Practice Common Questions</h4>
              <p>Prepare answers to typical interview questions in your field.</p>
            </div>
            <div className="tip-item">
              <i className="time-icon"></i>
              <h4>Be On Time</h4>
              <p>Join online meetings 5 minutes early or arrive 10-15 minutes before in-person interviews.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailsPage;