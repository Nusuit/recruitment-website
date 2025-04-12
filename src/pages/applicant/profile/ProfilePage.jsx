import React, { useState, useEffect } from 'react';
import { candidateAPI } from '../../../api/candidate';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    avatar: null,
    cv: null,
    gender: '',
    education: '',
    experience: '',
    skills: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [genders, setGenders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch profile data
        const profileResponse = await candidateAPI.getProfile();
        setProfile(profileResponse.profile);

        // Fetch gender options
        const gendersResponse = await candidateAPI.getGenders();
        setGenders(gendersResponse.genders);

        setError(null);
      } catch (err) {
        setError('Failed to load profile data. Please try again.');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await candidateAPI.uploadProfilePicture(file);
      setProfile(prev => ({
        ...prev,
        avatar: response.avatarUrl
      }));
      setSubmitSuccess(true);
    } catch (err) {
      setError('Failed to upload avatar. Please try again.');
      console.error('Error uploading avatar:', err);
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await candidateAPI.uploadCV(file);
      setProfile(prev => ({
        ...prev,
        cv: response.cvUrl
      }));
      setSubmitSuccess(true);
    } catch (err) {
      setError('Failed to upload CV. Please try again.');
      console.error('Error uploading CV:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await candidateAPI.updateProfile(profile);
      setIsEditing(false);
      setSubmitSuccess(true);
      setError(null);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
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
        <div className="success-message">Profile updated successfully!</div>
      )}

      <div className="profile-content">
        <div className="profile-section">
          <div className="avatar-section">
            <div className="avatar-container">
              <img 
                src={profile.avatar || '/default-avatar.png'} 
                alt="Profile"
                className="profile-avatar"
              />
              {isEditing && (
                <div className="avatar-upload">
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    hidden
                  />
                  <label htmlFor="avatar" className="upload-button">
                    Change Photo
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profile.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profile.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                disabled={true} // Email should not be editable
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={profile.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">Select Gender</option>
                {genders.map(gender => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={profile.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Resume/CV</h2>
          <div className="cv-section">
            {profile.cv ? (
              <div className="current-cv">
                <a href={profile.cv} target="_blank" rel="noopener noreferrer">
                  View Current CV
                </a>
                {isEditing && (
                  <div className="cv-upload">
                    <input
                      type="file"
                      id="cv"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVUpload}
                      hidden
                    />
                    <label htmlFor="cv" className="upload-button">
                      Upload New CV
                    </label>
                  </div>
                )}
              </div>
            ) : (
              isEditing && (
                <div className="cv-upload">
                  <input
                    type="file"
                    id="cv"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCVUpload}
                    hidden
                  />
                  <label htmlFor="cv" className="upload-button">
                    Upload CV
                  </label>
                </div>
              )
            )}
          </div>
        </div>

        <div className="profile-section">
          <h2>Professional Information</h2>
          <div className="form-group">
            <label htmlFor="education">Education</label>
            <textarea
              id="education"
              name="education"
              value={profile.education}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Work Experience</label>
            <textarea
              id="experience"
              name="experience"
              value={profile.experience}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills</label>
            <textarea
              id="skills"
              name="skills"
              value={profile.skills.join(', ')}
              onChange={(e) => {
                const skillsArray = e.target.value
                  .split(',')
                  .map(skill => skill.trim())
                  .filter(skill => skill.length > 0);
                setProfile(prev => ({
                  ...prev,
                  skills: skillsArray
                }));
              }}
              disabled={!isEditing}
              rows={3}
              placeholder="Enter skills separated by commas"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;