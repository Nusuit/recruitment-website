// src/pages/admin/ProfilePage.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { recruiterAPI } from "../../api/recruiter"; // Assuming recruiter's own profile uses this
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

// Thêm hàm này trước component AdminProfilePage
const getValidAvatar = (url) => {
  if (!url || url.includes("api/recruiter/profile/avatar")) {
    return "/assets/images/admin-avatar.png";
  }
  return url;
};

const AdminProfilePage = () => {
  const {
    user,
    updateUserContext, // SỬA ĐỔI: Sử dụng hàm này để cập nhật user trong context
    loading: authLoading,
  } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "", // Usually not editable directly
    phone: "",
    jobTitle: "", // e.g., "Recruitment Manager"
    department: "",
    avatarUrl: "",
    // Add other admin/recruiter specific fields if necessary
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // For initial data load
  const [isSaving, setIsSaving] = useState(false); // For save operation
  const [formError, setFormError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (!user && !authLoading) {
        setLoading(false);
        setFormError("User not authenticated.");
        return;
      }
      if (authLoading) return;

      setLoading(true);
      setFormError(null);
      try {
        // TODO: Replace with actual API call to get admin/recruiter's own profile
        const response = await recruiterAPI.getAdminProfile(); // Giả sử API này trả về đối tượng user/profile
        const currentProfile = response.profile || response.user || {}; // backend có thể trả về 'profile' hoặc 'user'

        // Mock data using current user from AuthContext nếu API trả về rỗng
        setProfileData({
          firstName: currentProfile.firstName || user?.firstName || "",
          lastName: currentProfile.lastName || user?.lastName || "",
          email: currentProfile.email || user?.email || "",
          phone: currentProfile.phone || user?.phone || "", 
          jobTitle: currentProfile.jobTitle || user?.jobTitle || "", 
          department: currentProfile.department || user?.department || "", 
          avatarUrl: currentProfile.avatarUrl || user?.avatarUrl || "/assets/images/admin-avatar.png", // Sử dụng avatar của user hoặc mặc định
        });
        setAvatarPreview(currentProfile.avatarUrl || user?.avatarUrl || "/assets/images/admin-avatar.png");
      } catch (err) {
        console.error("Error loading admin profile:", err);
        setFormError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, [user, authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
    if (submitSuccess) setSubmitSuccess(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        setFormError("Avatar file size should not exceed 2MB.");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setFormError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitSuccess(false);
    setIsSaving(true);

    if (!profileData.firstName || !profileData.lastName) {
      setFormError("First name and last name are required.");
      setIsSaving(false);
      return;
    }

    try {
      let newAvatarUrl = profileData.avatarUrl;
      if (avatarFile) {
        const avatarUploadResponse = await recruiterAPI.uploadAdminAvatar(avatarFile); // Pass file directly
        if (avatarUploadResponse.success && avatarUploadResponse.avatarUrl) {
          newAvatarUrl = avatarUploadResponse.avatarUrl;
        } else {
          throw new Error(avatarUploadResponse.error || "Failed to upload avatar.");
        }
      }

      const profileToUpdate = { ...profileData, avatarUrl: newAvatarUrl };
      const updateResponse = await recruiterAPI.updateAdminProfile(profileToUpdate); // API update profile text data

      if (updateResponse.success && updateResponse.profile) {
        updateUserContext({ ...user, ...updateResponse.profile, avatarUrl: newAvatarUrl }); // Update user in AuthContext
        setProfileData(updateResponse.profile); // Update local state
        setSubmitSuccess(true);
        setIsEditing(false);
        setAvatarFile(null); // Clear staged file
      } else {
        throw new Error(updateResponse.error || "Failed to update profile via API.");
      }
      
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating admin profile:", err);
      setFormError(
        err.message || "Failed to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormError(null);
    // Reset form to original data from user context or last fetched profile
    setProfileData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      jobTitle: user?.jobTitle || "",
      department: user?.department || "",
      avatarUrl: user?.avatarUrl || "/assets/images/admin-avatar.png",
    });
    setAvatarPreview(user?.avatarUrl || "/assets/images/admin-avatar.png");
    setAvatarFile(null);
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading profile..." />;
  }
  if (!user && !authLoading) {
    // Check if user is null and auth is not loading
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 text-lg">
          User not authenticated or profile data unavailable.
        </p>
        {/* Optionally, add a link to login or home */}
      </div>
    );
  }

  return (
    <div className="admin-profile-page p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="primary"
            iconLeft="pen"
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button onClick={handleCancelEdit} variant="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={isSaving}
              disabled={isSaving}
              variant="primary"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {formError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{formError}</p>
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
              src={getValidAvatar(avatarPreview)} // SỬA: fallback ảnh mặc định nếu avatar lỗi
              alt="Admin Avatar"
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
        <ProfileSection title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name*"
              name="firstName"
              value={profileData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            <Input
              label="Last Name*"
              name="lastName"
              value={profileData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={profileData.email}
              disabled={true}
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={profileData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </ProfileSection>

        {/* Professional Information */}
        <ProfileSection title="Professional Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Job Title"
              name="jobTitle"
              value={profileData.jobTitle}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Department"
              name="department"
              value={profileData.department}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </ProfileSection>

        {/* Add more sections as needed, e.g., Change Password */}
        {isEditing && (
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={isSaving}
              variant="primary"
            >
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

const ProfileSection = ({ title, children }) => (
  <section className="pb-8 mb-8 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
    <h3 className="text-xl font-semibold text-gray-700 mb-6">{title}</h3>
    <div className="space-y-4">{children}</div>
  </section>
);

export default AdminProfilePage;
