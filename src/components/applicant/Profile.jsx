// src/components/applicant/Profile.jsx
// This is a sub-component, likely used within ProfilePage.jsx or ApplicantDashboard.jsx
// It focuses on displaying and allowing edits for specific parts of the profile.

import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../contexts/AuthContext";
// import { candidateAPI } from '../../api/candidate'; // If this component makes direct API calls
import LoadingSpinner from "../common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProfileSectionCard = ({
  title,
  children,
  onEdit,
  isEditing,
  onSave,
  onCancel,
  isSaving,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      {onEdit && !isEditing && (
        <button
          onClick={onEdit}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <FontAwesomeIcon icon="pen" /> Edit
        </button>
      )}
    </div>
    {children}
    {isEditing && onSave && onCancel && (
      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          type="button"
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSaving ? <LoadingSpinner size="sm" /> : "Save Changes"}
        </button>
      </div>
    )}
  </div>
);

ProfileSectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onEdit: PropTypes.func,
  isEditing: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  isSaving: PropTypes.bool,
};

const ApplicantProfileComponent = ({
  profileData: initialProfile,
  onProfileUpdate,
}) => {
  const { user } = useContext(AuthContext); // Get user from context for initial data if needed
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    bio: "",
    education: "",
    experience: "",
    skills: [],
    linkedin: "",
    portfolio: "",
    // Add other fields as necessary
  });
  const [loading, setLoading] = useState(false); // For individual section save
  const [error, setError] = useState("");

  useEffect(() => {
    // Initialize formData from initialProfile or user context
    const dataToUse = initialProfile || user || {};
    setFormData({
      firstName: dataToUse.firstName || "",
      lastName: dataToUse.lastName || "",
      phone: dataToUse.phone || "",
      address: dataToUse.address || "",
      bio: dataToUse.bio || "",
      education: dataToUse.education || "",
      experience: dataToUse.experience || "",
      skills: Array.isArray(dataToUse.skills)
        ? dataToUse.skills
        : dataToUse.skills
        ? String(dataToUse.skills)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      linkedin: dataToUse.linkedin || "",
      portfolio: dataToUse.portfolio || "",
    });
  }, [initialProfile, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSkillsChange = (e) => {
    // Basic comma-separated skills
    setFormData((prev) => ({
      ...prev,
      skills: e.target.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      // In a real app, call API to update profile section
      // await candidateAPI.updateProfileSection(formData); // Example
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API
      if (onProfileUpdate) {
        onProfileUpdate(formData); // Notify parent about the update
      }
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error("Profile save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset formData to original (initialProfile or user)
    const dataToUse = initialProfile || user || {};
    setFormData({
      firstName: dataToUse.firstName || "",
      lastName: dataToUse.lastName || "",
      phone: dataToUse.phone || "",
      address: dataToUse.address || "",
      bio: dataToUse.bio || "",
      education: dataToUse.education || "",
      experience: dataToUse.experience || "",
      skills: Array.isArray(dataToUse.skills)
        ? dataToUse.skills
        : dataToUse.skills
        ? String(dataToUse.skills)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      linkedin: dataToUse.linkedin || "",
      portfolio: dataToUse.portfolio || "",
    });
    setIsEditing(false);
    setError("");
  };

  if (!user && !initialProfile) {
    // Or some other loading condition
    return <LoadingSpinner message="Loading profile information..." />;
  }

  return (
    <div className="applicant-profile-component space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <ProfileSectionCard
        title="Personal Information"
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={loading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <InfoDisplay
            label="First Name"
            value={formData.firstName}
            name="firstName"
            isEditing={isEditing}
            onChange={handleChange}
          />
          <InfoDisplay
            label="Last Name"
            value={formData.lastName}
            name="lastName"
            isEditing={isEditing}
            onChange={handleChange}
          />
          <InfoDisplay
            label="Email"
            value={user?.email || initialProfile?.email}
            name="email"
            isEditing={false}
          />{" "}
          {/* Email usually not editable here */}
          <InfoDisplay
            label="Phone"
            value={formData.phone}
            name="phone"
            isEditing={isEditing}
            onChange={handleChange}
          />
          <InfoDisplay
            label="Address"
            value={formData.address}
            name="address"
            isEditing={isEditing}
            onChange={handleChange}
            className="md:col-span-2"
          />
          <InfoDisplay
            label="Bio"
            value={formData.bio}
            name="bio"
            isEditing={isEditing}
            onChange={handleChange}
            type="textarea"
            rows="3"
            className="md:col-span-2"
          />
        </div>
      </ProfileSectionCard>

      <ProfileSectionCard
        title="Professional Summary"
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={loading}
      >
        <div className="space-y-4 text-sm">
          <InfoDisplay
            label="Education"
            value={formData.education}
            name="education"
            isEditing={isEditing}
            onChange={handleChange}
            type="textarea"
            rows="3"
            placeholder="e.g., Bachelor's in Design - XYZ University"
          />
          <InfoDisplay
            label="Work Experience"
            value={formData.experience}
            name="experience"
            isEditing={isEditing}
            onChange={handleChange}
            type="textarea"
            rows="4"
            placeholder="e.g., Fashion Designer at ABC Corp (2020-2023)"
          />
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase">
              Skills
            </label>
            {isEditing ? (
              <input
                type="text"
                name="skills"
                value={formData.skills.join(", ")}
                onChange={handleSkillsChange}
                placeholder="Comma-separated skills, e.g., Sketching, Adobe CS"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            ) : formData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-700">Not specified</p>
            )}
          </div>
        </div>
      </ProfileSectionCard>
      <ProfileSectionCard
        title="Online Presence"
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={loading}
      >
        <div className="space-y-4 text-sm">
          <InfoDisplay
            label="LinkedIn Profile"
            value={formData.linkedin}
            name="linkedin"
            isEditing={isEditing}
            onChange={handleChange}
            placeholder="linkedin.com/in/yourname"
          />
          <InfoDisplay
            label="Portfolio/Website"
            value={formData.portfolio}
            name="portfolio"
            isEditing={isEditing}
            onChange={handleChange}
            placeholder="yourportfolio.com"
          />
        </div>
      </ProfileSectionCard>
    </div>
  );
};

ApplicantProfileComponent.propTypes = {
  profileData: PropTypes.object, // Optional: if profile data is passed from a parent page
  onProfileUpdate: PropTypes.func, // Optional: callback after a successful update
};

// Helper for displaying info or input field
const InfoDisplay = ({
  label,
  value,
  name,
  isEditing,
  onChange,
  type = "text",
  rows,
  className = "",
  placeholder,
}) => (
  <div className={className}>
    <label className="block text-xs font-medium text-gray-500 uppercase mb-0.5">
      {label}
    </label>
    {isEditing ? (
      type === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          rows={rows || 3}
          placeholder={placeholder}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      )
    ) : (
      <p className="text-gray-800 break-words">
        {value || <span className="text-gray-400 italic">Not specified</span>}
      </p>
    )}
  </div>
);

InfoDisplay.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  name: PropTypes.string,
  isEditing: PropTypes.bool,
  onChange: PropTypes.func,
  type: PropTypes.string,
  rows: PropTypes.number,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

export default ApplicantProfileComponent;
