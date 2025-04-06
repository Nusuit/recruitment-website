import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LatestJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // For now, we'll use sample data
        const sampleJobs = [
          {
            id: 1,
            title: 'Sale Associate',
            company: 'MyaCorp',
            location: 'HCM, Vietnam',
            type: 'Full Time',
            salary: '$5k-8k/month',
            daysRemaining: 4,
            featured: true
          },
          {
            id: 2,
            title: 'Sale Associate',
            company: 'MyaCorp',
            location: 'Da Nang, Vietnam',
            type: 'Full Time',
            salary: '$5k-8k/month',
            daysRemaining: 4
          },
          {
            id: 3,
            title: 'Designer',
            company: 'MyaCorp',
            location: 'Hanoi, Vietnam',
            type: 'Full Time',
            salary: '$7k-9k/month',
            daysRemaining: 6
          },
          {
            id: 4,
            title: 'Designer',
            company: 'MyaCorp',
            location: 'HCM, Vietnam',
            type: 'Remote',
            salary: '$7k-9k/month',
            daysRemaining: 8
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setJobs(sampleJobs);
        setError(null);
      } catch (err) {
        console.error('Error fetching latest jobs:', err);
        setError('Failed to load latest jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLatestJobs();
  }, []);
  
  if (loading) {
    return <div className="loading-container">Loading latest jobs...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="latest-jobs-grid">
      {jobs.map(job => (
        <div key={job.id} className="job-card">
          <div className="job-card-logo">
            {job.featured && <div className="featured-tag">Featured</div>}
            <img src="/assets/images/icons/job-icon.png" alt="Job Icon" />
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
              <span className="deadline-label">{job.daysRemaining} days remaining</span>
            </div>
          </div>
          
          <div className="job-card-actions">
            <button className="save-job-btn">
              <i className="bookmark-icon"></i>
            </button>
            
            <Link to={`/jobs/${job.id}`} className="apply-now-btn">
              Apply Now
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestJobs;