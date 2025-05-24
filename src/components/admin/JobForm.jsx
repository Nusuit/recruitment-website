// src/components/admin/JobForm.jsx
// This component appears to be very similar in purpose to CreateJobPage.jsx and JobPostingForm.jsx.
// It's refactored here as a functional component.
// Consider consolidating these if their functionality is identical to avoid redundancy.

import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; // If used as a standalone page/route component
import { recruiterAPI } from "../../api/recruiter"; // Assuming API functions
import { validateJobPostingForm } from "../../utils/validators"; // Use a relevant validator
import Button from "../common/Button";
import Input from "../common/Input";
import LoadingSpinner from "../common/LoadingSpinner";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const JobForm = ({
  initialData = null,
  isEditing = false,
  onSubmitSuccess,
  onCancel,
}) => {
  const navigate = useNavigate(); // Only if this form can navigate on its own

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
    selectedSkills: [], // Assuming skills are IDs or names
  };

  const [formData, setFormData] = useState(initialData || defaultInitialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]); // For skill selection

  // Fetch available skills (if needed for a dropdown/checkbox group)
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // const skillsResponse = await recruiterAPI.getSkills();
        // setAvailableSkills(skillsResponse.skills || []);
        // Mock skills
        setAvailableSkills([
          { id: "skill1", name: "Fashion Design" },
          { id: "skill2", name: "Merchandising" },
          { id: "skill3", name: "Marketing" },
          { id: "skill4", name: "Adobe Suite" },
          { id: "skill5", name: "Retail Management" },
          { id: "skill6", name: "Trend Analysis" },
        ]);
      } catch (err) {
        console.error("Error fetching skills for JobForm:", err);
        // Handle error (e.g., set an error message)
      }
    };
    fetchSkills();
  }, []);

  // If initialData is passed, populate the form
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultInitialState, // Ensure all fields are present
        ...initialData,
        salaryMin: initialData.salaryMin?.toString() || "",
        salaryMax: initialData.salaryMax?.toString() || "",
        deadline: initialData.deadline
          ? initialData.deadline.split("T")[0]
          : "",
        selectedSkills: Array.isArray(initialData.skills)
          ? initialData.skills.map((s) => (typeof s === "object" ? s.id : s))
          : [],
      });
    }
  }, [initialData]);

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

  const handleSubmit = async (e, targetStatus = null) => {
    e.preventDefault();
    setApiError(null);
    const validationErrors = validateJobPostingForm(formData); // Use your validator
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setApiError("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    const jobPayload = {
      ...formData,
      salaryMin: formData.salaryMin ? parseInt(formData.salaryMin, 10) : null,
      salaryMax: formData.salaryMax ? parseInt(formData.salaryMax, 10) : null,
      skills: formData.selectedSkills, // Send array of skill IDs/names
      status: targetStatus || formData.status,
    };
    // Remove selectedSkills if your API expects 'skills' directly
    // delete jobPayload.selectedSkills;

    try {
      let response;
      if (isEditing && formData.id) {
        // Assuming initialData contains id if editing
        response = await recruiterAPI.updateJob(formData.id, jobPayload);
      } else {
        response = await recruiterAPI.createJob(jobPayload);
      }

      if (onSubmitSuccess) {
        onSubmitSuccess(response.job || response.data?.job); // Pass back the job data
      } else {
        // Default navigation if not handled by parent
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

  const handlePublish = (e) => handleSubmit(e, "ACTIVE");
  const handleSaveDraft = (e) => handleSubmit(e, "DRAFT");

  return (
    <div className="job-form-container p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
        {isEditing ? "Edit Job Details" : "Create New Job"}
      </h2>
      {apiError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md"
          role="alert"
        >
          <p>{apiError}</p>
        </div>
      )}
      <form onSubmit={handlePublish} className="space-y-6">
        {/* Replicate form sections and fields from CreateJobPage.jsx or JobPostingForm.jsx */}
        {/* Example: Basic Info */}
        <section>
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Title*"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
            />
            <Input
              label="Location*"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              required
            />
            <Input
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Type*
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                {/* Add other types */}
              </select>
            </div>
          </div>
        </section>

        {/* Description */}
        <section>
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Job Details
          </h3>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                errors.description
                  ? "border-red-500 ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">{errors.description}</p>
            )}
          </div>
          <div className="mt-4">
            <label
              htmlFor="requirements"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Requirements*
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              rows="4"
              className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                errors.requirements
                  ? "border-red-500 ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="List key requirements, one per line."
            />
            {errors.requirements && (
              <p className="text-xs text-red-600 mt-1">{errors.requirements}</p>
            )}
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Skills</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {availableSkills.map((skill) => (
              <label
                key={skill.id}
                className="flex items-center space-x-2 text-sm p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
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
        </section>

        <div className="flex justify-end space-x-3 pt-5 border-t mt-6">
          {onCancel && (
            <Button type="button" onClick={onCancel} variant="secondary">
              Cancel
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSaveDraft}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            variant="outline-primary"
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            variant="primary"
          >
            {isEditing ? "Update Job" : "Publish Job"}
          </Button>
        </div>
      </form>
    </div>
  );
};

JobForm.propTypes = {
  initialData: PropTypes.object,
  isEditing: PropTypes.bool,
  onSubmitSuccess: PropTypes.func, // Callback with submitted job data
  onCancel: PropTypes.func, // Callback for cancel action
};

export default JobForm;
