// src/pages/guest/ResetPasswordPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext"; // Assuming AuthContext handles reset password logic
import authAPI from "../../api/auth"; // Or use authAPI directly
import { validateResetPasswordForm } from "../../utils/validators";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/AuthForms.scss";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { resetPasswordWithToken } = useContext(AuthContext); // Example context function

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    } else {
      setSubmitError(
        "Invalid or missing password reset token. Please request a new reset link."
      );
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!token) {
      setSubmitError("Password reset token is missing.");
      return;
    }

    const validationErrors = validateResetPasswordForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Use authAPI directly or a context function
      const result = await authAPI.resetPassword(token, formData.password);
      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate("/login", {
            state: {
              successMessage:
                "Password reset successfully! You can now log in with your new password.",
            },
          });
        }, 3000);
      } else {
        setSubmitError(
          result.error ||
            "Failed to reset password. The link may be invalid or expired."
        );
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token && !submitError) {
    // This handles the case where token is not yet set but no explicit error has occurred.
    // It might be during initial render before useEffect runs.
    return <LoadingSpinner fullPage message="Validating reset link..." />;
  }

  return (
    <div className="reset-password-page">
      {" "}
      {/* Uses styles from AuthForms.scss */}
      <div className="password-container flex-col md:flex-row">
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
              Set New Password
            </h2>
            <p className="text-gray-600">
              Choose a strong new password for your account.
            </p>
          </div>

          {submitError &&
            !token && ( // Show this if token was invalid from the start
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md text-center">
                <FontAwesomeIcon
                  icon="exclamation-triangle"
                  className="text-3xl mb-3"
                />
                <h3 className="text-lg font-semibold mb-2">
                  Invalid Reset Link
                </h3>
                <p className="text-sm">{submitError}</p>
                <Link
                  to="/forgot-password"
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Request a New Link
                </Link>
              </div>
            )}

          {submitSuccess ? (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-md text-center">
              <FontAwesomeIcon
                icon="check-circle"
                className="text-5xl text-green-500 mb-4"
              />
              <h3 className="text-xl font-medium text-green-700 mb-2">
                Password Reset Successful!
              </h3>
              <p className="text-sm text-green-600">
                Redirecting to login page...
              </p>
            </div>
          ) : (
            token && ( // Only show form if token exists
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
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.password
                          ? "border-red-500 ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? "eye-slash" : "eye"}
                      />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.password}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.confirmPassword
                          ? "border-red-500 ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={toggleShowConfirmPassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? "eye-slash" : "eye"}
                      />
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.confirmPassword}
                    </p>
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
                    "Reset Password"
                  )}
                </button>
                <div className="mt-4 text-center text-sm">
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            )
          )}
        </div>
        {/* Image Section */}
        <div className="hidden md:flex password-image-section w-full md:w-1/2 lg:w-3/5 bg-gradient-to-br from-green-500 to-teal-600 flex-col justify-center items-center p-8 relative">
          <div className="text-center text-white max-w-sm">
            <FontAwesomeIcon
              icon="lock-open"
              className="text-6xl mb-8 opacity-80"
            />
            <h3 className="text-3xl font-bold mb-4">Secure Your Account</h3>
            <p className="text-lg opacity-90">
              Create a new, strong password to keep your account safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
