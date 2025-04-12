import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidateAPI } from '../../api/candidate';

const JobApplyPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: '',
    linkedIn: '',
    portfolio: '',
    expectedSalary: '',
    availableDate: '',
    referral: ''
  });

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await candidateAPI.getJobs({ id: jobId });
        setJob(response.jobs[0]);
        setError(null);
      } catch (err) {
        setError('Failed to fetch job details. Please try again.');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size should not exceed 5MB');
      return;
    }
    setFormData(prev => ({
      ...prev,
      resume: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitLoading(true);
      setError(null);

      const applicationData = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'resume' && formData[key]) {
          applicationData.append(key, formData[key]);
        }
      });

      // Append resume file if exists
      if (formData.resume) {
        applicationData.append('resume', formData.resume);
      }

      await candidateAPI.applyJob(jobId, applicationData);

      // Show success message and redirect
      navigate(`/applications`, {
        state: { 
          success: true, 
          message: 'Application submitted successfully!' 
        }
      });
      
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
      console.error('Error submitting application:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading job details...</div>;
  }

  if (!job) {
    return <div className="error-message">Job not found</div>;
  }

  return (
    <div className="job-apply-page">
      <div className="page-header">
        <h1>Apply for {job.title}</h1>
        <div className="job-meta">
          <span className="company">{job.company}</span>
          <span className="location">{job.location}</span>
          <span className="job-type">{job.type}</span>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-section">
          <h2>Personal Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name*</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number*</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Professional Information</h2>
          
          <div className="form-group">
            <label htmlFor="resume">Resume/CV*</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
              />
              <p className="file-input-help">
                PDF, DOC, or DOCX (max 5MB)
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="coverLetter">Cover Letter</label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows={5}
              placeholder="Tell us why you're interested in this position and what makes you a great candidate"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="linkedIn">LinkedIn Profile</label>
              <input
                type="url"
                id="linkedIn"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div className="form-group">
              <label htmlFor="portfolio">Portfolio Website</label>
              <input
                type="url"
                id="portfolio"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleInputChange}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Additional Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expectedSalary">Expected Salary</label>
              <input
                type="text"
                id="expectedSalary"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleInputChange}
                placeholder="e.g. $50,000/year"
              />
            </div>

            <div className="form-group">
              <label htmlFor="availableDate">Available Start Date</label>
              <input
                type="date"
                id="availableDate"
                name="availableDate"
                value={formData.availableDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="referral">How did you hear about this position?</label>
            <input
              type="text"
              id="referral"
              name="referral"
              value={formData.referral}
              onChange={handleInputChange}
              placeholder="e.g. Company website, LinkedIn, Employee referral"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate(`/jobs/${jobId}`)}
          >
            Cancel
          </button>
          
          <button 
            type="submit"
            className="submit-btn"
            disabled={submitLoading}
          >
            {submitLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobApplyPage;