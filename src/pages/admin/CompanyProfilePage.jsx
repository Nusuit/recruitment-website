import React, { useState, useEffect } from 'react';
import useForm from '../../hooks/useForm';

const CompanyProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  
  // Initial form state with sample company data
  const initialValues = {
    companyName: 'MyaCorp',
    industry: 'Fashion / Retail',
    companySize: '50-200',
    foundedYear: '2015',
    website: 'https://www.myacorp.com',
    headquarters: 'HCM, Vietnam',
    description: 'MyaCorp is a leading fashion retailer specializing in high-quality apparel and accessories. We believe that fashion is a form of self-expression, and our mission is to help individuals discover and define their unique style.',
    mission: 'Our mission is to inspire and empower individuals worldwide to confidently express their unique style through accessible, high-quality fashion that combines creativity, sustainability, and exceptional value.',
    vision: 'To become a global leader in progressive retail, setting new standards for sustainable practices, digital innovation, and inclusive fashion, creating a more connected and beautiful world for all.',
    email: 'info@myacorp.com',
    phone: '+84 999 999 999',
    address: '123 Fashion Street, District 1, HCM City, Vietnam',
    facebook: 'myacorp',
    twitter: 'myacorp',
    linkedin: 'myacorp',
    instagram: 'myacorp'
  };
  
  const { values, setValues, errors, handleChange, validateForm, setErrors } = useForm(
    initialValues,
    null // No validation function for now
  );
  
  // Fetch company profile data (in a real app)
  useEffect(() => {
    // Simulated API call
    const fetchCompanyProfile = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await getCompanyProfile();
        
        // For demo, we'll use the initial values and set a logo preview
        setLogoPreview('/assets/images/logo.svg');
      } catch (error) {
        console.error('Error fetching company profile:', error);
        setSubmitError('Failed to load company profile.');
      }
    };
    
    fetchCompanyProfile();
  }, []);
  
  // Handle logo change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setLogoFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      // In a real app, you would send a request to update the company profile
      // const formData = new FormData();
      
      // Add text fields
      // Object.keys(values).forEach(key => {
      //   formData.append(key, values[key]);
      // });
      
      // Add logo if changed
      // if (logoFile) {
      //   formData.append('logo', logoFile);
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      setIsEditing(false);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating company profile:', error);
      setSubmitError('Failed to update company profile. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setValues(initialValues);
    setLogoPreview('/assets/images/logo.svg');
    setLogoFile(null);
    setErrors({});
  };
  
  return (
    <div className="company-profile-page">
      <div className="page-header">
        <h1>Company Profile</h1>
        {!isEditing && (
          <button 
            className="edit-profile-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
      
      {submitSuccess && (
        <div className="success-message">
          Company profile updated successfully!
        </div>
      )}
      
      {submitError && (
        <div className="error-message">
          {submitError}
        </div>
      )}
      
      <div className="company-profile-content">
        <form onSubmit={handleSubmit} className="company-profile-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="company-logo-section">
              <div className="company-logo">
                {logoPreview ? (
                  <img src={logoPreview} alt="Company Logo" />
                ) : (
                  <div className="logo-placeholder">
                    <span>Logo</span>
                  </div>
                )}
              </div>
              
              {isEditing && (
                <div className="logo-upload">
                  <input
                    type="file"
                    id="companyLogo"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="file-input"
                  />
                  <label htmlFor="companyLogo" className="upload-logo-btn">
                    Change Logo
                  </label>
                  <p className="logo-hint">Recommended size: 200x200px (Max 2MB)</p>
                </div>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={values.companyName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="industry">Industry</label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={values.industry}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companySize">Company Size</label>
                <select
                  id="companySize"
                  name="companySize"
                  value={values.companySize}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="50-200">50-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="foundedYear">Founded Year</label>
                <input
                  type="text"
                  id="foundedYear"
                  name="foundedYear"
                  value={values.foundedYear}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={values.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="headquarters">Headquarters</label>
                <input
                  type="text"
                  id="headquarters"
                  name="headquarters"
                  value={values.headquarters}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Company Description</h2>
            
            <div className="form-group">
              <label htmlFor="description">About the Company</label>
              <textarea
                id="description"
                name="description"
                value={values.description}
                onChange={handleChange}
                rows="5"
                disabled={!isEditing}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="mission">Mission</label>
              <textarea
                id="mission"
                name="mission"
                value={values.mission}
                onChange={handleChange}
                rows="3"
                disabled={!isEditing}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="vision">Vision</label>
              <textarea
                id="vision"
                name="vision"
                value={values.vision}
                onChange={handleChange}
                rows="3"
                disabled={!isEditing}
              ></textarea>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Contact Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={values.address}
                onChange={handleChange}
                rows="2"
                disabled={!isEditing}
              ></textarea>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Social Media</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="facebook">Facebook</label>
                <div className="social-input">
                  <span className="social-prefix">facebook.com/</span>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={values.facebook}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="twitter">Twitter</label>
                <div className="social-input">
                  <span className="social-prefix">twitter.com/</span>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={values.twitter}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn</label>
                <div className="social-input">
                  <span className="social-prefix">linkedin.com/company/</span>
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    value={values.linkedin}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="instagram">Instagram</label>
                <div className="social-input">
                  <span className="social-prefix">instagram.com/</span>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={values.instagram}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {isEditing && (
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanyProfilePage;