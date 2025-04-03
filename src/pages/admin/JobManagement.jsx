import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../components/common/Modal';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Sample job data
  const sampleJobs = [
    {
      id: 1,
      title: 'Fashion Designer',
      location: 'HCM, Vietnam',
      type: 'Full Time',
      applications: 28,
      postedDate: '2025-03-20',
      deadline: '2025-04-20',
      status: 'active',
      daysRemaining: 12
    },
    {
      id: 2,
      title: 'Store Manager',
      location: 'Hanoi, Vietnam',
      type: 'Full Time',
      applications: 15,
      postedDate: '2025-03-18',
      deadline: '2025-04-18',
      status: 'active',
      daysRemaining: 10
    },
    {
      id: 3,
      title: 'Marketing Specialist',
      location: 'HCM, Vietnam',
      type: 'Remote',
      applications: 42,
      postedDate: '2025-03-15',
      deadline: '2025-04-15',
      status: 'active',
      daysRemaining: 7
    },
    {
      id: 4,
      title: 'Sales Associate',
      location: 'Danang, Vietnam',
      type: 'Part Time',
      applications: 19,
      postedDate: '2025-03-22',
      deadline: '2025-04-22',
      status: 'active',
      daysRemaining: 14
    },
    {
      id: 5,
      title: 'Merchandiser',
      location: 'HCM, Vietnam',
      type: 'Full Time',
      applications: 21,
      postedDate: '2025-02-25',
      deadline: '2025-03-25',
      status: 'expired',
      daysRemaining: 0
    },
    {
      id: 6,
      title: 'Visual Designer',
      location: 'HCM, Vietnam',
      type: 'Contract',
      applications: 35,
      postedDate: '2025-03-05',
      deadline: '2025-04-05',
      status: 'expired',
      daysRemaining: 0
    },
    {
      id: 7,
      title: 'Warehouse Manager',
      location: 'Hanoi, Vietnam',
      type: 'Full Time',
      applications: 12,
      postedDate: '2025-03-10',
      deadline: '2025-04-10',
      status: 'paused',
      daysRemaining: 2
    }
  ];

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Set sample data
        setJobs(sampleJobs);
        setError(null);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  // Filter and sort jobs
  const filteredJobs = jobs.filter(job => {
    // Search filter
    const matchesSearch = 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      filterStatus === 'all' || 
      job.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.postedDate) - new Date(a.postedDate);
      case 'oldest':
        return new Date(a.postedDate) - new Date(b.postedDate);
      case 'a-z':
        return a.title.localeCompare(b.title);
      case 'z-a':
        return b.title.localeCompare(a.title);
      case 'most-applications':
        return b.applications - a.applications;
      case 'expiring-soon':
        return a.daysRemaining - b.daysRemaining;
      default:
        return 0;
    }
  });

  // Handle job status update
  const handleStatusChange = (jobId, newStatus) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: newStatus } 
        : job
    ));
  };

  // Handle job deletion
  const handleDeleteJob = () => {
    if (selectedJob) {
      setJobs(jobs.filter(job => job.id !== selectedJob.id));
      setShowDeleteModal(false);
      setSelectedJob(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'paused':
        return 'status-paused';
      case 'expired':
        return 'status-expired';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading-container">Loading jobs...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="job-management-page">
      <div className="page-header">
        <h1>Job Management</h1>
        <Link to="/admin/jobs/create" className="create-job-btn">
          Post New Job
        </Link>
      </div>
      
      <div className="job-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search jobs by title or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="filter-options">
          <div className="status-filter">
            <label>Status:</label>
            <select 
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          
          <div className="sort-filter">
            <label>Sort By:</label>
            <select 
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
              <option value="most-applications">Most Applications</option>
              <option value="expiring-soon">Expiring Soon</option>
            </select>
          </div>
        </div>
      </div>
      
      {sortedJobs.length === 0 ? (
        <div className="no-jobs">
          <div className="empty-state">
            <i className="jobs-icon large"></i>
            <h3>No jobs found</h3>
            <p>
              {search || filterStatus !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'You haven\'t posted any jobs yet'
              }
            </p>
            <Link to="/admin/jobs/create" className="post-job-btn">
              Post Your First Job
            </Link>
          </div>
        </div>
      ) : (
        <div className="jobs-table">
          <div className="table-header">
            <div className="col-job">Job Position</div>
            <div className="col-applications">Applications</div>
            <div className="col-dates">Dates</div>
            <div className="col-status">Status</div>
            <div className="col-actions">Actions</div>
          </div>
          
          {sortedJobs.map(job => (
            <div key={job.id} className="job-row">
              <div className="col-job">
                <h3>{job.title}</h3>
                <div className="job-meta">
                  <span className="job-location">{job.location}</span>
                  <span className="job-type">{job.type}</span>
                </div>
              </div>
              
              <div className="col-applications">
                <Link to={`/admin/jobs/${job.id}/applications`} className="applications-link">
                  {job.applications} applications
                </Link>
              </div>
              
              <div className="col-dates">
                <div className="posted-date">
                  <span className="date-label">Posted:</span>
                  <span className="date-value">{formatDate(job.postedDate)}</span>
                </div>
                <div className="deadline-date">
                  <span className="date-label">Deadline:</span>
                  <span className="date-value">{formatDate(job.deadline)}</span>
                </div>
                <div className="days-remaining">
                  {job.status === 'active' && job.daysRemaining > 0 ? (
                    <span className={job.daysRemaining < 7 ? 'expiring-soon' : ''}>
                      {job.daysRemaining} days remaining
                    </span>
                  ) : (
                    <span className="expired">Expired</span>
                  )}
                </div>
              </div>
              
              <div className="col-status">
                <span className={`status-badge ${getStatusBadgeClass(job.status)}`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
                
                <div className="status-actions">
                  {job.status === 'active' && (
                    <button 
                      className="pause-btn"
                      onClick={() => handleStatusChange(job.id, 'paused')}
                    >
                      Pause
                    </button>
                  )}
                  
                  {job.status === 'paused' && (
                    <button 
                      className="activate-btn"
                      onClick={() => handleStatusChange(job.id, 'active')}
                    >
                      Activate
                    </button>
                  )}
                  
                  {job.status === 'expired' && (
                    <button 
                      className="renew-btn"
                      onClick={() => handleStatusChange(job.id, 'active')}
                    >
                      Renew
                    </button>
                  )}
                </div>
              </div>
              
              <div className="col-actions">
                <Link to={`/admin/jobs/${job.id}`} className="view-btn">
                  View
                </Link>
                <Link to={`/admin/jobs/${job.id}/edit`} className="edit-btn">
                  Edit
                </Link>
                <button 
                  className="delete-btn"
                  onClick={() => {
                    setSelectedJob(job);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showDeleteModal && selectedJob && (
        <Modal
          title="Delete Job Posting"
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="delete-job-modal">
            <p>
              Are you sure you want to delete the job posting for
              <strong> {selectedJob.title}</strong>?
            </p>
            <p>This action cannot be undone and all applications will be deleted.</p>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-btn"
                onClick={handleDeleteJob}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default JobManagement