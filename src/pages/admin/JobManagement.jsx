import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterAPI } from '../../api/recruiter';

const JobManagementPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, expired, draft
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await recruiterAPI.getJobs();
        setJobs(response.jobs);
        setError(null);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await recruiterAPI.deleteJob(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job. Please try again.');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="job-management-page">
      <div className="page-header">
        <h1>Job Management</h1>
        <Link to="/recruiter/jobs/new" className="create-job-btn">
          Post New Job
        </Link>
      </div>

      <div className="jobs-toolbar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Jobs
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === 'expired' ? 'active' : ''}`}
            onClick={() => setFilter('expired')}
          >
            Expired
          </button>
          <button
            className={`filter-btn ${filter === 'draft' ? 'active' : ''}`}
            onClick={() => setFilter('draft')}
          >
            Drafts
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">Loading jobs...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredJobs.length === 0 ? (
        <div className="no-jobs">
          <p>No jobs found.</p>
          <Link to="/recruiter/jobs/new" className="create-job-btn">
            Create Your First Job Post
          </Link>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-status">
                <span className={`status-badge ${job.status}`}>
                  {job.status}
                </span>
                <span className="applications-count">
                  {job.applicationsCount} applications
                </span>
              </div>

              <h3>{job.title}</h3>
              <div className="job-info">
                <span className="location">{job.location}</span>
                <span className="type">{job.type}</span>
              </div>

              <div className="job-dates">
                <div>
                  Posted: {new Date(job.postedDate).toLocaleDateString()}
                </div>
                <div>
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </div>
              </div>

              <div className="job-actions">
                <Link 
                  to={`/recruiter/jobs/${job.id}/applications`}
                  className="view-applications-btn"
                >
                  View Applications
                </Link>
                <Link 
                  to={`/recruiter/jobs/${job.id}/edit`}
                  className="edit-job-btn"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDeleteJob(job.id)}
                  className="delete-job-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobManagementPage;