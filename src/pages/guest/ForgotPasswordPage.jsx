// src/pages/guest/ForgotPasswordPage.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { validateForgotPasswordForm } from "../../utils/validators";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/AuthForms.scss"; // Ensure SCSS is imported

const ForgotPasswordPage = () => {
  const { resetPassword } = useContext(AuthContext); // Assuming resetPassword sends the reset link
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const validationErrors = validateForgotPasswordForm({ email });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resetPassword(email); // Call context function
      if (result.success) {
        setSubmitSuccess(true);
        // Optionally navigate to a confirmation page or display message here
        // For now, we'll show the success message on this page.
        // navigate('/check-email', { state: { email, message: "Password reset instructions have been sent." } });
      } else {
        setSubmitError(result.error || "Failed to send password reset email.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-page">
      {" "}
      {/* Uses styles from AuthForms.scss */}
      <div className="password-container flex-col md:flex-row">
        {" "}
        {/* Ensure responsive stacking */}
        {/* Form Section */}
        <div className="password-form-section w-full md:w-1/2 lg:w-2/5 p-8 flex flex-col justify-center">
          <div className="brand-logo mb-8 text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-2">
              <img
                src="/assets/images/logo.png"
                alt="MyaCorp Logo"
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold text-blue-600">MyaCorp</span>
            </Link>
          </div>

          <div className="password-header mb-6 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-600">
              No worries! Enter your email below and we'll send you a link to
              reset your password.
            </p>
          </div>

          {submitSuccess ? (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="h-5 w-5 text-green-500"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-green-700">
                    Password Reset Email Sent
                  </h3>
                  <div className="mt-2 text-sm text-green-600">
                    <p>
                      Please check your email{" "}
                      <strong className="font-semibold">{email}</strong> for
                      instructions on how to reset your password. If you don't
                      see it, check your spam folder.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm"
                  role="alert"
                >
                  {submitError}
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:bg-gray-400"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}

          {!submitSuccess && (
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Log In
                </Link>
              </p>
            </div>
          )}
        </div>
        {/* Image Section - Hidden on small screens, shown on md+ */}
        <div className="hidden md:flex password-image-section w-full md:w-1/2 lg:w-3/5 bg-gradient-to-br from-purple-600 to-indigo-700 flex-col justify-center items-center p-8 relative">
          <div className="text-center text-white max-w-sm">
            <FontAwesomeIcon icon="key" className="text-6xl mb-8 opacity-80" />
            <h3 className="text-3xl font-bold mb-4">Password Recovery</h3>
            <p className="text-lg opacity-90">
              We'll help you get back into your account quickly and securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
