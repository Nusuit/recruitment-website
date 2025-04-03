import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const [isSaved, setIsSaved] = useState(false);
  
  const handleSaveJob = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    // In a real app, you would call an API to save/unsave job
  };
  
  return (
    <div className="job-card">
      <div className="job-card-logo">
        <img src={`/assets/images/company-logos/${job.company.toLowerCase().replace(' ', '-')}.png`} alt={job.company} />
      </div>
      
      <div className="job-card-content">
        <h3 className="job-title">
          <Link to={`/jobs/${job.id}`}>{job.title}</Link>
        </h3>
        
        <div className="job-info">
          <div className="job-meta">
            <span className="company">{job.company}</span>
            <span className="location">
              <i className="location-icon"></i>
              {job.location}
            </span>
            <span className="job-type">{job.type}</span>
          </div>
          
          <div className="job-salary">
            <i className="salary-icon"></i>
            <span>{job.salary}</span>
          </div>
        </div>
        
        <div className="job-deadline">
          <span className="deadline-label">{job.daysRemaining} Days Remaining</span>
        </div>
      </div>
      
      <div className="job-card-actions">
        <button 
          className={`save-job-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleSaveJob}
          aria-label={isSaved ? 'Unsave Job' : 'Save Job'}
        >
          <i className={`bookmark-icon ${isSaved ? 'filled' : ''}`}></i>
        </button>
        
        <Link to={`/jobs/${job.id}`} className="apply-now-btn">
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default JobCard;