import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../components/common/Modal';

const ApplicantsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterJob, setFilterJob] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [jobs, setJobs] = useState([]);
  
  // Sample applications data
  const sampleApplications = [
    {
      id: 101,
      applicantName: 'Nguyen Van A',
      email: 'nguyenvana@example.com',
      phone: '+84 123 456 789',
      jobId: 1,
      jobTitle: 'Fashion Designer',
      appliedDate: '2025-03-27',
      status: 'Pending Review',
      resume: 'resume_101.pdf',
      coverLetter: 'I am applying for the Fashion Designer position...',
      education: 'Bachelor in Fashion Design',
      experience: '3 years in luxury fashion design'
    },
    {
      id: 102,
      applicantName: 'Tran Thi B',
      email: 'tranthib@example.com',
      phone: '+84 234 567 890',
      jobId: 2,
      jobTitle: 'Store Manager',
      appliedDate: '2025-03-26',
      status: 'Shortlisted',
      resume: 'resume_102.pdf',
      coverLetter: 'With my extensive retail management experience...',
      education: 'MBA in Retail Management',
      experience: '5 years in fashion retail'
    },
    {
      id: 103,
      applicantName: 'Le Van C',
      email: 'levanc@example.com',
      phone: '+84 345 678 901',
      jobId: 3,
      jobTitle: 'Marketing Specialist',
      appliedDate: '2025-03-25',
      status: 'Interview Scheduled',
      resume: 'resume_103.pdf',
      coverLetter: 'I am excited to apply for the Marketing Specialist role...',
      education: 'Bachelor in Marketing',
      experience: '4 years in digital marketing'
    },
    {
      id: 104,
      applicantName: 'Pham Thi D',
      email: 'phamthid@example.com',
      phone: '+84 456 789 012',
      jobId: 4,
      jobTitle: 'Sales Associate',
      appliedDate: '2025-03-24',
      status: 'Pending Review',
      resume: 'resume_104.pdf',
      coverLetter: 'I would like to apply for the Sales Associate position...',
      education: 'High School Diploma',
      experience: '2 years in retail sales'
    },
    {
      id: 105,
      applicantName: 'Hoang Van E',
      email: 'hoangvane@example.com',
      phone: '+84 567 890 123',
      jobId: 1,
      jobTitle: 'Fashion Designer',
      appliedDate: '2025-03-23',
      status: 'Shortlisted',
      resume: 'resume_105.pdf',
      coverLetter: 'I am a passionate fashion designer with experience...',
      education: 'Master in Fashion Design',
      experience: '6 years in high-end fashion'
    },
    {
      id: 106,
      applicantName: 'Nguyen Thi F',
      email: 'nguyenthif@example.com',
      phone: '+84 678 901 234',
      jobId: 3,
      jobTitle: 'Marketing Specialist',
      appliedDate: '2025-03-22',
      status: 'Rejected',
      resume: 'resume_106.pdf',
      coverLetter: 'I am applying for the Marketing Specialist position...',
      education: 'Bachelor in Business Administration',
      experience: '2 years in marketing'
    },
    {
      id: 107,
      applicantName: 'Tran Van G',
      email: 'tranvang@example.com',
      phone: '+84 789 012 345',
      jobId: 2,
      jobTitle: 'Store Manager',
      appliedDate: '2025-03-21',
      status: 'Hired',
      resume: 'resume_107.pdf',
      coverLetter: 'I am excited to apply for the Store Manager position...',
      education: 'Bachelor in Business Management',
      experience: '7 years in retail management'
    }
  ];
  
  // Sample jobs for filter dropdown
  const sampleJobs = [
    { id: 1, title: 'Fashion Designer' },
    { id: 2, title: 'Store Manager' },
    { id: 3, title: 'Marketing Specialist' },
    { id: 4, title: 'Sales Associate' }
  ];

  // Fetch applications and jobs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Set sample data
        setApplications(sampleApplications);
        setJobs(sampleJobs);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter and sort applications
  const filteredApplications = applications.filter(app => {
    // Search filter
    const matchesSearch = 
      app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      filterStatus === 'all' || 
      app.status.toLowerCase() === filterStatus.toLowerCase();
    
    // Job filter
    const matchesJob = 
      filterJob === 'all' || 
      app.jobId === parseInt(filterJob);
    
    return matchesSearch && matchesStatus && matchesJob;
  });

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.appliedDate) - new Date(a.appliedDate);
      case 'oldest':
        return new Date(a.appliedDate) - new Date(b.appliedDate);
      case 'a-z':
        return a.applicantName.localeCompare(b.applicantName);
      case 'z-a':
        return b.applicantName.localeCompare(a.applicantName);
      default:
        return 0;
    }
  });

  // Handle application status update
  const handleUpdateStatus = () => {
    if (selectedApplication && newStatus) {
      setApplications(applications.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, status: newStatus } 
          : app
      ));
      setShowStatusModal(false);
      setSelectedApplication(null);
      setNewStatus('');
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
        return '';
    }
  };

  if (loading) {
    return <div className="loading-container">Loading applications...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="applicants-management-page">
      <div className="page-header">
        <h1>Applicants Management</h1>
      </div>
      
      <div className="applicants-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, email, or job title..."
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
              <option value="all">All Statuses</option>
              <option value="pending review">Pending Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview scheduled">Interview Scheduled</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>
          
          <div className="job-filter">
            <label>Job:</label>
            <select 
              value={filterJob}
              onChange={e => setFilterJob(e.target.value)}
            >
              <option value="all">All Jobs</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
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
            </select>
          </div>
        </div>
      </div>
      
      {sortedApplications.length === 0 ? (
        <div className="no-applications">
          <div className="empty-state">
            <i className="applications-icon large"></i>
            <h3>No applications found</h3>
            <p>
              {search || filterStatus !== 'all' || filterJob !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'You haven\'t received any applications yet'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="applications-table">
          <div className="table-header">
            <div className="col-applicant">Applicant</div>
            <div className="col-job">Job Position</div>
            <div className="col-date">Applied Date</div>
            <div className="col-status">Status</div>
            <div className="col-actions">Actions</div>
          </div>
          
          {sortedApplications.map(application => (
            <div key={application.id} className="application-row">
              <div className="col-applicant">
                <h3>{application.applicantName}</h3>
                <div className="applicant-meta">
                  <span className="applicant-email">{application.email}</span>
                  <span className="applicant-phone">{application.phone}</span>
                </div>
              </div>
              
              <div className="col-job">
                <Link to={`/admin/jobs/${application.jobId}`}>
                  {application.jobTitle}
                </Link>
              </div>
              
              <div className="col-date">
                {formatDate(application.appliedDate)}
              </div>
              
              <div className="col-status">
                <span className={`status-badge ${getStatusBadgeClass(application.status)}`}>
                  {application.status}
                </span>
              </div>
              
              <div className="col-actions">
                <Link to={`/admin/applicants/${application.id}`} className="view-btn">
                  View
                </Link>
                <button 
                  className="change-status-btn"
                  onClick={() => {
                    setSelectedApplication(application);
                    setNewStatus(application.status);
                    setShowStatusModal(true);
                  }}
                >
                  Change Status
                </button>
                <button className="download-resume-btn">
                  Download Resume
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showStatusModal && selectedApplication && (
        <Modal
          title="Update Application Status"
          onClose={() => setShowStatusModal(false)}
        >
          <div className="update-status-modal">
            <p>
              Update status for <strong>{selectedApplication.applicantName}</strong> 
              applying for <strong>{selectedApplication.jobTitle}</strong>
            </p>
            
            <div className="form-group">
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
              >
                <option value="Pending Review">Pending Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Rejected">Rejected</option>
                <option value="Hired">Hired</option>
              </select>
            </div>
            
            {newStatus === 'Interview Scheduled' && (
              <div className="form-group">
                <label htmlFor="interviewDate">Interview Date:</label>
                <input
                  type="datetime-local"
                  id="interviewDate"
                />
              </div>
            )}
            
            {newStatus === 'Rejected' && (
              <div className="form-group">
                <label htmlFor="rejectionReason">Reason (Optional):</label>
                <textarea
                  id="rejectionReason"
                  rows="3"
                  placeholder="Enter reason for rejection"
                ></textarea>
              </div>
            )}
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </button>
              <button 
                className="update-btn"
                onClick={handleUpdateStatus}
              >
                Update Status
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ApplicantsManagement;