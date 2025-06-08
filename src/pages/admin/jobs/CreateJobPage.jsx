// src/pages/admin/jobs/CreateJobPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recruiterAPI } from "../../../api/recruiter"; // Assuming recruiterAPI is correctly set up
import { validateJobPostingForm } from "../../../utils/validators"; // Ensure this validator is appropriate
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CreateJobPage = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { jobId } = useParams(); // jobId from URL for editing

  const initialFormData = {
    title: "",
    department: "",
    location: "",
    type: "FULL_TIME", // Default value
    description: "",
    requirements: "", // Store as string, split by newline for display/editing if needed
    benefits: "", // Store as string
    salaryMin: "", // Will be required by validation
    salaryMax: "", // Will be required by validation
    salaryCurrency: "USD", // Required by backend
    experienceLevel: "", // e.g., "ENTRY", "MID", "SENIOR"
    educationLevel: "", // e.g., "BACHELOR", "MASTER"
    deadline: "",
    status: "DRAFT", // Default status
    selectedSkills: [], // Array of skill IDs or skill objects
    processId: 1, // Default process ID
    stages: [{ name: "Application Review", order: 1 }], // Default stage
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing); // True if editing, to fetch data
  const [apiError, setApiError] = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]); // Skills fetched from API

    // Fetch skills and job details (if editing)
  const fetchData = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      // Fetch skills with fallback data
      let skillsResponse;
      try {
        skillsResponse = await recruiterAPI.getSkills();
        console.log("✅ Skills loaded from API:", skillsResponse);
      } catch (err) {
        console.warn("⚠️ Skills API failed, using fallback data:", err);
        // Fallback skills data
        skillsResponse = [
          { id: 1, name: "JavaScript" },
          { id: 2, name: "React.js" },
          { id: 3, name: "Node.js" },
          { id: 4, name: "Python" },
          { id: 5, name: "Java" },
          { id: 6, name: "SQL" },
          { id: 7, name: "HTML/CSS" },
          { id: 8, name: "Git" },
          { id: 9, name: "Docker" },
          { id: 10, name: "AWS" }
        ];
      }
      
      // Ensure we always set arrays
      setAvailableSkills(Array.isArray(skillsResponse) ? skillsResponse : []);
      console.log("🔍 Available skills set:", skillsResponse);

      if (isEditing && jobId) {
        const jobResponse = await recruiterAPI.getJobDetail(jobId);
        const job = jobResponse.job;
        setFormData({
          title: job.title || "",
          department: job.department || "",
          location: job.location || "",
          type: job.type || "FULL_TIME",
          description: job.description || "",
          requirements: job.requirements || "", // Keep as string
          benefits: job.benefits || "", // Keep as string
          salaryMin: job.salaryMin?.toString() || "", // Ensure string
          salaryMax: job.salaryMax?.toString() || "", // Ensure string
          experienceLevel: job.experienceLevel || "",
          educationLevel: job.educationLevel || "",
          deadline: job.deadline ? job.deadline.split("T")[0] : "",
          status: job.status || "DRAFT",
          selectedSkills: job.skills ? job.skills.map((s) => s.id) : [], // Assuming skills are objects with id
        });
      }
    } catch (err) {
      console.error("Error fetching data for job form:", err);
      setApiError(
        "Failed to load necessary data. Please try refreshing the page."
      );
    } finally {
      setLoading(false);
    }
  }, [isEditing, jobId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError(null);
  };

  const handleSkillChange = (skillId) => {
    setFormData((prev) => {
      const newSelectedSkills = prev.selectedSkills.includes(skillId)
        ? prev.selectedSkills.filter((id) => id !== skillId)
        : [...prev.selectedSkills, skillId];
      return { ...prev, selectedSkills: newSelectedSkills };
    });
    if (errors.selectedSkills) {
      setErrors((prev) => ({ ...prev, selectedSkills: "" }));
    }
  };

  const handleSubmit = async (e, targetStatus = null) => {
    e.preventDefault();
    setApiError(null);

    // Custom validation for backend requirements
    const validationErrors = {};
    
    // Basic validations
    if (!formData.title.trim()) {
      validationErrors.title = "Job title is required";
    } else if (formData.title.trim().length < 3 || formData.title.trim().length > 100) {
      validationErrors.title = "Job title must be between 3 and 100 characters";
    }
    if (!formData.location.trim()) validationErrors.location = "Location is required";
    if (!formData.description.trim()) validationErrors.description = "Description is required";
    else if (formData.description.trim().length < 10) validationErrors.description = "Description must be at least 10 characters";
    if (!formData.requirements.trim()) validationErrors.requirements = "Requirements are required";
    if (!formData.deadline) validationErrors.deadline = "Application deadline is required";
    else {
      const deadlineDate = new Date(formData.deadline);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1); // Tomorrow
      tomorrow.setHours(0, 0, 0, 0); // Reset time to compare only dates
      if (deadlineDate < tomorrow) {
        validationErrors.deadline = "Deadline must be at least tomorrow";
      }
    }
    
    // Backend-specific validations
    if (formData.selectedSkills.length === 0 && availableSkills.length > 0) {
      validationErrors.selectedSkills = "At least one skill is required";
    }
    if (!formData.salaryMin || formData.salaryMin === "" || isNaN(parseInt(formData.salaryMin)) || parseInt(formData.salaryMin) < 1) {
      validationErrors.salaryMin = "Minimum salary is required and must be greater than 0";
    }
    if (!formData.salaryMax || formData.salaryMax === "" || isNaN(parseInt(formData.salaryMax)) || parseInt(formData.salaryMax) < 1) {
      validationErrors.salaryMax = "Maximum salary is required and must be greater than 0";
    }
    if (!formData.salaryCurrency) validationErrors.salaryCurrency = "Salary currency is required";
    if (!formData.processId) validationErrors.processId = "Recruitment process is required";
    
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setApiError("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    // Map form fields to database schema
    const status = targetStatus || formData.status;
    const dbStatus = status === 'ACTIVE' ? 'OPEN' : status === 'DRAFT' ? 'OPEN' : status;
    
    // Debug form data
    console.log("🔍 [CreateJobPage] Form data before payload:", formData);
    console.log("🔍 [CreateJobPage] Salary values:", {
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
      salaryMinType: typeof formData.salaryMin,
      salaryMaxType: typeof formData.salaryMax
    });

        // Ensure all salary values are properly parsed integers
    const parsedMinSalary = parseInt(formData.salaryMin, 10);
    const parsedMaxSalary = parseInt(formData.salaryMax, 10);

    // Try simplified payload first
    const jobPayload = {
      title: formData.title.trim(),
      department: formData.department.trim(),
      location: formData.location.trim(),
      type: formData.type,
      description: formData.description.trim(),
      requirements: formData.requirements.trim(),
      benefits: formData.benefits.trim(),
      deadline: formData.deadline,
      salaryCurrency: formData.salaryCurrency,
      status: dbStatus,
      // Salary fields - try multiple formats
      // Backend expects these exact field names (from @JsonProperty annotations)
      salaryMin: parseInt(formData.salaryMin, 10),
      salaryMax: parseInt(formData.salaryMax, 10),
      // Required by backend
      processId: formData.processId,
      skills: [{ skillId: 1, required: true }], // Simplified
      stages: [{ stageId: 1 }, { stageId: 2 }], // Simplified
    };

    console.log("🔍 [CreateJobPage] Final payload:", JSON.stringify(jobPayload, null, 2));

    try {
      let result;
      if (isEditing && jobId) {
        result = await recruiterAPI.updateJob(jobId, jobPayload);
        console.log("✅ [CreateJobPage] Job updated successfully:", result);
      } else {
        result = await recruiterAPI.createJob(jobPayload);
        console.log("✅ [CreateJobPage] Job created successfully:", result);
        
        // Store job data in session storage for fallback display in both admin and public areas
        const jobForStorage = {
          ...jobPayload,
          createdAt: new Date().toISOString(),
          // Get jobId from response, handle different response structures
          jobId: result?.id || result?.jobId || result?.payload?.id || result?.payload?.jobId || result?.data?.id || result?.data?.jobId,
          publishedForPublic: jobPayload.status === 'ACTIVE' // Only show in public if status is ACTIVE
        };
        
        sessionStorage.setItem('recentJobCreated', JSON.stringify(jobForStorage));
        
        // Also set a flag for public area to refresh
        if (jobPayload.status === 'ACTIVE') {
          sessionStorage.setItem('newPublicJobAvailable', 'true');
        }
        
        console.log("💾 [CreateJobPage] Stored job data in session storage for fallback display");
        console.log("🌐 [CreateJobPage] Job will be available for public:", jobPayload.status === 'ACTIVE');
      }
      
      // Add a small delay to ensure backend has processed the request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate("/admin/jobs", {
        state: {
          successMessage: isEditing
            ? "Job updated successfully!"
            : "Job created successfully!",
          refresh: true, // Flag to trigger refresh
        },
      });
    } catch (err) {
      console.error("Error submitting job:", err);
      
      // Provide more detailed error messages
      let errorMessage = "An error occurred. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      } else {
        errorMessage = isEditing ? "Failed to update job." : "Failed to create job.";
      }
      
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = (e) => {
    handleSubmit(e, "DRAFT");
  };

  if (loading) {
    return (
      <LoadingSpinner
        fullPage
        message={isEditing ? "Loading job details..." : "Loading form..."}
      />
    );
  }

  return (
    <div className="create-job-page p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditing ? "Edit Job Posting" : "Create New Job Posting"}
          </h1>
          <p className="text-gray-600">
            Fill in the details below to{" "}
            {isEditing ? "update the" : "create a new"} job.
          </p>
        </div>

        {apiError && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <section className="p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                    errors.title
                      ? "border-red-500 ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-red-600 mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location*
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                    errors.location
                      ? "border-red-500 ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                />
                {errors.location && (
                  <p className="text-xs text-red-600 mt-1">{errors.location}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Employment Type*
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
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="TEMPORARY">Temporary</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="salaryMin"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Minimum Salary (Monthly)*
                </label>
                <input
                  type="number"
                  id="salaryMin"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  placeholder="e.g., 1500"
                  min="1"
                  required
                  className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                    errors.salaryMin
                      ? "border-red-500 ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                />
                {errors.salaryMin && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.salaryMin}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="salaryMax"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Maximum Salary (Monthly)*
                </label>
                <input
                  type="number"
                  id="salaryMax"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  placeholder="e.g., 2500"
                  min="1"
                  required
                  className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                    errors.salaryMax
                      ? "border-red-500 ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                />
                {errors.salaryMax && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.salaryMax}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="salaryCurrency"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Salary Currency*
                </label>
                <select
                  id="salaryCurrency"
                  name="salaryCurrency"
                  value={formData.salaryCurrency}
                  onChange={handleChange}
                  required
                  className={`w-full p-2.5 border rounded-md focus:ring-2 bg-white ${
                    errors.salaryCurrency
                      ? "border-red-500 ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                >
                  <option value="USD">USD ($)</option>
                  <option value="VND">VND (₫)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
                {errors.salaryCurrency && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.salaryCurrency}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Application Deadline*
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Tomorrow
                  className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                    errors.deadline
                      ? "border-red-500 ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                />
                {errors.deadline && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.deadline}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Job Details */}
          <section className="p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Job Details
            </h2>
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
                placeholder="Provide a detailed description of the job role and responsibilities."
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.description}
                </p>
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
                rows="5"
                className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                  errors.requirements
                    ? "border-red-500 ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
                placeholder="List key requirements. Enter each on a new line, starting with '-' or '*'."
              />
              {errors.requirements && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.requirements}
                </p>
              )}
            </div>
            <div className="mt-4">
              <label
                htmlFor="benefits"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Benefits
              </label>
              <textarea
                id="benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows="4"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="List benefits. Enter each on a new line, starting with '-' or '*'."
              />
            </div>
          </section>

          {/* Section 3: Qualifications */}
          <section className="p-6 border border-gray-200 rounded-lg" key="qualifications-section">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Qualifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="experienceLevel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Experience Level
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select experience level</option>
                  <option value="ENTRY">Entry Level</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="MID">Mid-Level</option>
                  <option value="SENIOR">Senior</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="educationLevel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Education Level
                </label>
                <select
                  id="educationLevel"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select education level</option>
                  <option value="HIGH_SCHOOL">High School</option>
                  <option value="ASSOCIATE">Associate Degree</option>
                  <option value="BACHELOR">Bachelor's Degree</option>
                  <option value="MASTER">Master's Degree</option>
                  <option value="DOCTORATE">PhD</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills*
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.isArray(availableSkills) && availableSkills.length > 0 ? (
                  availableSkills.map((skill) => (
                    <label
                      key={skill.id}
                      className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer p-2 border border-gray-200 rounded-md hover:bg-gray-50"
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
                  ))
                ) : (
                  <div className="col-span-full p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-700 text-sm">
                      <strong>Skills list is loading...</strong> A default skill will be automatically assigned.
                    </p>
                    <p className="text-yellow-600 text-xs mt-1">
                      You can edit skills later when the skills list becomes available.
                    </p>
                  </div>
                )}
              </div>
              {errors.selectedSkills && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.selectedSkills}
                </p>
              )}
            </div>
          </section>

          {/* Section 4: Posting Details */}
          <section className="p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Posting Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active / Published</option>
                  <option value="PAUSED">Paused</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin/jobs")}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAsDraft}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
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
    </div>
  );
};

export default CreateJobPage;
