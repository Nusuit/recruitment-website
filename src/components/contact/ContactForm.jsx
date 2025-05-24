// src/components/contact/ContactForm.jsx
import React, { useState } from "react";
import { validateContactForm } from "../../utils/validators"; // Assuming this validator exists and is up-to-date
// import { generalAPI } from '../../api/general'; // Example: if you have a general API for contact forms
import LoadingSpinner from "../common/LoadingSpinner";
import Button from "../common/Button"; // Using the refactored Button component
import Input from "../common/Input"; // Using the refactored Input component

const ContactForm = ({ className = "" }) => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "", // Changed from phoneNumber
    subject: "",
    message: "",
  };

  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSubmitError(""); // Clear general submit error on new input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const validationErrors = validateContactForm(formData); // Use your validator
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      // await generalAPI.submitContactInquiry(formData);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      setSubmitSuccess(true);
      setFormData(initialValues); // Reset form on success
      setTimeout(() => setSubmitSuccess(false), 5000); // Hide success message after 5 seconds
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitError(
        error.message || "Failed to send message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div
        className={`contact-form-container text-center p-8 bg-green-50 border-2 border-green-200 rounded-lg shadow-md ${className}`}
      >
        <FontAwesomeIcon
          icon="check-circle"
          className="text-5xl text-green-500 mb-4"
        />
        <h3 className="text-2xl font-semibold text-green-700 mb-2">
          Message Sent Successfully!
        </h3>
        <p className="text-gray-600">
          Thank you for reaching out. We will get back to you as soon as
          possible.
        </p>
      </div>
    );
  }

  return (
    <div className={`contact-form-container ${className}`}>
      {/* Removed h2 and p from here, assuming parent page provides context */}
      {submitError && (
        <div
          className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm mb-6"
          role="alert"
        >
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name*"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
            placeholder="Enter your first name"
          />
          <Input
            label="Last Name*"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
            placeholder="Enter your last name"
          />
        </div>
        <Input
          label="Email Address*"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          placeholder="you@example.com"
        />
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="(+84) 123 456 789"
        />
        <Input
          label="Subject*"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          error={errors.subject}
          required
          placeholder="Regarding..."
        />
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message*
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Write your message here..."
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
              errors.message
                ? "border-red-500 ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
          />
          {errors.message && (
            <p className="text-xs text-red-600 mt-1">{errors.message}</p>
          )}
        </div>
        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
            variant="primary"
            size="lg"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </div>
  );
};

ContactForm.propTypes = {
  className: PropTypes.string,
};

export default ContactForm;
