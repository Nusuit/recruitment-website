import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobsContext from '../../contexts/JobsContext';
import { formatDate } from '../../utils/formatters';
import Modal from '../common/Modal';

const ApplicationsList = ({ limit, showViewAll = true }) => {
  const { getUserApplications, loading } = useContext(JobsContext);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      // Get user applications
      const userApplications = getUserApplications();
      
      // If limit is provided, slice the array
      const limitedApplications = limit ? userApplications.slice(0, limit) : userApplications;
      
      setApplications(limitedApplications);
      setIsLoading(false);
    };
    
    // Wait for the jobs context to load before fetching applications
    if (!loading) {
      fetchApplications();
    }
  }, [loading, getUserApplications, limit]);
  
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
  
  // Show interview details
  const handleViewInterview = (application) => {
    setSelectedApplication(application);
    setShowInterviewModal(true);
  };
  
  if (isLoading) {
    return <div className="loading-container">Loading applications...</div>;
  }
  
  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <p>You haven't applied to any jobs yet.</p>
        <Link to="/jobs" className="browse-jobs-btn">Browse Open Positions</Link>
      </div>
    );
  }
  
  return (
    <div className="applications-list-component">
      <div className="applications-table">
        <div className="table-header">
          <div className="col-job">Job Position</div>
          <div className="col-date">Applied Date</div>
          <div className="col-status">Status</div>
          <div className="col-actions">Actions</div>
        </div>
        
        {applications.map(application => (
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
                <button 
                  className="interview-details-btn"
                  onClick={() => handleViewInterview(application)}
                >
                  Interview Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showViewAll && applications.length > 0 && (
        <div className="view-all-link">
          <Link to="/applicant/applications">View All Applications</Link>
        </div>
      )}
      
      {/* Interview Details Modal */}
      {showInterviewModal && selectedApplication && (
        <Modal
          title="Interview Details"
          onClose={() => setShowInterviewModal(false)}
        >
          <div className="interview-details">
            <div className="interview-info">
              <h3>{selectedApplication.jobTitle}</h3>
              <p>{selectedApplication.company}</p>
              
              <div className="interview-date">
                <i className="calendar-icon"></i>
                <span>{formatDate(selectedApplication.interviewDate)}</span>
              </div>
              
              <div className="interview-time">
                <i className="time-icon"></i>
                <span>{selectedApplication.interviewTime}</span>
              </div>
              
              <div className="interview-type">
                <i className="type-icon"></i>
                <span>{selectedApplication.interviewType || 'In-person'} Interview</span>
              </div>
              
              {selectedApplication.interviewLocation && (
                <div className="interview-location">
                  <i className="location-icon"></i>
                  <span>{selectedApplication.interviewLocation}</span>
                </div>
              )}
              
              {selectedApplication.interviewLink && (
                <div className="interview-link">
                  <i className="link-icon"></i>
                  <a href={selectedApplication.interviewLink} target="_blank" rel="noopener noreferrer">
                    Join Meeting
                  </a>
                </div>
              )}
              
              {selectedApplication.interviewNotes && (
                <div className="interview-notes">
                  <h4>Additional Notes</h4>
                  <p>{selectedApplication.interviewNotes}</p>
                </div>
              )}
            </div>
            
            <div className="interview-actions">
              <button className="add-calendar-btn">
                Add to Calendar
              </button>
              <button 
                className="reschedule-btn"
                onClick={() => {
                  setShowInterviewModal(false);
                  // In a real app, you would implement a reschedule flow
                  alert('Please contact the recruiter to reschedule the interview.');
                }}
              >
                Request Reschedule
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ApplicationsList;