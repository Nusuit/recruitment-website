import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { recruiterAPI } from '../../../api/recruiter';
import { formatDate } from '../../../utils/formatters';

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Fetch job details and applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobResponse, applicationsResponse] = await Promise.all([
          recruiterAPI.getJobDetail(jobId),
          recruiterAPI.getJobApplications(jobId)
        ]);

        setJob(jobResponse.job);
        setApplications(applicationsResponse.applications);
        setError(null);
      } catch (err) {
        setError('Failed to fetch job data. Please try again.');
        console.error('Error fetching job data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await recruiterAPI.updateApplicationStatus(applicationId, newStatus);
      
      // Update local state
      setApplications(apps => 
        apps.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      setShowStatusModal(false);
      setSelectedApplication(null);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update application status. Please try again.');
    }
  };

  const handleAddNote = async (applicationId, note) => {
    try {
      await recruiterAPI.addApplicationNote(applicationId, note);
      
      // Update local state
      setApplications(apps => 
        apps.map(app => 
          app.id === applicationId ? { ...app, note } : app
        )
      );
    } catch (err) {
      console.error('Error adding note:', err);
      alert('Failed to add note. Please try again.');
    }
  };

  // Filter applications by status
  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status.toLowerCase() === statusFilter.toLowerCase());

  if (loading) {
    return <div className="loading-indicator">Loading job details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!job) {
    return <div className="not-found">Job not found</div>;
  }

  return (
    <div className="job-details-page">
      <div className="page-header">
        <div className="header-content">
          <h1>{job.title}</h1>
          <div className="job-meta">
            <span className="location">{job.location}</span>
            <span className="type">{job.type}</span>
            <span className="status">{job.status}</span>
          </div>
        </div>
        
        <div className="header-actions">
          <Link 
            to={`/recruiter/jobs/${jobId}/edit`}
            className="edit-job-btn"
          >
            Edit Job
          </Link>
        </div>
      </div>

      <div className="job-content">
        <div className="job-info-section">
          <h2>Job Details</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Department:</span>
              <span className="value">{job.department}</span>
            </div>
            <div className="info-item">
              <span className="label">Experience Required:</span>
              <span className="value">{job.experience}</span>
            </div>
            <div className="info-item">
              <span className="label">Salary Range:</span>
              <span className="value">{job.salary}</span>
            </div>
            <div className="info-item">
              <span className="label">Posted Date:</span>
              <span className="value">{formatDate(job.postedDate)}</span>
            </div>
            <div className="info-item">
              <span className="label">Application Deadline:</span>
              <span className="value">{formatDate(job.deadline)}</span>
            </div>
            <div className="info-item">
              <span className="label">Total Applications:</span>
              <span className="value">{applications.length}</span>
            </div>
          </div>
        </div>

        <div className="applications-section">
          <div className="section-header">
            <h2>Applications</h2>
            <div className="filter-tabs">
              <button 
                className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'shortlisted' ? 'active' : ''}`}
                onClick={() => setStatusFilter('shortlisted')}
              >
                Shortlisted
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'interviewing' ? 'active' : ''}`}
                onClick={() => setStatusFilter('interviewing')}
              >
                Interviewing
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'hired' ? 'active' : ''}`}
                onClick={() => setStatusFilter('hired')}
              >
                Hired
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
                onClick={() => setStatusFilter('rejected')}
              >
                Rejected
              </button>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="no-applications">
              <p>No applications found</p>
            </div>
          ) : (
            <div className="applications-table">
              <div className="table-header">
                <div className="col-applicant">Applicant</div>
                <div className="col-submitted">Submitted</div>
                <div className="col-status">Status</div>
                <div className="col-actions">Actions</div>
              </div>

              {filteredApplications.map(application => (
                <div key={application.id} className="application-row">
                  <div className="col-applicant">
                    <div className="applicant-name">{application.applicantName}</div>
                    <div className="applicant-email">{application.email}</div>
                  </div>

                  <div className="col-submitted">
                    {formatDate(application.submittedAt)}
                  </div>

                  <div className="col-status">
                    <span className={`status-badge ${application.status.toLowerCase()}`}>
                      {application.status}
                    </span>
                  </div>

                  <div className="col-actions">
                    <Link 
                      to={`/recruiter/applications/${application.id}`}
                      className="view-btn"
                    >
                      View Details
                    </Link>
                    <button 
                      className="change-status-btn"
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowStatusModal(true);
                      }}
                    >
                      Change Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showStatusModal && selectedApplication && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Application Status</h3>
            <div className="status-options">
              {['Pending', 'Shortlisted', 'Interviewing', 'Hired', 'Rejected'].map(status => (
                <button
                  key={status}
                  className={`status-option ${selectedApplication.status === status ? 'active' : ''}`}
                  onClick={() => handleUpdateStatus(selectedApplication.id, status)}
                >
                  {status}
                </button>
              ))}
            </div>
            <button 
              className="close-btn"
              onClick={() => setShowStatusModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;