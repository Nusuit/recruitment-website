// src/pages/guest/ContactPage.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { candidateAPI } from '../../api/candidate'; // Assuming an API for contact form submission
import { validateContactForm } from "../../utils/validators"; // Assuming this validator exists
import LoadingSpinner from "../../components/common/LoadingSpinner";

// ContactForm component defined within ContactPage for simplicity in this refactor pass
const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "", // Changed from phoneNumber to match common naming
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
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
      // Simulate API call
      // await candidateAPI.submitContactForm(formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      }); // Reset form
      setTimeout(() => setSubmitSuccess(false), 5000); // Hide success message after 5s
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitError("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg">
        <FontAwesomeIcon
          icon="check-circle"
          className="text-5xl text-green-500 mb-4"
        />
        <h3 className="text-2xl font-semibold text-green-700 mb-2">
          Message Sent!
        </h3>
        <p className="text-gray-600">
          Thank you for contacting us. We'll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm">
          {submitError}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name*
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className={`w-full p-3 border rounded-md focus:ring-2 ${
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
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className={`w-full p-3 border rounded-md focus:ring-2 ${
              errors.lastName
                ? "border-red-500 ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
          />
          {errors.lastName && (
            <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address*
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={`w-full p-3 border rounded-md focus:ring-2 ${
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
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Subject*
        </label>
        <input
          type="text"
          name="subject"
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className={`w-full p-3 border rounded-md focus:ring-2 ${
            errors.subject
              ? "border-red-500 ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
        />
        {errors.subject && (
          <p className="text-xs text-red-600 mt-1">{errors.subject}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Message*
        </label>
        <textarea
          name="message"
          id="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="5"
          className={`w-full p-3 border rounded-md focus:ring-2 ${
            errors.message
              ? "border-red-500 ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
        />
        {errors.message && (
          <p className="text-xs text-red-600 mt-1">{errors.message}</p>
        )}
      </div>
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:bg-gray-400"
        >
          {isSubmitting ? <LoadingSpinner size="sm" /> : "Send Message"}
        </button>
      </div>
    </form>
  );
};

const ContactPage = () => {
  const contactDetails = [
    {
      icon: "map-marker-alt",
      title: "Address",
      lines: ["123 Fashion Street, District 1", "HCM City, Vietnam"],
    },
    {
      icon: "phone",
      title: "Phone",
      lines: ["+84 999 999 999", "+84 888 888 888"],
    },
    {
      icon: "envelope",
      title: "Email",
      lines: ["info@myacorp.com", "support@myacorp.com"],
    },
    {
      icon: "clock",
      title: "Working Hours",
      lines: ["Mon - Fri: 9 AM - 6 PM", "Sat: 9 AM - 1 PM"],
    },
  ];

  return (
    <div className="contact-page py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're here to help and answer any question you might have. We look
            forward to hearing from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information Section */}
          <div className="space-y-8">
            {contactDetails.map((detail) => (
              <div
                key={detail.title}
                className="flex items-start p-6 bg-white rounded-xl shadow-lg border border-gray-100"
              >
                <FontAwesomeIcon
                  icon={detail.icon}
                  className="text-3xl text-blue-600 mr-6 mt-1 flex-shrink-0 w-8"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {detail.title}
                  </h3>
                  {detail.lines.map((line, index) => (
                    <p key={index} className="text-gray-600">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form Section */}
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Send Us a Message
            </h2>
            <ContactForm />
          </div>
        </div>

        {/* Map Section (Placeholder) */}
        <div className="mt-16 md:mt-24">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Find Us On The Map
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Replace with actual map embed, e.g., Google Maps iframe */}
            <div className="w-full h-80 md:h-96 bg-gray-200 flex items-center justify-center text-gray-500">
              {/* Placeholder for map */}
              <FontAwesomeIcon
                icon="map-marked-alt"
                className="text-6xl mr-4"
              />
              Map will be displayed here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
