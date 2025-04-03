import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobsContext from '../../contexts/JobsContext';
import JobCard from '../../components/jobs/JobCard';

const SavedJobsPage = () => {
  const { getSavedJobs, loading } = useContext(JobsContext);
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      setIsLoading(true);
      // Get saved jobs from context
      const jobs = getSavedJobs();
      setSavedJobs(jobs);
      setIsLoading(false);
    };

    // Wait for the jobs context to load before fetching saved jobs
    if (!loading) {
      fetchSavedJobs();
    }
  }, [loading, getSavedJobs]);

  // Update saved jobs list when a job is unsaved
  const handleJobUnsaved = (jobId) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  return (
    <div className="saved-jobs-page">
      <h1>Saved Jobs</h1>
      <p className="page-description">
        These are the jobs you've saved. You can apply to them or remove them from your saved list.
      </p>

      {isLoading ? (
        <div className="loading-indicator">Loading saved jobs...</div>
      ) : savedJobs.length === 0 ? (
        <div className="no-saved-jobs">
          <div className="empty-state">
            <i className="bookmark-icon large"></i>
            <h3>No saved jobs yet</h3>
            <p>
              Jobs you save will appear here. Save jobs that interest you to apply to them later.
            </p>
            <Link to="/jobs" className="browse-jobs-btn">
              Browse Jobs
            </Link>
          </div>
        </div>
      ) : (
        <div className="saved-jobs-list">
          {savedJobs.map(job => (
            <div key={job.id} className="saved-job-item">
              <JobCard job={job} onUnsave={handleJobUnsaved} />
              <div className="job-actions">
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
      )}
    </div>
  );
};

export default SavedJobsPage;