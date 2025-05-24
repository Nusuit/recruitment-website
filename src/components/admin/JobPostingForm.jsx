// src/components/admin/JobPostingForm.jsx
// This component is very similar to `src/pages/admin/jobs/CreateJobPage.jsx`.
// If their functionalities are identical, consider merging them or using CreateJobPage directly.
// For this refactor, I'll make it a functional component assuming it might have slight variations
// or is used in a different context (e.g., as a modal form).

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recruiterAPI } from "../../api/recruiter";
import { validateJobPostingForm } from "../../utils/validators";
import LoadingSpinner from "../common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const JobPostingForm = ({
  isEditing = false,
  initialJobData = null,
  onFormSubmit,
  onCancel,
}) => {
  const navigate = useNavigate();
  const { jobId: paramJobId } = useParams(); // Get jobId from URL if this component is used as a page
  const jobIdForEdit = isEditing ? paramJobId || initialJobData?.id : null;

  const defaultInitialState = {
    title: "",
    department: "",
    location: "",
    type: "FULL_TIME",
    description: "",
    requirements: "",
    benefits: "",
    salaryMin: "",
    salaryMax: "",
    experienceLevel: "",
    educationLevel: "",
    deadline: "",
    status: "DRAFT",
    selectedSkills: [],
  };

  const [formData, setFormData] = useState(
    initialJobData || defaultInitialState
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(
    isEditing && !initialJobData && jobIdForEdit
  );
  const [apiError, setApiError] = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]);

  const fetchData = useCallback(async () => {
    if (isEditing && !initialJobData && jobIdForEdit) {
      setLoadingData(true);
    }
    setApiError(null);
    try {
      const skillsResponse = await recruiterAPI.getSkills();
      setAvailableSkills(skillsResponse.skills || []);

      if (isEditing && !initialJobData && jobIdForEdit) {
        const jobResponse = await recruiterAPI.getJobDetail(jobIdForEdit);
        const job = jobResponse.job;
        setFormData({
          title: job.title || "",
          department: job.department || "",
          location: job.location || "",
          type: job.type || "FULL_TIME",
          description: job.description || "",
          requirements: job.requirements || "",
          benefits: job.benefits || "",
          salaryMin: job.salaryMin?.toString() || "",
          salaryMax: job.salaryMax?.toString() || "",
          experienceLevel: job.experienceLevel || "",
          educationLevel: job.educationLevel || "",
          deadline: job.deadline ? job.deadline.split("T")[0] : "",
          status: job.status || "DRAFT",
          selectedSkills: job.skills ? job.skills.map((s) => s.id) : [],
        });
      } else if (initialJobData) {
        setFormData(initialJobData); // Use provided initial data
      }
    } catch (err) {
      console.error("Error fetching data for job form:", err);
      setApiError("Failed to load form data.");
    } finally {
      if (isEditing && !initialJobData && jobIdForEdit) {
        setLoadingData(false);
      }
    }
  }, [isEditing, initialJobData, jobIdForEdit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError(null);
  };

  const handleSkillChange = (skillId) => {
    setFormData((prev) => {
      const newSelectedSkills = prev.selectedSkills.includes(skillId)
        ? prev.selectedSkills.filter((id) => id !== skillId)
        : [...prev.selectedSkills, skillId];
      return { ...prev, selectedSkills: newSelectedSkills };
    });
  };

  const handleSubmitInternal = async (e, targetStatus = null) => {
    e.preventDefault();
    setApiError(null);
    const validationErrors = validateJobPostingForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setApiError("Please correct the form errors.");
      return;
    }

    setIsSubmitting(true);
    const jobPayload = {
      ...formData,
      salaryMin: formData.salaryMin ? parseInt(formData.salaryMin, 10) : null,
      salaryMax: formData.salaryMax ? parseInt(formData.salaryMax, 10) : null,
      skills: formData.selectedSkills,
      status: targetStatus || formData.status,
    };

    try {
      let response;
      if (isEditing && jobIdForEdit) {
        response = await recruiterAPI.updateJob(jobIdForEdit, jobPayload);
      } else {
        response = await recruiterAPI.createJob(jobPayload);
      }
      if (onFormSubmit) {
        onFormSubmit(response.job || response.data?.job); // Pass back the created/updated job
      } else {
        navigate("/admin/jobs", {
          state: {
            successMessage: `Job ${
              isEditing ? "updated" : "created"
            } successfully!`,
          },
        });
      }
    } catch (err) {
      console.error("Error submitting job form:", err);
      setApiError(
        err.message || `Failed to ${isEditing ? "update" : "create"} job.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = (e) => handleSubmitInternal(e, "ACTIVE");
  const handleSaveDraft = (e) => handleSubmitInternal(e, "DRAFT");

  if (loadingData) {
    return (
      <LoadingSpinner
        fullPage
        message={isEditing ? "Loading job details..." : "Loading form..."}
      />
    );
  }

  return (
    <div className="job-posting-form-component p-4 md:p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditing ? "Edit Job Posting" : "Create New Job Posting"}
      </h2>
      {apiError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
          role="alert"
        >
          <p>{apiError}</p>
        </div>
      )}
      <form onSubmit={handlePublish} className="space-y-6">
        {/* Basic Information Section (Simplified for brevity, reuse CreateJobPage's structure) */}
        <FormSection title="Basic Information">
          <InputField
            label="Job Title*"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
          <InputField
            label="Location*"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            required
          />
          {/* Add other basic fields: department, type, salaryMin, salaryMax */}
        </FormSection>

        <FormSection title="Job Details">
          <TextareaField
            label="Description*"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            required
            rows="5"
          />
          <TextareaField
            label="Requirements*"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            error={errors.requirements}
            required
            rows="5"
            placeholder="One requirement per line, start with '-' or '*'"
          />
          {/* Add benefits textarea */}
        </FormSection>

        <FormSection title="Qualifications">
          <SelectField
            label="Experience Level"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            options={[
              { value: "", label: "Select..." },
              { value: "ENTRY", label: "Entry" },
              { value: "JUNIOR", label: "Junior" } /* ... */,
            ]}
          />
          {/* Add educationLevel select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Skills
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableSkills.map((skill) => (
                <label
                  key={skill.id}
                  className="flex items-center space-x-2 text-sm p-2 border rounded-md hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    value={skill.id}
                    checked={formData.selectedSkills.includes(skill.id)}
                    onChange={() => handleSkillChange(skill.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>{skill.name}</span>
                </label>
              ))}
            </div>
          </div>
        </FormSection>

        <FormSection title="Posting Details">
          <InputField
            label="Application Deadline*"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            error={errors.deadline}
            required
            min={new Date().toISOString().split("T")[0]}
          />
          <SelectField
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: "DRAFT", label: "Draft" },
              { value: "ACTIVE", label: "Active" },
              { value: "PAUSED", label: "Paused" },
            ]}
          />
        </FormSection>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update Job"
              : "Publish Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper components for form structure (can be moved to a common file)
const FormSection = ({ title, children }) => (
  <div className="pb-6 mb-6 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const InputField = ({ label, name, error, ...props }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      {...props}
      className={`w-full p-2.5 border rounded-md focus:ring-2 ${
        error
          ? "border-red-500 ring-red-200"
          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
      }`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const TextareaField = ({ label, name, error, ...props }) => (
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
      {...props}
      className={`w-full p-2.5 border rounded-md focus:ring-2 ${
        error
          ? "border-red-500 ring-red-200"
          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
      }`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, name, options, error, ...props }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <select
      id={name}
      name={name}
      {...props}
      className={`w-full p-2.5 border rounded-md focus:ring-2 bg-white ${
        error
          ? "border-red-500 ring-red-200"
          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
      }`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default JobPostingForm;
