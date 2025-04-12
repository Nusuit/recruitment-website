import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI } from '../../api/candidate';

const JobApplicationForm = ({ jobId, jobTitle }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '', 
    email: '',
    phone: '',
    experience: '',
    linkedin: '',
    coverLetter: '',
    resume: null,
    expectedSalary: '',
    noticePeriod: '',
    availableDate: '',
    questions: {
      workAuthorization: '',
      relocate: '',
      remoteWork: '',
      salaryExpectations: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  // Fetch user profile to pre-fill form
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await candidateAPI.getProfile();
        const userProfile = response.profile;

        setProfile(userProfile);
        setFormData(prev => ({
          ...prev,
          firstName: userProfile.firstName || '',
          lastName: userProfile.lastName || '',
          email: userProfile.email || '',
          phone: userProfile.phone || '',
          experience: userProfile.experience || '',
          linkedin: userProfile.linkedin || ''
        }));
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('questions.')) {
      const questionKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        questions: {
          ...prev.questions,
          [questionKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Resume file size should not exceed 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.resume) errors.resume = 'Resume is required';
    
    if (Object.keys(errors).length > 0) {
      setError('Please fill in all required fields');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const applicationData = new FormData();

      // Append text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'resume' && key !== 'questions') {
          applicationData.append(key, formData[key]);
        }
      });

      // Append questions as JSON
      applicationData.append('questions', JSON.stringify(formData.questions));

      // Append resume file if exists
      if (formData.resume) {
        applicationData.append('resume', formData.resume);
      }

      await candidateAPI.applyJob(jobId, applicationData);

      // Redirect to applications page with success message
      navigate('/applications', { 
        state: { 
          success: true, 
          message: 'Application submitted successfully!' 
        }
      });
      
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
      console.error('Error submitting application:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-application-form">
      <div className="form-header">
        <h2>Apply for {jobTitle}</h2>
        <p>Please fill out the form below to submit your application</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="form-section">
        <h3>Personal Information</h3>
        
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
        <h3>Professional Information</h3>
        
        <div className="form-group">
          <label htmlFor="resume">Resume/CV*</label>
          <div className="file-upload">
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
            />
            <p className="file-info">
              Accepted formats: PDF, DOC, DOCX (Max 5MB)
            </p>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="experience">Years of Experience</label>
          <input
            type="text"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            placeholder="e.g. 3 years"
          />
        </div>

        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn Profile</label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/yourprofile"
          />
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
      </div>

      <div className="form-section">
        <h3>Additional Questions</h3>
        
        <div className="form-group">
          <label htmlFor="questions.workAuthorization">
            Are you legally authorized to work in this country?*
          </label>
          <select
            id="questions.workAuthorization"
            name="questions.workAuthorization"
            value={formData.questions.workAuthorization}
            onChange={handleInputChange}
            required
          >
            <option value="">Select an answer</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="questions.relocate">
            Are you willing to relocate if necessary?
          </label>
          <select
            id="questions.relocate"
            name="questions.relocate"
            value={formData.questions.relocate}
            onChange={handleInputChange}
          >
            <option value="">Select an answer</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="maybe">Maybe</option>
          </select>
        </div>

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
          <label htmlFor="availableDate">When can you start?</label>
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

      <div className="form-actions">
        <button 
          type="button" 
          className="cancel-btn"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        
        <button 
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};

export default JobApplicationForm;