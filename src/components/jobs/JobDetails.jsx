import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import JobsContext from '../../contexts/JobsContext';
import Modal from '../common/Modal';
import ApplyForm from './ApplyForm';
import { formatDate } from '../../utils/formatters';

const JobDetails = ({ job, showApplyButton = true }) => {
  const { user } = useContext(AuthContext);
  const { isJobSaved, toggleSaveJob, hasAppliedToJob } = useContext(JobsContext);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSaved, setIsSaved] = useState(isJobSaved(job.id));
  const [hasApplied, setHasApplied] = useState(hasAppliedToJob(job.id));

  // Parse lists from text with line breaks
  const parseList = (text) => {
    if (!text) return [];
    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  const responsibilities = parseList(job.responsibilities);
  const requirements = parseList(job.requirements);
  const benefits = parseList(job.benefits);

  // Parse skills as array
  const skills = job.skills ? job.skills.split(',').map(skill => skill.trim()) : [];

  // Handle save job toggle
  const handleSaveJob = () => {
    toggleSaveJob(job.id);
    setIsSaved(!isSaved);
  };

  // Handle apply click
  const handleApplyClick = () => {
    if (!user) {
      // If not logged in, redirect to login page
      window.location.href = `/login?redirect=/jobs/${job.id}`;
    } else {
      setShowApplyModal(true);
    }
  };

  // Handle application submission
  const handleApplySubmit = (formData) => {
    // In a real app, formData would be sent to an API
    console.log('Application submitted:', formData);
    setShowApplyModal(false);
    setHasApplied(true);
    // Show success message or redirect
  };

  return (
    <div className="job-details">
      <div className="job-header">
        <div className="job-title-section">
          <div className="job-company-logo">
            <img src="/assets/images/logo.png" alt={job.company} />
          </div>
          <div className="job-title-info">
            <h1>{job.title}</h1>
            <div className="job-meta">
              <span className="company-name">{job.company}</span>
              <span className="job-location">
                <i className="location-icon"></i>
                {job.location}
              </span>
              <span className="job-type">{job.type}</span>
              <span className="job-posted">Posted: {formatDate(job.postedDate)}</span>
            </div>
          </div>
        </div>
        
        {showApplyButton && (
          <div className="job-actions">
            <button 
              className={`save-job-btn ${isSaved ? 'saved' : ''}`}
              onClick={handleSaveJob}
            >
              <i className={`bookmark-icon ${isSaved ? 'filled' : ''}`}></i>
              {isSaved ? 'Saved' : 'Save Job'}
            </button>
            
            {hasApplied ? (
              <button className="already-applied-btn" disabled>
                Applied
              </button>
            ) : (
              <button 
                className="apply-now-btn"
                onClick={handleApplyClick}
              >
                Apply Now
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="job-content">
        <div className="job-main-content">
          <div className="job-description">
            <h2>Job Description</h2>
            <div dangerouslySetInnerHTML={{ __html: job.description }} />
          </div>
          
          {responsibilities.length > 0 && (
            <div className="job-responsibilities">
              <h2>Responsibilities</h2>
              <ul>
                {responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>
          )}
          
          {requirements.length > 0 && (
            <div className="job-requirements">
              <h2>Requirements</h2>
              <ul>
                {requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          )}
          
          {benefits.length > 0 && (
            <div className="job-benefits">
              <h2>Benefits</h2>
              <ul>
                {benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
          
          {skills.length > 0 && (
            <div className="skills-required">
              <h2>Skills</h2>
              <div className="skills-list">
                {skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="job-sidebar">
          <div className="job-overview">
            <h3>Job Overview</h3>
            <ul className="job-overview-list">
              <li>
                <i className="industry-icon"></i>
                <div>
                  <span className="label">Industry</span>
                  <span className="value">{job.industry || 'Fashion / Retail'}</span>
                </div>
              </li>
              <li>
                <i className="experience-icon"></i>
                <div>
                  <span className="label">Experience</span>
                  <span className="value">{job.experience}</span>
                </div>
              </li>
              <li>
                <i className="education-icon"></i>
                <div>
                  <span className="label">Education</span>
                  <span className="value">{job.education}</span>
                </div>
              </li>
              <li>
                <i className="salary-icon"></i>
                <div>
                  <span className="label">Salary</span>
                  <span className="value">{job.salary}</span>
                </div>
              </li>
              <li>
                <i className="deadline-icon"></i>
                <div>
                  <span className="label">Deadline</span>
                  <span className="value">{formatDate(job.deadline)}</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="company-overview">
            <h3>Company Info</h3>
            <div className="company-logo">
              <img src="/assets/images/logo.png" alt={job.company} />
            </div>
            <h4>{job.company}</h4>
            <p>MyaCorp is a leading fashion retailer specializing in high-quality apparel and accessories.</p>
            <Link to="/about" className="view-company-btn">View Company Profile</Link>
          </div>
        </div>
      </div>
      
      {/* Apply Form Modal */}
      {showApplyModal && (
        <Modal 
          title={`Apply for ${job.title}`}
          onClose={() => setShowApplyModal(false)}
        >
          <ApplyForm 
            jobId={job.id} 
            jobTitle={job.title}
            onSubmit={handleApplySubmit}
          />
        </Modal>
      )}
    </div>
  );
};

export default JobDetails;