// src/components/jobs/ApplyForm.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  useNavigate, // No longer using withRouter, so history is not available via props
} from "react-router-dom";
import PropTypes from "prop-types";
import { applicantAPI } from "../../api/applicant"; // Assuming API calls
import { AuthContext } from "../../contexts/AuthContext"; // To prefill user data
import { JobsContext } from "../../contexts/JobsContext"; // To mark as applied
import LoadingSpinner from "../common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ApplyForm = ({ jobId, jobTitle, onSubmitSuccess }) => {
  const { user } = useContext(AuthContext);
  const { submitApplication } = useContext(JobsContext); // Get submitApplication from context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resume: null, // Store File object
    coverLetter: "",
    linkedIn: "",
    portfolio: "",
    expectedSalary: "",
    availableDate: "",
    // Additional questions can be added here or fetched dynamically
    questions: {
      workAuthorization: "", // Example question
    },
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fileName, setFileName] = useState("");

  // Prefill form with user data from AuthContext
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        // Potentially prefill other fields if available in user object
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("questions.")) {
      const questionKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        questions: { ...prev.questions, [questionKey]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear specific error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          resume: "File size should not exceed 5MB.",
        }));
        setFileName("");
        setFormData((prev) => ({ ...prev, resume: null }));
        e.target.value = null; // Reset file input
        return;
      }
      setFormData((prev) => ({ ...prev, resume: file }));
      setFileName(file.name);
      setErrors((prev) => ({ ...prev, resume: "" }));
    } else {
      setFormData((prev) => ({ ...prev, resume: null }));
      setFileName("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.resume) newErrors.resume = "Resume/CV is required.";
    // Add more validations as needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitError("Please correct the errors in the form.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Use the submitApplication from JobsContext which handles local state/localStorage
      const applicationPayload = { ...formData };
      // The resume File object is already in formData.resume
      // If your API expects a FormData object, you'd construct it here.
      // For now, JobsContext's submitApplication will handle it.

      const result = await submitApplication(jobId, applicationPayload);

      if (result.success) {
        if (onSubmitSuccess) {
          onSubmitSuccess(result.application); // Pass application data to parent
        } else {
          // Default behavior if onSubmitSuccess is not provided
          alert("Application submitted successfully!");
          navigate("/applicant/applications"); // Navigate to applications page
        }
      } else {
        setSubmitError(
          result.error || "Failed to submit application. Please try again."
        );
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      setSubmitError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="apply-form space-y-6 p-1">
      {" "}
      {/* Removed p-6 for modal usage */}
      {submitError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{submitError}</span>
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name*
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                errors.firstName
                  ? "border-red-500 ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.firstName && (
              <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name*
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                errors.lastName
                  ? "border-red-500 ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.lastName && (
              <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                errors.email
                  ? "border-red-500 ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone*
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                errors.phone
                  ? "border-red-500 ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Professional Information
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="resume"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Resume/CV*
            </label>
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                errors.resume ? "border-red-500" : "border-gray-300"
              } border-dashed rounded-md`}
            >
              <div className="space-y-1 text-center">
                <FontAwesomeIcon
                  icon="file-arrow-up"
                  className="mx-auto h-10 w-10 text-gray-400"
                />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="resume-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="resume-upload"
                      name="resume"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                {fileName ? (
                  <p className="text-xs text-gray-500">{fileName}</p>
                ) : (
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX up to 5MB
                  </p>
                )}
              </div>
            </div>
            {errors.resume && (
              <p className="text-xs text-red-600 mt-1">{errors.resume}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="coverLetter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cover Letter (Optional)
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows="4"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us why you're a great fit for this role..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="linkedIn"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                LinkedIn Profile (Optional)
              </label>
              <input
                type="url"
                id="linkedIn"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            <div>
              <label
                htmlFor="portfolio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Portfolio URL (Optional)
              </label>
              <input
                type="url"
                id="portfolio"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Additional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="expectedSalary"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Expected Salary (Optional)
            </label>
            <input
              type="text"
              id="expectedSalary"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., $50,000 per year"
            />
          </div>
          <div>
            <label
              htmlFor="availableDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Available Start Date (Optional)
            </label>
            <input
              type="date"
              id="availableDate"
              name="availableDate"
              value={formData.availableDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        {/* Example additional question */}
        <div className="mt-4">
          <label
            htmlFor="questions.workAuthorization"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Are you legally authorized to work in the country for this
            position?*
          </label>
          <select
            id="questions.workAuthorization"
            name="questions.workAuthorization"
            value={formData.questions.workAuthorization}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Select an option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors["questions.workAuthorization"] && (
            <p className="text-xs text-red-600 mt-1">
              {errors["questions.workAuthorization"]}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-3 mt-8">
        <button
          type="button"
          onClick={() => navigate(-1)} // Go back
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isSubmitting ? (
            <LoadingSpinner size="small" />
          ) : (
            "Submit Application"
          )}
        </button>
      </div>
    </form>
  );
};

ApplyForm.propTypes = {
  jobId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  jobTitle: PropTypes.string.isRequired,
  onSubmitSuccess: PropTypes.func, // Callback for successful submission
};

export default ApplyForm;
