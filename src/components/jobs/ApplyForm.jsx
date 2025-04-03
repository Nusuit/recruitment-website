import React, { useState, useContext } from 'react';
import AuthContext from '../../contexts/AuthContext';

const ApplyForm = ({ jobId, jobTitle, onSubmit }) => {
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    resume: null,
    coverLetter: '',
    rating: 0
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user changes it
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        resume: file
      });
      
      // Clear error for this field
      if (errors.resume) {
        setErrors({
          ...errors,
          resume: ''
        });
      }
    }
  };
  
  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload the file and form data to an API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onSubmit({
        ...formData,
        jobId,
        jobTitle,
        applicationDate: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors({
        submit: 'Failed to submit application. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form className="apply-form" onSubmit={handleSubmit}>
      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <div className="field-error">{errors.firstName}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <div className="field-error">{errors.lastName}</div>
          )}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && (
            <div className="field-error">{errors.email}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <div className="field-error">{errors.phone}</div>
          )}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="resume">Resume</label>
        <div className="file-input-container">
          <input
            type="file"
            id="resume"
            name="resume"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />
          <div className="file-input-text">
            {formData.resume ? formData.resume.name : 'Upload your resume (PDF, DOC, DOCX)'}
          </div>
          <button type="button" className="file-input-btn">Browse</button>
        </div>
        {errors.resume && (
          <div className="field-error">{errors.resume}</div>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="coverLetter">Cover Letter (Optional)</label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us why you're a good fit for this position"
        ></textarea>
      </div>
      
      <div className="form-group">
        <label>Rate your skills for this job</label>
        <div className="rating-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`rating-star ${formData.rating >= star ? 'active' : ''}`}
              onClick={() => handleRatingChange(star)}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      
      <div className="form-actions">
        <button
          type="submit"
          className="submit-application-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Applying...' : 'Apply Now'}
        </button>
      </div>
    </form>
  );
};

export default ApplyForm;