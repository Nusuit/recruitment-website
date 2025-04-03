import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobsContext from '../../contexts/JobsContext';
import { formatDate } from '../../utils/formatters';

const SavedJobs = ({ limit, showViewAll = true }) => {
  const { getSavedJobs, toggleSaveJob, loading } = useContext(JobsContext);
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      setIsLoading(true);
      // Get saved jobs from context
      const jobs = getSavedJobs();
      
      // If limit is provided, slice the array
      const limitedJobs = limit ? jobs.slice(0, limit) : jobs;
      
      setSavedJobs(limitedJobs);
      setIsLoading(false);
    };

    // Wait for the jobs context to load before fetching saved jobs
    if (!loading) {
      fetchSavedJobs();
    }
  }, [loading, getSavedJobs, limit]);

  // Handle unsave job
  const handleUnsaveJob = (jobId) => {
    toggleSaveJob(jobId);
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  if (isLoading) {
    return <div className="loading-container">Loading saved jobs...</div>;
  }

  if (savedJobs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3>No saved jobs yet</h3>
        <p>
          Jobs you save will appear here. Save jobs that interest you to apply to them later.
        </p>
        <Link to="/jobs" className="browse-jobs-btn">
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="saved-jobs-component">
      <div className="saved-jobs-list">
        {savedJobs.map(job => (
          <div key={job.id} className="saved-job-card">
            <div className="job-card-content">
              <div className="job-card-header">
                <h3 className="job-title">
                  <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                </h3>
                <button 
                  className="unsave-btn"
                  onClick={() => handleUnsaveJob(job.id)}
                  aria-label="Remove from saved jobs"
                >
                  <i className="bookmark-filled-icon"></i>
                </button>
              </div>
              
              <div className="job-info">
                <span className="company-name">{job.company}</span>
                <span className="job-location">
                  <i className="location-icon"></i>
                  {job.location}
                </span>
                <span className="job-type">{job.type}</span>
              </div>
              
              <div className="job-salary">
                <i className="salary-icon"></i>
                <span>{job.salary}</span>
              </div>
              
              <div className="job-dates">
                <div className="posted-date">
                  <span className="date-label">Posted:</span>
                  <span className="date-value">{formatDate(job.postedDate)}</span>
                </div>
                <div className="deadline">
                  <span className="date-label">Deadline:</span>
                  <span className="date-value">{formatDate(job.deadline)}</span>
                </div>
              </div>
            </div>
            
            <div className="job-card-actions">
              <Link to={`/jobs/${job.id}`} className="view-details-btn">
                View Details
              </Link>
              <Link to={`/jobs/${job.id}/apply`} className="apply-now-btn">
                Apply Now
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {showViewAll && savedJobs.length > 0 && (
        <div className="view-all-link">
          <Link to="/applicant/saved-jobs">View All Saved Jobs</Link>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;