import React from 'react';
import Profile from '../../components/applicant/Profile';

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p className="page-description">
          Manage your personal information and preferences
        </p>
      </div>
      
      <div className="profile-container">
        <Profile />
      </div>
    </div>
  );
};

export default ProfilePage;