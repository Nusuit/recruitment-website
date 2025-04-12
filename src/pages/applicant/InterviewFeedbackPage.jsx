import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidateAPI } from '../../api/candidate';

const InterviewFeedbackPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const [feedback, setFeedback] = useState({
    overallExperience: 5, // 1-10
    preparedness: 5, // 1-10
    clarity: 5, // 1-10
    technicalDepth: 5, // 1-10
    cultureFit: 5, // 1-10
    comments: '',
    wouldRecommend: null // true/false
  });

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const response = await candidateAPI.getApplicationDetail(applicationId);
        setApplication(response.application);
        
        // Check if feedback already exists
        if (response.application.feedback) {
          setFeedback(response.application.feedback);
          setFeedbackSent(true);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch application details. Please try again.');
        console.error('Error fetching application:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [applicationId]);

  const handleRatingChange = (field, value) => {
    setFeedback(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await candidateAPI.updateApplication(applicationId, {
        feedback
      });
      setFeedbackSent(true);
      
      // Redirect to applications page after 2 seconds
      setTimeout(() => {
        navigate('/applicant/applications');
      }, 2000);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', err);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading interview details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="interview-feedback-page">
      <div className="page-header">
        <h1>Interview Feedback</h1>
        <p>Please share your thoughts about the interview experience</p>
      </div>

      {feedbackSent ? (
        <div className="feedback-submitted">
          <div className="success-message">
            <i className="check-icon"></i>
            <h2>Thank you for your feedback!</h2>
            <p>Your feedback helps us improve our interview process.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="interview-info">
            <h2>Interview Details</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Position</label>
                <span>{application.jobTitle}</span>
              </div>
              <div className="info-item">
                <label>Company</label>
                <span>{application.company}</span>
              </div>
              <div className="info-item">
                <label>Date</label>
                <span>
                  {new Date(application.interview.dateTime).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <label>Type</label>
                <span>{application.interview.type}</span>
              </div>
            </div>
          </div>

          <div className="rating-section">
            <h2>Rate Your Experience</h2>
            
            <div className="rating-group">
              <label>Overall Interview Experience</label>
              <div className="rating-scale">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    type="button"
                    className={`rating-btn ${feedback.overallExperience === num ? 'active' : ''}`}
                    onClick={() => handleRatingChange('overallExperience', num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="scale-labels">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div className="rating-group">
              <label>Interviewer Preparedness</label>
              <div className="rating-scale">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    type="button"
                    className={`rating-btn ${feedback.preparedness === num ? 'active' : ''}`}
                    onClick={() => handleRatingChange('preparedness', num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="scale-labels">
                <span>Unprepared</span>
                <span>Well Prepared</span>
              </div>
            </div>

            <div className="rating-group">
              <label>Question Clarity</label>
              <div className="rating-scale">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    type="button"
                    className={`rating-btn ${feedback.clarity === num ? 'active' : ''}`}
                    onClick={() => handleRatingChange('clarity', num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="scale-labels">
                <span>Unclear</span>
                <span>Very Clear</span>
              </div>
            </div>

            <div className="rating-group">
              <label>Technical Discussion Depth</label>
              <div className="rating-scale">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    type="button"
                    className={`rating-btn ${feedback.technicalDepth === num ? 'active' : ''}`}
                    onClick={() => handleRatingChange('technicalDepth', num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="scale-labels">
                <span>Too Basic</span>
                <span>Just Right</span>
              </div>
            </div>

            <div className="rating-group">
              <label>Company Culture Discussion</label>
              <div className="rating-scale">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    type="button"
                    className={`rating-btn ${feedback.cultureFit === num ? 'active' : ''}`}
                    onClick={() => handleRatingChange('cultureFit', num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="scale-labels">
                <span>Not Discussed</span>
                <span>Well Covered</span>
              </div>
            </div>
          </div>

          <div className="recommendation-section">
            <h2>Would you recommend our company to others?</h2>
            <div className="recommendation-buttons">
              <button
                type="button"
                className={`recommend-btn ${feedback.wouldRecommend === true ? 'active' : ''}`}
                onClick={() => handleRatingChange('wouldRecommend', true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`recommend-btn ${feedback.wouldRecommend === false ? 'active' : ''}`}
                onClick={() => handleRatingChange('wouldRecommend', false)}
              >
                No
              </button>
            </div>
          </div>

          <div className="comments-section">
            <h2>Additional Comments</h2>
            <textarea
              value={feedback.comments}
              onChange={(e) => handleRatingChange('comments', e.target.value)}
              placeholder="Please share any additional thoughts or suggestions about your interview experience..."
              rows={5}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Submit Feedback
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default InterviewFeedbackPage;