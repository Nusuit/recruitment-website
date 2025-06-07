// src/pages/admin/CompanyProfilePage.jsx
import React, { useState, useEffect } from "react";
import { recruiterAPI } from "../../api/recruiter"; // Assuming recruiterAPI for company profile
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CompanyProfilePage = () => {
  const initialValues = {
    name: "",
    logoUrl: "", // Store URL, not file object
    description: "",
    website: "",
    industry: "",
    employeeCount: "",
    foundedYear: "",
    mission: "",
    vision: "",
    location: "", // City, Country
    address: "", // Street address
    email: "",
    phone: "",
    facebook: "", // Store username/page ID
    linkedin: "", // Store company name/ID for URL
    twitter: "", // Store username
    instagram: "", // Store username
  };

  const [profile, setProfile] = useState(initialValues);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [logoFile, setLogoFile] = useState(null); // For new logo upload
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      setLoading(true);
      setFormError(null);
      try {
        const response = await recruiterAPI.getCompanyProfileDetails(); // Replace with actual API call
        setProfile(response.payload || initialValues);
        setLogoPreview(response.payload?.logoUrl || '');
      } catch (err) {
        console.error("Error loading company profile:", err);
        setFormError("Failed to load company profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        setFormError("Logo file size should not exceed 2MB.");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setFormError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitSuccess(false);
    setLoading(true); // Use general loading for submission

    try {
      let updatedLogoUrl = profile.logoUrl;
      if (logoFile) {
        const logoFormData = new FormData();
        logoFormData.append("logo", logoFile); // Match backend field name
        const uploadResponse = await recruiterAPI.uploadCompanyLogoFile(logoFormData); // API to upload logo
        updatedLogoUrl = uploadResponse.payload.logoUrl; // Get new URL
      }

      const profileToUpdate = { ...profile, logoUrl: updatedLogoUrl };
      await recruiterAPI.updateCompanyProfileDetails(profileToUpdate); // API to update profile data

      setProfile(profileToUpdate); // Update local state with new logo URL
      setIsEditing(false);
      setSubmitSuccess(true);
      setLogoFile(null); // Clear staged file
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating company profile:", err);
      setFormError(
        err.message || "Failed to update company profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormError(null);
    // Optionally re-fetch or reset to original profile data if changes were made but not saved
    // For now, just revert logo preview if a new file was selected
    setLogoPreview(profile.logoUrl || "");
    setLogoFile(null);
  };

  if (loading && !profile.name) {
    // Initial loading
    return <LoadingSpinner fullPage message="Loading company profile..." />;
  }

  return (
    <div className="company-profile-page p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">Company Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <FontAwesomeIcon icon="pen" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancelEdit}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? <LoadingSpinner size="sm" /> : "Save Changes"}
            </button>
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
          <p>Company profile updated successfully.</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-8"
      >
        {/* Logo and Basic Info */}
        <section className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-gray-200">
          <div className="relative group">
            <img
              src={logoPreview || "/assets/images/company-logo-placeholder.png"}
              alt="Company Logo"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-contain border-4 border-gray-200 shadow-md bg-gray-50"
            />
            {isEditing && (
              <label
                htmlFor="logo-upload"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm font-medium rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FontAwesomeIcon icon="camera" className="mr-1" /> Change
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Company Name"
                className="text-3xl font-bold text-gray-800 w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none mb-2"
              />
            ) : (
              <h2 className="text-3xl font-bold text-gray-800">
                {profile.name || "Company Name"}
              </h2>
            )}
            {isEditing ? (
              <input
                type="text"
                name="industry"
                value={profile.industry}
                onChange={handleChange}
                placeholder="Industry"
                className="text-gray-600 w-full p-1 border-b border-gray-300 focus:border-blue-500 outline-none"
              />
            ) : (
              <p className="text-gray-600">{profile.industry || "Industry"}</p>
            )}
          </div>
        </section>

        {/* About Section */}
        <FormSection title="About Company">
          <TextareaField
            label="Company Description"
            name="description"
            value={profile.description}
            onChange={handleChange}
            disabled={!isEditing}
            rows="5"
            placeholder="Tell us about your company..."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextareaField
              label="Mission"
              name="mission"
              value={profile.mission}
              onChange={handleChange}
              disabled={!isEditing}
              rows="3"
              placeholder="Company's mission statement"
            />
            <TextareaField
              label="Vision"
              name="vision"
              value={profile.vision}
              onChange={handleChange}
              disabled={!isEditing}
              rows="3"
              placeholder="Company's vision statement"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Website URL"
              name="website"
              value={profile.website}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="https://company.com"
            />
            <InputField
              label="Founded Year"
              name="foundedYear"
              type="number"
              value={profile.foundedYear}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="e.g., 2010"
            />
            <InputField
              label="Employee Count"
              name="employeeCount"
              value={profile.employeeCount}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="e.g., 50-200"
            />
          </div>
        </FormSection>

        {/* Contact Information */}
        <FormSection title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Contact Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="contact@company.com"
            />
            <InputField
              label="Contact Phone"
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="+1234567890"
            />
          </div>
          <InputField
            label="Main Location / Headquarters"
            name="location"
            value={profile.location}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="City, Country"
          />
          <TextareaField
            label="Full Address"
            name="address"
            value={profile.address}
            onChange={handleChange}
            disabled={!isEditing}
            rows="2"
            placeholder="Street, City, Postal Code, Country"
          />
        </FormSection>

        {/* Social Media */}
        <FormSection title="Social Media Links">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SocialInputField
              label="Facebook"
              name="facebook"
              value={profile.facebook}
              onChange={handleChange}
              disabled={!isEditing}
              prefix="facebook.com/"
            />
            <SocialInputField
              label="LinkedIn"
              name="linkedin"
              value={profile.linkedin}
              onChange={handleChange}
              disabled={!isEditing}
              prefix="linkedin.com/company/"
            />
            <SocialInputField
              label="Twitter"
              name="twitter"
              value={profile.twitter}
              onChange={handleChange}
              disabled={!isEditing}
              prefix="twitter.com/"
            />
            <SocialInputField
              label="Instagram"
              name="instagram"
              value={profile.instagram}
              onChange={handleChange}
              disabled={!isEditing}
              prefix="instagram.com/"
            />
          </div>
        </FormSection>
      </form>
    </div>
  );
};

// Helper components for form structure
const FormSection = ({ title, children }) => (
  <section className="pb-8 mb-8 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
    <h3 className="text-xl font-semibold text-gray-700 mb-6">{title}</h3>
    <div className="space-y-6">{children}</div>
  </section>
);

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled,
  placeholder = "",
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full p-2.5 border rounded-md focus:ring-2 ${
        disabled
          ? "bg-gray-100 cursor-not-allowed"
          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
      }`}
    />
  </div>
);

const TextareaField = ({
  label,
  name,
  value,
  onChange,
  disabled,
  rows = 3,
  placeholder = "",
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      placeholder={placeholder}
      className={`w-full p-2.5 border rounded-md focus:ring-2 ${
        disabled
          ? "bg-gray-100 cursor-not-allowed"
          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
      }`}
    />
  </div>
);

const SocialInputField = ({
  label,
  name,
  value,
  onChange,
  disabled,
  prefix,
  placeholder = "username",
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <div className="flex rounded-md shadow-sm">
      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
        {prefix}
      </span>
      <input
        type="text"
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
        }`}
      />
    </div>
  </div>
);

export default CompanyProfilePage;
