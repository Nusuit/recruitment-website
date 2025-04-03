import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../../api/jobs';

const LatestJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setLoading(true);
        
        // Get latest jobs, limit to 4
        const response = await getJobs({ 
          limit: 4, 
          sort: 'latest',
          status: 'active'
        });
        
        if (response.success) {
          setJobs(response.jobs);
        } else {
          setError(response.error);
        }
      } catch (err) {
        console.error('Error fetching latest jobs:', err);
        setError('Failed to load latest jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLatestJobs();
  }, []);
  
  // Fallback data if API call fails
  const sampleJobs = [
    {
      id: 1,
      title: 'Sales Associate',
      company: 'MyaCorp',
      location: 'HCM, Vietnam',
      type: 'Full Time',
      salary: '$1800 - $2200',
      postedDate: '2025-03-28',
      daysRemaining: 14
    },
    {
      id: 2,
      title: 'Fashion Designer',
      company: 'MyaCorp',
      location: 'Remote',
      type: 'Contract',
      salary: '$2500 - $3500',
      postedDate: '2025-03-27',
      daysRemaining: 10
    },
    {
      id: 3,
      title: 'Marketing Specialist',
      company: 'MyaCorp',
      location: 'HCM, Vietnam',
      type: 'Full Time',
      salary: '$2200 - $2800',
      postedDate: '2025-03-25',
      daysRemaining: 12
    },
    {
      id: 4,
      title: 'Store Manager',
      company: 'MyaCorp',
      location: 'Hanoi, Vietnam',
      type: 'Full Time',
      salary: '$2800 - $3500',
      postedDate: '2025-03-22',
      daysRemaining: 8
    }
  ];
  
  const displayJobs = jobs.length > 0 ? jobs : sampleJobs;
  
  if (loading) {
    return <div className="loading-container">Loading latest jobs...</div>;
  }
  
  return (
    <div className="latest-jobs-grid">
      {displayJobs.map(job => (
        <div key={job.id} className="job-card">
          <div className="job-card-header">
            <h3 className="job-title">
              <Link to={`/jobs/${job.id}`}>{job.title}</Link>
            </h3>
            <span className="job-type">{job.type}</span>
          </div>
          
          <div className="job-details">
            <div className="job-meta">
              <span className="job-company">{job.company}</span>
              <span className="job-location">
                <i className="location-icon"></i>
                {job.location}
              </span>
            </div>
            
            <div className="job-salary">
              <i className="salary-icon"></i>
              <span>{job.salary}</span>
            </div>
          </div>
          
          <div className="job-card-footer">
            <span className="job-deadline">
              {job.daysRemaining} days remaining
            </span>
            
            <Link to={`/jobs/${job.id}`} className="view-details-btn">
              Apply Now
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestJobs;