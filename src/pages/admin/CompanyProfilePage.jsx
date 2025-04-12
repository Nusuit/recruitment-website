import React, { useState, useEffect } from 'react';
import { recruiterAPI } from '../../api/recruiter';

const CompanyProfilePage = () => {
  const [values, setValues] = useState({
    name: '',
    logo: null,
    description: '',
    website: '',
    industry: '',
    employeeCount: '',
    foundedYear: '',
    mission: '',
    vision: '',
    location: '',
    address: '',
    email: '',
    phone: '',
    facebook: '',
    linkedin: '',
    twitter: '',
    instagram: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        setLoading(true);
        const response = await recruiterAPI.getCompanyProfile();
        setValues(response.company);
        setError(null);
      } catch (err) {
        setError('Failed to load company profile. Please try again.');
        console.error('Error loading company profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await recruiterAPI.uploadCompanyLogo(formData);
      setValues(prev => ({
        ...prev,
        logo: response.logoUrl
      }));
      setSubmitSuccess(true);
    } catch (err) {
      setError('Failed to upload company logo. Please try again.');
      console.error('Error uploading logo:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await recruiterAPI.updateCompanyProfile(values);
      setIsEditing(false);
      setSubmitSuccess(true);
      setError(null);

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to update company profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading company profile...</div>;
  }

  return (
    <div className="company-profile-page">
      <div className="page-header">
        <h1>Company Profile</h1>
        <div className="header-actions">
          {!isEditing ? (
            <button 
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button 
                className="save-button"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {submitSuccess && (
        <div className="success-message">Company profile updated successfully!</div>
      )}

      <div className="profile-content">
        <div className="form-section">
          <h2>Basic Information</h2>

          <div className="logo-section">
            <div className="company-logo">
              <img 
                src={values.logo || '/default-company-logo.png'} 
                alt="Company Logo"
              />
              {isEditing && (
                <div className="logo-upload">
                  <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={handleLogoChange}
                    hidden
                  />
                  <label htmlFor="logo" className="upload-button">
                    Change Logo
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Company Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

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
          </div>

          <div className="form-row">
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

            <div className="form-group">
              <label htmlFor="employeeCount">Number of Employees</label>
              <input
                type="number"
                id="employeeCount"
                name="employeeCount"
                value={values.employeeCount}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="foundedYear">Founded Year</label>
              <input
                type="number"
                id="foundedYear"
                name="foundedYear"
                value={values.foundedYear}
                onChange={handleChange}
                disabled={!isEditing}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Company Description</label>
            <textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              disabled={!isEditing}
              rows="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mission">Mission</label>
            <textarea
              id="mission"
              name="mission"
              value={values.mission}
              onChange={handleChange}
              disabled={!isEditing}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="vision">Vision</label>
            <textarea
              id="vision"
              name="vision"
              value={values.vision}
              onChange={handleChange}
              disabled={!isEditing}
              rows="3"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Contact Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={values.location}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
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
              disabled={!isEditing}
              rows="2"
            />
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
          </div>

          <div className="form-row">
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
      </div>
    </div>
  );
};

export default CompanyProfilePage;