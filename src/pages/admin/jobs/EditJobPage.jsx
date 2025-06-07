import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recruiterAPI } from "../../../api/recruiter";
import { validateJobPostingForm } from "../../../utils/validators";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmptyState from "../../../components/common/EmptyState"; // Add EmptyState for job not found

const EditJobPage = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const isEditing = true; // This page is always for editing

  const initialFormData = {
    title: "",
    department: "",
    location: "",
    type: "FULL_TIME",
    description: "",
    requirement: "",
    benefit: "",
    salaryMin: "",
    salaryMax: "",
    experienceLevel: "",
    educationLevel: "",
    deadline: "",
    status: "DRAFT",
    selectedSkills: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [jobNotFound, setJobNotFound] = useState(false); // State to handle 404

  const fetchData = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    setJobNotFound(false);
    try {
      const skillsResponse = await recruiterAPI.getSkills();
      setAvailableSkills(skillsResponse.skills || []);

      if (isEditing && jobId) {
        const jobResponse = await recruiterAPI.getJobDetail(jobId);
        const job = jobResponse.payload; // Corrected to use .payload
        if (!job) {
          setJobNotFound(true);
          return;
        }
        setFormData({
          title: job.title || "",
          department: job.department || "",
          location: job.location || "",
          type: job.type || "FULL_TIME",
          description: job.description || "",
          requirement: job.requirement || "",
          benefit: job.benefit || "",
          salaryMin: job.minSalary?.toString() || "", // Changed from salaryMin to minSalary
          salaryMax: job.maxSalary?.toString() || "", // Changed from salaryMax to maxSalary
          experienceLevel: job.experienceLevel || "",
          educationLevel: job.educationLevel || "",
          deadline: job.deadline ? job.deadline.split("T")[0] : "",
          status: job.status || "DRAFT",
          selectedSkills: job.skills ? job.skills.map((s) => s.id) : [],
        });
      }
    } catch (err) {
      console.error("Error fetching data for job form:", err);
      if (err.response?.status === 404) {
        setJobNotFound(true);
      } else {
        setApiError("Failed to load necessary data. Please try refreshing the page.");
      }
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

    const validationErrors = validateJobPostingForm(formData);
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
      skills: formData.selectedSkills.map(skillId => ({
        skillId: skillId,
        required: true
      })),
      status: targetStatus || formData.status,
    };

    try {
      await recruiterAPI.updateJob(jobId, jobPayload); // Always update for this page
      navigate("/admin/jobs", {
        state: { successMessage: "Job updated successfully!" },
      });
    } catch (err) {
      console.error("Error updating job:", err);
      setApiError(err.message || "Failed to update job.");
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

  if (jobNotFound) {
    return (
      <EmptyState
        title="Job Not Found"
        description="The job you are trying to edit does not exist or has been deleted."
        icon="search"
      />
    );
  }

  return (
    <div className="create-job-page p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Job Posting
          </h1>
          <p className="text-gray-600">
            Fill in the details below to update the job.
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
                  Job Type*
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                    errors.type
                      ? "border-red-500 ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="TEMPORARY">Temporary</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
                {errors.type && (
                  <p className="text-xs text-red-600 mt-1">{errors.type}</p>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Details & Requirements */}
          <section className="p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Details & Requirements
            </h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="6"
                  className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                    errors.description
                      ? "border-red-500 ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                ></textarea>
                {errors.description && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="requirements"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Requirements (separate lines with Enter)*
                </label>
                <textarea
                  id="requirements"
                  name="requirement"
                  value={formData.requirement}
                  onChange={handleChange}
                  required
                  rows="6"
                  className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                    errors.requirement
                      ? "border-red-500 ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                ></textarea>
                {errors.requirement && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.requirement}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="benefits"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Benefits (separate lines with Enter)
                </label>
                <textarea
                  id="benefits"
                  name="benefit"
                  value={formData.benefit}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="salaryMin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Minimum Salary
                  </label>
                  <input
                    type="number"
                    id="salaryMin"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
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
                    Maximum Salary
                  </label>
                  <input
                    type="number"
                    id="salaryMax"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
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
              </div>
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
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="ENTRY">Entry Level</option>
                    <option value="MID">Mid Level</option>
                    <option value="SENIOR">Senior Level</option>
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
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="HIGH_SCHOOL">High School</option>
                    <option value="ASSOCIATE">Associate's Degree</option>
                    <option value="BACHELOR">Bachelor's Degree</option>
                    <option value="MASTER">Master's Degree</option>
                    <option value="PHD">PhD</option>
                  </select>
                </div>
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

          {/* Section 3: Skills */}
          <section className="p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {availableSkills.length > 0 ? (
                availableSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`skill-${skill.id}`}
                      checked={formData.selectedSkills.includes(skill.id)}
                      onChange={() => handleSkillChange(skill.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`skill-${skill.id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {skill.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No skills available. Please add skills in the backend.
                </p>
              )}
            </div>
            {errors.selectedSkills && (
              <p className="text-xs text-red-600 mt-1">
                {errors.selectedSkills}
              </p>
            )}
          </section>

          {/* Section 4: Status (Optional for draft) */}
          <section className="p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Job Status
            </h2>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="CLOSED">Closed</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)} // Go back to previous page
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Updating... <FontAwesomeIcon icon="spinner" spin className="ml-2" /></>
              ) : (
                "Update Job"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobPage;
