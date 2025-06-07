// src/pages/applicant/profile/ProfilePage.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { applicantAPI } from "../../../api";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom"; // Import Link cho Go to Login button

const ProfilePage = () => {
  const {
    user,
    updateUserContext, // SỬA ĐỔI: Sử dụng hàm này để cập nhật user trong context
    loading: authLoading,
  } = useContext(AuthContext); // Get user and updateUserContext
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "", // Usually not editable or handled differently
    phone: "",
    address: "",
    avatarUrl: "", // URL of the avatar
    cvUrl: "", // URL of the CV
    gender: "",
    education: "",
    experience: "",
    skills: [], // Array of strings or objects
    linkedin: "",
    portfolio: "",
    bio: "",
  });
  const [genders, setGenders] = useState([]); // To store gender options if fetched from API
  const [availableSkills, setAvailableSkills] = useState([]); // All possible skills

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null); // For new avatar upload
  const [cvFile, setCvFile] = useState(null); // For new CV upload
  const [avatarPreview, setAvatarPreview] = useState("");
  const [cvFileName, setCvFileName] = useState("");

  // Add errors state
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    cvFile: "",
  });

  // Fetch profile data and other necessary data (genders, skills)
  useEffect(() => {
    const fetchData = async () => {
      if (!user && !authLoading) {
        // If user is not loaded and auth is not loading, redirect or show error
        setLoading(false);
        setSubmitError("User not authenticated or profile data unavailable.");
        return;
      }
      if (authLoading) return; // Wait for auth context to load

      setLoading(true);
      setSubmitError(null);
      try {
        // Fetch profile data
        const profileResponse = await applicantAPI.getProfile(); // API to get applicant's own profile
        const currentProfile = profileResponse.profile || profileResponse.user || {}; // backend có thể trả về 'profile' hoặc 'user'
        
        setProfileData({
          firstName: currentProfile.firstName || user?.firstName || "",
          lastName: currentProfile.lastName || user?.lastName || "",
          email: currentProfile.email || user?.email || "",
          phone: currentProfile.phone || "",
          address: currentProfile.address || "",
          avatarUrl: currentProfile.avatarUrl || user?.avatarUrl || "/assets/images/default-avatar.png", // Sử dụng avatar của user hoặc mặc định
          cvUrl: currentProfile.cvUrl || "",
          gender: currentProfile.gender || "",
          education: currentProfile.education || "",
          experience: currentProfile.experience || "",
          skills: currentProfile.skills || [], // Assuming skills is an array of strings/ids
          linkedin: currentProfile.linkedin || "",
          portfolio: currentProfile.portfolio || "",
          bio: currentProfile.bio || "",
        });
        setAvatarPreview(currentProfile.avatarUrl || user?.avatarUrl || "/assets/images/default-avatar.png");
        setCvFileName(
          currentProfile.cvUrl ? currentProfile.cvUrl.split("/").pop() : ""
        );

        // Fetch gender options (example, replace with actual API if needed)
        setGenders(["Male", "Female", "Other", "Prefer not to say"]); // Mock genders

        // Fetch available skills (example)
        setAvailableSkills([
          { id: "react", name: "React" },
          { id: "node", name: "Node.js" },
          { id: "css", name: "CSS" },
          { id: "html", name: "HTML" },
          { id: "javascript", name: "JavaScript" },
          { id: "python", name: "Python" },
        ]); // Mock skills
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setSubmitError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, authLoading]); // Re-fetch if user changes (e.g., after login)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError(null);
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSkillChange = (skillIdOrName) => {
    setProfileData((prev) => {
      const newSkills = prev.skills.includes(skillIdOrName)
        ? prev.skills.filter((s) => s !== skillIdOrName)
        : [...prev.skills, skillIdOrName];
      return { ...prev, skills: newSkills };
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit for avatar
        setSubmitError("Avatar file size should not exceed 2MB.");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setSubmitError(null);
    }
  };
  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit for CV
        setErrors(prev => ({ ...prev, cvFile: "CV file size should not exceed 5MB" }));
        return;
      }
      setCvFile(file);
      setCvFileName(file.name);
      setErrors(prev => ({ ...prev, cvFile: '' }));
      setSubmitError(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setErrors({
      firstName: '',
      lastName: '',
      phone: '',
      cvFile: ''
    });

    // Basic Validation
    const newErrors = {};
    if (!profileData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!profileData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (profileData.phone && !/^\+?[\d\s-]+$/.test(profileData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true); // Use general loading for submission process

    try {
      // 1. Upload avatar if changed
      let newAvatarUrl = profileData.avatarUrl;
      if (avatarFile) {
        const avatarUploadResponse = await applicantAPI.uploadProfilePicture(avatarFile); // Pass file directly
        if (avatarUploadResponse.success && avatarUploadResponse.avatarUrl) {
          newAvatarUrl = avatarUploadResponse.avatarUrl;
        } else {
          throw new Error(avatarUploadResponse.error || "Failed to upload avatar.");
        }
      }

      // 2. Upload CV if changed
      let newCvUrl = profileData.cvUrl;
      if (cvFile) {
        const cvUploadResponse = await applicantAPI.uploadCV(cvFile); // Pass file directly
        if (cvUploadResponse.success && cvUploadResponse.cvUrl) {
          newCvUrl = cvUploadResponse.cvUrl;
        } else {
          throw new Error(cvUploadResponse.error || "Failed to upload CV.");
        }
      }

      // 3. Update profile text data
      const profilePayload = {
        ...profileData,
        avatarUrl: newAvatarUrl, // Use the new URL
        cvUrl: newCvUrl,        // Use the new URL
        // skills: profileData.skills, // Ensure skills are in the correct format for API (e.g., array of strings/IDs)
      };
      // Remove file objects before sending to updateProfile API if it expects only URLs
      // delete profilePayload.avatarFile; // This is handled by not including them in profileData directly
      // delete profilePayload.cvFile;

      const updateResponse = await applicantAPI.updateProfile(profilePayload);

      // Update AuthContext user if update was successful
      if (updateResponse.success && updateResponse.profile) { // Check for success flag from API
        // Assuming API returns the updated profile
        const updatedUserForContext = {
          ...user,
          ...updateResponse.profile, // Merge with existing user data
          avatarUrl: newAvatarUrl, // Ensure avatarUrl is updated in context
        };
        updateUserContext(updatedUserForContext); // Update user in AuthContext
        setProfileData((prev) => ({
          ...prev,
          avatarUrl: newAvatarUrl,
          cvUrl: newCvUrl,
        })); // Update local state with new URLs
        setSubmitSuccess(true);
        setIsEditing(false); // Exit editing mode on success
        setAvatarFile(null); // Clear staged files
        setCvFile(null);
      } else {
          throw new Error(updateResponse.error || "Failed to update profile via API.");
      }

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setSubmitError(
        err.message || "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && !user)) { // Check if auth is loading or user is null and local loading is true
    // Show loading if auth is loading or profile data isn't ready
    return <LoadingSpinner fullPage message="Loading profile..." />;
  }
  if (!user && !authLoading) { // If user is null and auth is not loading (means not authenticated)
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 text-lg">
          Please log in to view your profile.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-page p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 md:mt-0 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <FontAwesomeIcon icon="pen" /> Edit Profile
            </button>
          ) : (
            <div className="mt-4 md:mt-0 flex gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSubmitError(null);
                  // Reset form to original data (re-fetch or use initial user data)
                  setProfileData({
                    // Reset to currently loaded profileData to discard unsaved changes
                    firstName: user?.firstName || "",
                    lastName: user?.lastName || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    address: user?.address || "",
                    avatarUrl: user?.avatarUrl || "/assets/images/default-avatar.png",
                    cvUrl: user?.cvUrl || "",
                    gender: user?.gender || "",
                    education: user?.education || "",
                    experience: user?.experience || "",
                    skills: Array.isArray(user?.skills) ? user.skills : [],
                    linkedin: user?.linkedin || "",
                    portfolio: user?.portfolio || "",
                    bio: user?.bio || "",
                  });
                  setAvatarPreview(user?.avatarUrl || "/assets/images/default-avatar.png");
                  setCvFileName(
                    user?.cvUrl ? user.cvUrl.split("/").pop() : ""
                  );
                  setAvatarFile(null);
                  setCvFile(null);
                }}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? <LoadingSpinner size="small" /> : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {submitError && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{submitError}</p>
          </div>
        )}
        {submitSuccess && (
          <div
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md"
            role="alert"
          >
            <p className="font-bold">Success!</p>
            <p>Profile updated successfully.</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-8"
        >
          {/* Avatar Section */}
          <section className="text-center">
            <div className="relative inline-block mb-4">
              <img
                src={avatarPreview || "/assets/images/default-avatar.png"} // SỬA ĐỔI: Avatar mặc định
                alt="Profile Avatar"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-200 shadow-md"
              />
              {isEditing && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md"
                >
                  <FontAwesomeIcon icon="camera" />
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {!isEditing && (
              <h2 className="text-2xl font-semibold text-gray-800">
                {profileData.firstName} {profileData.lastName}
              </h2>
            )}
            {!isEditing && <p className="text-gray-600">{profileData.email}</p>}
          </section>

          {/* Personal Information */}
          <FormSection title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="First Name*"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                error={errors.firstName}
              />
              <InputField
                label="Last Name*"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                error={errors.lastName}
              />
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={profileData.email}
                disabled={true}
              />{" "}
              {/* Email usually not editable */}
              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                error={errors.phone}
              />
              <InputField
                label="Address"
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Gender</option>
                  {genders.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bio / Summary
              </label>
              <textarea
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="4"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us a bit about yourself..."
              />
            </div>
          </FormSection>

          {/* Professional Information */}
          <FormSection title="Professional Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Current Position / Title"
                name="title"
                value={profileData.title || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <InputField
                label="Years of Experience"
                name="experience"
                type="number"
                value={profileData.experience}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="e.g., 5"
              />
            </div>
            <div className="mt-6">
              <label
                htmlFor="education"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Education
              </label>
              <textarea
                id="education"
                name="education"
                value={profileData.education}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="3"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Bachelor's in Fashion Design - University Name (Year)"
              />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableSkills.map((skill) => (
                  <label
                    key={skill.id}
                    className={`flex items-center space-x-2 text-sm p-2 border rounded-md cursor-pointer transition-colors ${
                      profileData.skills.includes(skill.id)
                        ? "bg-blue-100 border-blue-300 text-blue-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={skill.id}
                      checked={profileData.skills.includes(skill.id)}
                      onChange={() => handleSkillChange(skill.id)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span>{skill.name}</span>
                  </label>
                ))}
              </div>
              {/* Add new skill input if editing */}
            </div>
          </FormSection>

          {/* Documents */}
          <FormSection title="Documents">
            <div>
              <label
                htmlFor="cv-upload"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Resume/CV
              </label>
              {isEditing ? (
                <div
                  className={`mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 ${
                    errors.cvFile ? "border-red-500" : "border-gray-300"
                  } border-dashed rounded-md`}
                >
                  <div className="space-y-1 text-center">
                    <FontAwesomeIcon
                      icon="file-arrow-up"
                      className="mx-auto h-10 w-10 text-gray-400"
                    />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="cv-file-input"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>{cvFileName ? "Change CV" : "Upload CV"}</span>
                        <input
                          id="cv-file-input"
                          name="cvFile"
                          type="file"
                          className="sr-only"
                          onChange={handleCvChange}
                          accept=".pdf,.doc,.docx"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    {cvFileName && (
                      <p className="text-xs text-gray-500 mt-1">
                        Current: {cvFileName}
                      </p>
                    )}
                    {!cvFileName && (
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX up to 5MB
                      </p>
                    )}
                  </div>
                </div>
              ) : profileData.cvUrl ? (
                <a
                  href={profileData.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-2"
                >
                  <FontAwesomeIcon icon="file-pdf" /> View Current CV
                </a>
              ) : (
                <p className="text-sm text-gray-500">No CV uploaded.</p>
              )}
              {errors.cvFile && (
                <p className="text-xs text-red-600 mt-1">{errors.cvFile}</p>
              )}
            </div>
          </FormSection>

          {/* Online Presence */}
          <FormSection title="Online Presence">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="LinkedIn Profile URL"
                name="linkedin"
                value={profileData.linkedin}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="linkedin.com/in/yourprofile"
              />
              <InputField
                label="Portfolio/Website URL"
                name="portfolio"
                value={profileData.portfolio}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="yourportfolio.com"
              />
            </div>
          </FormSection>
        </form>
      </div>
    </div>
  );
};

// Helper component for form sections
const FormSection = ({ title, children }) => (
  <section className="pb-8 mb-8 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
    <h2 className="text-xl font-semibold text-gray-700 mb-6">{title}</h2>
    <div className="space-y-6">{children}</div>
  </section>
);

// Helper component for input fields
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled,
  error,
  placeholder,
  required = false,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full p-2.5 border rounded-md focus:ring-2 ${
        error
          ? "border-red-500 ring-red-200"
          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
      } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default ProfilePage;
