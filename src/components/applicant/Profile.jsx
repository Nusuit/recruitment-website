import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../contexts/AuthContext';
import useForm from '../../hooks/useForm';
import { validateProfileForm } from '../../utils/validators';
import { updateProfile } from '../../api/auth';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const initialValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    title: user?.title || '',
    bio: user?.bio || '',
    website: user?.website || '',
    resumeUrl: user?.resumeUrl || '',
    linkedIn: user?.linkedIn || '',
    twitter: user?.twitter || '',
    github: user?.github || ''
  };
  
  const { values, setValues, errors, handleChange, validateForm, setErrors } = useForm(
    initialValues,
    validateProfileForm
  );
  
  // Set user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setValues({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        title: user.title || '',
        bio: user.bio || '',
        website: user.website || '',
        resumeUrl: user.resumeUrl || '',
        linkedIn: user.linkedIn || '',
        twitter: user.twitter || '',
        github: user.github || ''
      });
      
      if (user.profileImageUrl) {
        setPreviewUrl(user.profileImageUrl);
      }
    }
  }, [user, setValues]);
  
  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setProfileImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      // Prepare form data with image if provided
      const formData = new FormData();
      
      // Add text fields
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      
      // Add profile image if changed
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      
      // Call API to update profile
      const result = await updateProfile(formData);
      
      if (result.success) {
        setSubmitSuccess(true);
        setIsEditing(false);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } else {
        setSubmitError(result.error);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Cancel edit mode
  const handleCancel = () => {
    // Reset form to original values
    if (user) {
      setValues({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        title: user.title || '',
        bio: user.bio || '',
        website: user.website || '',
        resumeUrl: user.resumeUrl || '',
        linkedIn: user.linkedIn || '',
        twitter: user.twitter || '',
        github: user.github || ''
      });
    }
    
    // Reset image preview
    if (user?.profileImageUrl) {
      setPreviewUrl(user.profileImageUrl);
    } else {
      setPreviewUrl('');
    }
    
    // Reset file input
    setProfileImage(null);
    
    // Exit edit mode
    setIsEditing(false);
    setErrors({});
  };
  
  return (
    <div className="profile-component">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-image-container">
          {isEditing ? (
            <>
              <div className="profile-image">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile Preview" />
                ) : (
                  <div className="profile-placeholder">
                    {user?.firstName?.charAt(0) || ''}
                    {user?.lastName?.charAt(0) || ''}
                  </div>
                )}
              </div>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <label htmlFor="profileImage" className="change-image-btn">
                Change Image
              </label>
            </>
          ) : (
            <div className="profile-image">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
              ) : (
                <div className="profile-placeholder">
                  {user?.firstName?.charAt(0) || ''}
                  {user?.lastName?.charAt(0) || ''}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <div className="profile-name">
            {isEditing ? (
              <div className="edit-name">
                <input
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="edit-firstname"
                />
                <input
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="edit-lastname"
                />
                {(errors.firstName || errors.lastName) && (
                  <div className="field-error">Name fields are required</div>
                )}
              </div>
            ) : (
              <h2>{user?.firstName} {user?.lastName}</h2>
            )}
          </div>
          
          <div className="profile-title">
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
                placeholder="Professional Title"
              />
            ) : (
              <p>{user?.title || 'Professional Title'}</p>
            )}
          </div>
          
          {!isEditing && (
            <button
              className="edit-profile-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
      
      {/* Success/Error Messages */}
      {submitSuccess && (
        <div className="success-message">
          Profile updated successfully!
        </div>
      )}
      
      {submitError && (
        <div className="error-message">
          {submitError}
        </div>
      )}
      
      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Information
        </button>
        <button
          className={`tab-btn ${activeTab === 'professional' ? 'active' : ''}`}
          onClick={() => setActiveTab('professional')}
        >
          Professional Details
        </button>
        <button
          className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          Social Profiles
        </button>
      </div>
      
      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="profile-form">
        {/* Personal Information Tab */}
        <div className={`tab-content ${activeTab === 'personal' ? 'active' : ''}`}>
          <div className="form-section">
            <h3>Contact Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  disabled={!isEditing || true} // Email usually can't be edited
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  disabled={!isEditing}
                />
                {errors.phone && <div className="field-error">{errors.phone}</div>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={values.location}
                onChange={handleChange}
                placeholder="City, Country"
                disabled={!isEditing}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">About Me</label>
              <textarea
                id="bio"
                name="bio"
                value={values.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about yourself"
                disabled={!isEditing}
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Professional Details Tab */}
        <div className={`tab-content ${activeTab === 'professional' ? 'active' : ''}`}>
          <div className="form-section">
            <h3>Career Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Professional Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={values.title}
                onChange={handleChange}
                placeholder="e.g. Senior Fashion Designer"
                disabled={!isEditing}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="resumeUrl">Resume</label>
              {isEditing ? (
                <div className="resume-upload">
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    className="file-input"
                  />
                  <label htmlFor="resume" className="file-label">
                    {values.resumeUrl ? 'Replace Current Resume' : 'Upload Resume'}
                  </label>
                  <span className="file-info">PDF, DOC, or DOCX (max 5MB)</span>
                </div>
              ) : (
                values.resumeUrl ? (
                  <div className="resume-link">
                    <a href={values.resumeUrl} target="_blank" rel="noopener noreferrer">
                      View Resume
                    </a>
                  </div>
                ) : (
                  <span className="no-resume">No resume uploaded</span>
                )
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="website">Personal Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={values.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                disabled={!isEditing}
              />
              {errors.website && <div className="field-error">{errors.website}</div>}
            </div>
          </div>
        </div>
        
        {/* Social Profiles Tab */}
        <div className={`tab-content ${activeTab === 'social' ? 'active' : ''}`}>
          <div className="form-section">
            <h3>Social Media Profiles</h3>
            
            <div className="form-group">
              <label htmlFor="linkedIn">LinkedIn</label>
              <div className="social-input">
                <span className="social-prefix">linkedin.com/in/</span>
                <input
                  type="text"
                  id="linkedIn"
                  name="linkedIn"
                  value={values.linkedIn}
                  onChange={handleChange}
                  placeholder="username"
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
                  placeholder="username"
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="github">GitHub</label>
              <div className="social-input">
                <span className="social-prefix">github.com/</span>
                <input
                  type="text"
                  id="github"
                  name="github"
                  value={values.github}
                  onChange={handleChange}
                  placeholder="username"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
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
  );
};

export default Profile;