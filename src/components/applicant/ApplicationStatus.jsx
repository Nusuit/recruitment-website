import React from 'react';

const ApplicationStatus = ({ status }) => {
  // Define status steps in order
  const statusSteps = [
    'Pending Review',
    'Shortlisted',
    'Interview Scheduled',
    'Hired'
  ];
  
  // Check if application was rejected
  const isRejected = status.toLowerCase() === 'rejected';
  
  // Find the current status index
  const currentIndex = statusSteps.findIndex(
    step => step.toLowerCase() === status.toLowerCase()
  );
  
  // If status not found in steps (and not rejected), default to first step
  const activeIndex = currentIndex === -1 ? (isRejected ? -1 : 0) : currentIndex;
  
  return (
    <div className={`application-status-tracker ${isRejected ? 'rejected' : ''}`}>
      <div className="status-title">
        <h3>Application Status</h3>
        {isRejected && (
          <span className="status-badge status-rejected">Not Selected</span>
        )}
      </div>
      
      <div className="status-steps">
        {statusSteps.map((step, index) => {
          // Determine step state
          let stepStatus = 'incomplete';
          
          if (!isRejected) {
            if (index < activeIndex) {
              stepStatus = 'completed';
            } else if (index === activeIndex) {
              stepStatus = 'active';
            }
          }
          
          return (
            <div key={index} className="status-step-container">
              <div className={`status-step ${stepStatus}`}>
                <div className="step-indicator">
                  {index < activeIndex ? '✓' : index + 1}
                </div>
                <div className="step-label">{step}</div>
              </div>
              
              {/* Connector line between steps (except after the last step) */}
              {index < statusSteps.length - 1 && (
                <div className={`step-connector ${
                  index < activeIndex ? 'completed' : ''
                }`}></div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="status-description">
        {isRejected ? (
          <p className="rejected-message">
            Thank you for your interest in our company. While we were impressed with your qualifications,
            we have decided to move forward with other candidates whose skills better match our current needs.
          </p>
        ) : (
          <>
            <h4>What's Next?</h4>
            {activeIndex === 0 && (
              <p>
                Your application is being reviewed by our hiring team. This process typically takes 3-5 business days.
              </p>
            )}
            {activeIndex === 1 && (
              <p>
                Congratulations! Your application has been shortlisted. Our team will reach out
                to schedule an interview soon.
              </p>
            )}
            {activeIndex === 2 && (
              <p>
                Your interview has been scheduled. Please check your email for details
                and prepare accordingly.
              </p>
            )}
            {activeIndex === 3 && (
              <p>
                Congratulations! You've been selected for the position. Our HR team will
                contact you soon with next steps.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatus;