// src/pages/admin/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import { recruiterAPI } from '../../api/recruiter'; // Assuming API for settings
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SettingsPage = () => {
  const initialSettings = {
    emailNotifications: {
      newApplications: true,
      applicationStatusChanges: true,
      interviewReminders: true,
      weeklySummary: false,
    },
    security: {
      requireTwoFactorAuth: false,
      sessionTimeoutMinutes: 30,
      passwordExpiryDays: 90,
    },
    applicantPortal: {
      allowPublicRegistration: true,
      requireCvUpload: true,
      maxApplicationsPerUser: 5,
    },
    integrations: {
      linkedInActive: false,
      googleCalendarActive: false,
    },
    branding: {
      primaryColor: "#00BFA6", // Default MyaCorp teal
      logoUrl: "/assets/images/logo.png", // Default logo
    },
  };

  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true); // For initial load
  const [isSaving, setIsSaving] = useState(false); // For save operation
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await recruiterAPI.getSystemSettings(); // Replace with actual API call
        setSettings(response.payload || initialSettings);

        // Mock data for now
        // await new Promise((resolve) => setTimeout(resolve, 600));
        // You can merge fetched settings with initialSettings to ensure all keys exist
        // For mock, we just use initialSettings or a slightly modified version
        // setSettings(prev => ({ ...prev, ...mockFetchedSettings }));
      } catch (err) {
        console.error("Error loading settings:", err);
        setError("Failed to load settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (section, field, value, type = "string") => {
    let processedValue = value;
    if (type === "checkbox") {
      processedValue = value.target.checked;
    } else if (type === "number") {
      processedValue = parseInt(value.target.value, 10);
      if (isNaN(processedValue)) processedValue = 0; // Or handle error
    } else {
      processedValue = value.target.value;
    }

    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: processedValue,
      },
    }));
    if (error) setError(null);
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage("");
    try {
      await recruiterAPI.updateSystemSettings(settings); // Replace with actual API call
      // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(err.message || "Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading system settings..." />;
  }

  return (
    <div className="settings-page p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
        System Settings
      </h1>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      {successMessage && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md"
          role="alert"
        >
          <p className="font-bold">Success!</p>
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Email Notifications Section */}
        <SettingsSection title="Email Notifications" icon="envelope">
          <CheckboxSetting
            label="Notify on New Applications"
            checked={settings.emailNotifications.newApplications}
            onChange={(e) =>
              handleChange(
                "emailNotifications",
                "newApplications",
                e,
                "checkbox"
              )
            }
            description="Receive an email when a new candidate applies."
          />
          <CheckboxSetting
            label="Notify on Application Status Changes"
            checked={settings.emailNotifications.applicationStatusChanges}
            onChange={(e) =>
              handleChange(
                "emailNotifications",
                "applicationStatusChanges",
                e,
                "checkbox"
              )
            }
            description="Get notified when an applicant's status is updated."
          />
          <CheckboxSetting
            label="Notify on Interview Reminders"
            checked={settings.emailNotifications.interviewReminders}
            onChange={(e) =>
              handleChange(
                "emailNotifications",
                "interviewReminders",
                e,
                "checkbox"
              )
            }
            description="Send reminders for scheduled interviews to relevant parties."
          />
        </SettingsSection>

        {/* Security Settings Section */}
        <SettingsSection title="Security Settings" icon="shield-alt">
          <CheckboxSetting
            label="Require Two-Factor Authentication (2FA) for Admins"
            checked={settings.security.requireTwoFactorAuth}
            onChange={(e) =>
              handleChange("security", "requireTwoFactorAuth", e, "checkbox")
            }
            description="Enhance admin account security with 2FA."
          />
          <InputSetting
            label="Session Timeout (minutes)"
            type="number"
            value={settings.security.sessionTimeoutMinutes}
            onChange={(e) =>
              handleChange("security", "sessionTimeoutMinutes", e, "number")
            }
            min="5"
            max="240"
            description="Automatically log out users after this period of inactivity."
          />
          <InputSetting
            label="Password Expiry (days)"
            type="number"
            value={settings.security.passwordExpiryDays}
            onChange={(e) =>
              handleChange("security", "passwordExpiryDays", e, "number")
            }
            min="30"
            max="365"
            description="Force password change after this many days. Set to 0 to disable."
          />
        </SettingsSection>

        {/* Applicant Portal Settings Section */}
        <SettingsSection title="Applicant Portal" icon="user-cog">
          <CheckboxSetting
            label="Allow Public Candidate Registration"
            checked={settings.applicantPortal.allowPublicRegistration}
            onChange={(e) =>
              handleChange(
                "applicantPortal",
                "allowPublicRegistration",
                e,
                "checkbox"
              )
            }
            description="If unchecked, only invited candidates can register."
          />
          <CheckboxSetting
            label="Require CV/Resume Upload for Applications"
            checked={settings.applicantPortal.requireCvUpload}
            onChange={(e) =>
              handleChange("applicantPortal", "requireCvUpload", e, "checkbox")
            }
            description="Make CV/Resume a mandatory field during application."
          />
          <InputSetting
            label="Max Active Applications per Candidate"
            type="number"
            value={settings.applicantPortal.maxApplicationsPerUser}
            onChange={(e) =>
              handleChange(
                "applicantPortal",
                "maxApplicationsPerUser",
                e,
                "number"
              )
            }
            min="1"
            max="20"
            description="Limit the number of jobs a candidate can actively apply for."
          />
        </SettingsSection>

        {/* Branding Section - Example */}
        <SettingsSection title="Branding & Appearance" icon="palette">
          <InputSetting
            label="Primary Theme Color"
            type="color"
            value={settings.branding.primaryColor}
            onChange={(e) => handleChange("branding", "primaryColor", e)}
            description="Choose the main color for your recruitment portal."
          />
          {/* Logo upload would be more complex, typically handled separately */}
          <div className="text-sm text-gray-600">
            <p className="font-medium">Company Logo:</p>
            {settings.branding.logoUrl ? (
              <img
                src={settings.branding.logoUrl}
                alt="Current Logo"
                className="h-12 mt-2 border p-1"
              />
            ) : (
              "No logo set."
            )}
            <p className="text-xs mt-1">
              Logo upload functionality can be added here or in Company Profile.
            </p>
          </div>
        </SettingsSection>

        <div className="flex justify-end pt-8 mt-8 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:bg-gray-400"
          >
            {isSaving ? <LoadingSpinner size="sm" /> : "Save All Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper component for consistent section styling
const SettingsSection = ({ title, icon, children }) => (
  <section className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
      <FontAwesomeIcon icon={icon} className="mr-3 text-blue-500" />
      {title}
    </h2>
    <div className="space-y-6">{children}</div>
  </section>
);

// Helper component for checkbox settings
const CheckboxSetting = ({ label, checked, onChange, description }) => (
  <div>
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span className="text-md font-medium text-gray-700">{label}</span>
    </label>
    {description && (
      <p className="text-xs text-gray-500 mt-1 ml-8">{description}</p>
    )}
  </div>
);

// Helper component for input settings
const InputSetting = ({
  label,
  type,
  value,
  onChange,
  description,
  min,
  max,
  placeholder,
}) => (
  <div>
    <label className="block text-md font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      placeholder={placeholder}
      className={`w-full md:w-1/2 lg:w-1/3 p-2.5 border rounded-md focus:ring-2 ${
        type === "color" ? "h-10" : ""
      } border-gray-300 focus:border-blue-500 focus:ring-blue-200`}
    />
    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
  </div>
);

export default SettingsPage;
