import React, { useState, useEffect } from 'react';
import { recruiterAPI } from '../../api/recruiter';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    emailNotifications: {
      newApplications: true,
      applicationStatusChanges: true,
      newMessages: true,
      interviewReminders: true
    },
    security: {
      requireTwoFactor: false,
      sessionTimeout: 30, // minutes
      passwordExpiry: 90 // days
    },
    applicantPortal: {
      allowRegistration: true,
      requireEmailVerification: true,
      maxActiveApplications: 10,
      fileUploadTypes: '.pdf,.doc,.docx',
      maxFileSize: 5 // MB
    },
    recruitmentProcess: {
      autoRejectAfterDays: 30,
      defaultDeadlineDays: 30,
      allowReapplyAfterDays: 90
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await recruiterAPI.getSettings();
        setSettings(response.settings);
        setError(null);
      } catch (err) {
        setError('Failed to load settings. Please try again.');
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await recruiterAPI.updateSettings(settings);
      setSaved(true);
      setError(null);
      
      // Show success message for 3 seconds
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !settings) {
    return <div className="loading-indicator">Loading settings...</div>;
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>System Settings</h1>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {saved && (
        <div className="success-message">Settings saved successfully!</div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-section">
          <h2>Email Notifications</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications.newApplications}
                  onChange={(e) => handleChange('emailNotifications', 'newApplications', e.target.checked)}
                />
                New Applications
              </label>
              <p className="setting-description">
                Receive notifications when candidates apply for jobs
              </p>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications.applicationStatusChanges}
                  onChange={(e) => handleChange('emailNotifications', 'applicationStatusChanges', e.target.checked)}
                />
                Application Status Changes
              </label>
              <p className="setting-description">
                Receive notifications when application statuses are updated
              </p>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications.interviewReminders}
                  onChange={(e) => handleChange('emailNotifications', 'interviewReminders', e.target.checked)}
                />
                Interview Reminders
              </label>
              <p className="setting-description">
                Receive reminders for upcoming interviews
              </p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Security Settings</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.security.requireTwoFactor}
                  onChange={(e) => handleChange('security', 'requireTwoFactor', e.target.checked)}
                />
                Require Two-Factor Authentication
              </label>
              <p className="setting-description">
                Enable two-factor authentication for admin accounts
              </p>
            </div>

            <div className="setting-item">
              <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
              <input
                type="number"
                id="sessionTimeout"
                min="5"
                max="120"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
              />
              <p className="setting-description">
                Automatically log out users after period of inactivity
              </p>
            </div>

            <div className="setting-item">
              <label htmlFor="passwordExpiry">Password Expiry (days)</label>
              <input
                type="number"
                id="passwordExpiry"
                min="30"
                max="365"
                value={settings.security.passwordExpiry}
                onChange={(e) => handleChange('security', 'passwordExpiry', parseInt(e.target.value))}
              />
              <p className="setting-description">
                Require password change after specified number of days
              </p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Applicant Portal Settings</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.applicantPortal.allowRegistration}
                  onChange={(e) => handleChange('applicantPortal', 'allowRegistration', e.target.checked)}
                />
                Allow New Registrations
              </label>
              <p className="setting-description">
                Allow new candidates to register on the portal
              </p>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.applicantPortal.requireEmailVerification}
                  onChange={(e) => handleChange('applicantPortal', 'requireEmailVerification', e.target.checked)}
                />
                Require Email Verification
              </label>
              <p className="setting-description">
                Require email verification before allowing applications
              </p>
            </div>

            <div className="setting-item">
              <label htmlFor="maxActiveApplications">Max Active Applications</label>
              <input
                type="number"
                id="maxActiveApplications"
                min="1"
                max="50"
                value={settings.applicantPortal.maxActiveApplications}
                onChange={(e) => handleChange('applicantPortal', 'maxActiveApplications', parseInt(e.target.value))}
              />
              <p className="setting-description">
                Maximum number of active applications per candidate
              </p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Recruitment Process</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label htmlFor="autoRejectAfterDays">Auto-reject After (days)</label>
              <input
                type="number"
                id="autoRejectAfterDays"
                min="7"
                max="90"
                value={settings.recruitmentProcess.autoRejectAfterDays}
                onChange={(e) => handleChange('recruitmentProcess', 'autoRejectAfterDays', parseInt(e.target.value))}
              />
              <p className="setting-description">
                Automatically reject applications after specified days of no action
              </p>
            </div>

            <div className="setting-item">
              <label htmlFor="defaultDeadlineDays">Default Job Deadline (days)</label>
              <input
                type="number"
                id="defaultDeadlineDays"
                min="1"
                max="90"
                value={settings.recruitmentProcess.defaultDeadlineDays}
                onChange={(e) => handleChange('recruitmentProcess', 'defaultDeadlineDays', parseInt(e.target.value))}
              />
              <p className="setting-description">
                Default number of days for job posting deadlines
              </p>
            </div>

            <div className="setting-item">
              <label htmlFor="allowReapplyAfterDays">Allow Reapply After (days)</label>
              <input
                type="number"
                id="allowReapplyAfterDays"
                min="30"
                max="365"
                value={settings.recruitmentProcess.allowReapplyAfterDays}
                onChange={(e) => handleChange('recruitmentProcess', 'allowReapplyAfterDays', parseInt(e.target.value))}
              />
              <p className="setting-description">
                Days before a candidate can reapply to the same job
              </p>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="save-settings-btn"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;