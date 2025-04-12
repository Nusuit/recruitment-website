import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import ApplyForm from '../../components/jobs/ApplyForm';
import Modal from '../../components/common/Modal';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Sample job data (in a real app, this would come from an API)
  const sampleJob = {
    id: 1,
    title: 'Sale Associate',
    company: 'MyaCorp',
    location: 'HCM, Vietnam',
    type: 'Full Time',
    salary: '$2000 - $2500',
    experience: '1-3 Years',
    education: 'Bachelor Degree',
    postedDate: '2025-03-10',
    deadline: '2025-04-10',
    daysRemaining: 7,
    description: `
      <p>As a Sale Associate at MyaCorp, you'll be responsible for providing exceptional customer service and driving sales in our fashion retail environment.</p>
      
      <p>You'll work with high-end clothing brands and help customers find the perfect items to match their style and preferences.</p>
    `,
    responsibilities: [
      'Greet customers and ascertain their needs and wants',
      'Recommend and display merchandise to customers based on their needs and preferences',
      'Maintain knowledge of current fashion trends, promotions, and policies regarding payment and exchanges',
      'Process cash, credit, and debit card transactions',
      'Manage inventory and participate in regular stock counts',
      'Arrange and display merchandise to attract customers and promote sales'
    ],
    requirements: [
      'Previous retail sales experience preferred',
      'Strong customer service skills',
      'Excellent verbal communication abilities',
      'Basic math skills and ability to handle cash transactions',
      'Knowledge of fashion trends and clothing styles'
    ],
    benefits: [
      'Competitive salary and commission structure',
      'Employee discount program',
      'Flexible scheduling',
      'Career advancement opportunities',
      'Professional development and training'
    ],
    skills: ['Customer Service', 'Sales', 'Retail', 'Fashion Knowledge', 'Communication'],
    jobInfo: {
      industry: 'Retail / Fashion',
      function: 'Sales',
      roles: 'Fashion Retail',
      postedBy: 'Human Resources',
      postedDate: '2025-03-10',
      closingDate: '2025-04-10',
      jobLevel: 'Entry Level',
      vacancy: 5
    }
  };
  
  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real app, this would be an API call
        setJob(sampleJob);
        setError(null);
      } catch (err) {
        setError('Failed to fetch job details. Please try again later.');
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id]);
  
  const handleApplyClick = () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/jobs/${id}` } });
    } else {
      // Show apply modal for authenticated users
      setShowApplyModal(true);
    }
  };
  
  const handleSaveJob = () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/jobs/${id}` } });
    } else {
      // Toggle saved status
      setIsSaved(!isSaved);
      // In a real app, you would call an API to save/unsave the job
    }
  };
  
  const handleApplySubmit = (formData) => {
    // In a real app, you would submit the application to an API
    console.log('Application submitted:', formData);
    setShowApplyModal(false);
    // Show success message or redirect to applications page
  };
  
  if (loading) {
    return <div className="loading-container">Loading job details...</div>;
  }
  
  if (error) {
    return <div className="error-container">{error}</div>;
  }
  
  if (!job) {
    return <div className="not-found-container">Job not found</div>;
  }
  
  return (
    <div className="job-details-page">
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
              <span className="job-posted">Posted: {job.postedDate}</span>
            </div>
          </div>
        </div>
        
        <div className="job-actions">
          <button 
            className={`save-job-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveJob}
          >
            <i className={`bookmark-icon ${isSaved ? 'filled' : ''}`}></i>
            {isSaved ? 'Saved' : 'Save Job'}
          </button>
          
          <button 
            className="apply-now-btn"
            onClick={handleApplyClick}
          >
            Apply Now
          </button>
        </div>
      </div>
      
      <div className="job-content">
        <div className="job-main-content">
          <div className="job-description">
            <h2>Job Description</h2>
            <div dangerouslySetInnerHTML={{ __html: job.description }} />
          </div>
          
          <div className="job-responsibilities">
            <h2>Responsibilities</h2>
            <ul>
              {job.responsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          </div>
          
          <div className="job-requirements">
            <h2>Requirements</h2>
            <ul>
              {job.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
          
          <div className="job-benefits">
            <h2>Benefits</h2>
            <ul>
              {job.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
          
          <div className="skills-required">
            <h2>Skills</h2>
            <div className="skills-list">
              {job.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="job-sidebar">
          <div className="job-overview">
            <h3>Job Overview</h3>
            <ul className="job-overview-list">
              <li>
                <i className="industry-icon"></i>
                <div>
                  <span className="label">Industry</span>
                  <span className="value">{job.jobInfo.industry}</span>
                </div>
              </li>
              <li>
                <i className="function-icon"></i>
                <div>
                  <span className="label">Function</span>
                  <span className="value">{job.jobInfo.function}</span>
                </div>
              </li>
              <li>
                <i className="roles-icon"></i>
                <div>
                  <span className="label">Roles</span>
                  <span className="value">{job.jobInfo.roles}</span>
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
            <button className="view-company-btn">View Company Profile</button>
          </div>
        </div>
      </div>
      
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

export default JobDetailsPage;