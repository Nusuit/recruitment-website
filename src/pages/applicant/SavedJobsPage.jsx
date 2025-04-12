import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { candidateAPI } from '../../api/candidate';
import JobCard from '../../components/jobs/JobCard';
import EmptyState from '../../components/common/EmptyState';

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    location: '',
    sortBy: 'date'
  });

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        const response = await candidateAPI.getJobs({ saved: true });
        setSavedJobs(response.jobs);
        setError(null);
      } catch (err) {
        setError('Failed to fetch saved jobs. Please try again.');
        console.error('Error fetching saved jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleUnsaveJob = async (jobId) => {
    try {
      await candidateAPI.unsaveJob(jobId);
      setSavedJobs(jobs => jobs.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error removing job from saved:', err);
      alert('Failed to remove job from saved. Please try again.');
    }
  };

  const filteredJobs = savedJobs.filter(job => {
    if (filters.type !== 'all' && job.type !== filters.type) {
      return false;
    }
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    return true;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (filters.sortBy) {
      case 'deadline':
        return new Date(a.deadline) - new Date(b.deadline);
      case 'salary':
        return b.salaryMax - a.salaryMax;
      default: // date
        return new Date(b.savedAt) - new Date(a.savedAt);
    }
  });

  if (loading) {
    return <div className="loading-indicator">Loading saved jobs...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="saved-jobs-page">
      <div className="page-header">
        <h1>Saved Jobs</h1>
        <p>Track and manage your bookmarked job opportunities</p>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState
          icon="bookmark"
          title="No saved jobs yet"
          description="Jobs you save will appear here. Save jobs that interest you to apply to them later."
          action={
            <Link to="/jobs" className="browse-jobs-btn">
              Browse Jobs
            </Link>
          }
        />
      ) : (
        <>
          <div className="filters-section">
            <div className="filters-row">
              <div className="filter-group">
                <label htmlFor="type">Job Type</label>
                <select
                  id="type"
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                >
                  <option value="all">All Types</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  placeholder="Filter by location..."
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>

              <div className="filter-group">
                <label htmlFor="sortBy">Sort By</label>
                <select
                  id="sortBy"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                >
                  <option value="date">Save Date</option>
                  <option value="deadline">Application Deadline</option>
                  <option value="salary">Salary</option>
                </select>
              </div>
            </div>
          </div>

          <div className="saved-jobs-grid">
            {sortedJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onUnsave={() => handleUnsaveJob(job.id)}
                showSaveButton
                saved
              />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="no-results">
              <p>No jobs match your current filters.</p>
              <button 
                onClick={() => setFilters({ type: 'all', location: '', sortBy: 'date' })}
                className="clear-filters-btn"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedJobsPage;