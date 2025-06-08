// src/components/auth/ResetPasswordForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authAPI from "../../api/auth";
import { validateResetPasswordForm } from "../../utils/validators";
import Button from "../common/Button";
import Input from "../common/Input";
import LoadingSpinner from "../common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ResetPasswordForm = ({ onFormSubmitSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    } else {
      setSubmitError(
        "Invalid or missing password reset token. Please request a new link if needed."
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
      setSubmitError("Password reset token is missing or invalid.");
      return;
    }

    const validationErrors = validateResetPasswordForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authAPI.resetPassword(token, formData.password);
      if (result.success) {
        setSubmitSuccess(true);
        if (onFormSubmitSuccess) {
          onFormSubmitSuccess();
        } else {
          setTimeout(() => {
            navigate("/login", {
              state: {
                successMessage:
                  "Password has been reset successfully! You can now log in.",
              },
            });
          }, 3000);
        }
      } else {
        setSubmitError(
          result.error ||
            "Failed to reset password. The link may be invalid, expired, or the password does not meet requirements."
        );
      }
    } catch (err) {
      setSubmitError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess && !onFormSubmitSuccess) {
    return (
      <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm">
        <FontAwesomeIcon
          icon="check-circle"
          className="text-4xl text-green-500 mb-3"
        />
        <h3 className="text-xl font-semibold text-green-700 mb-2">
          Password Reset Successfully!
        </h3>
        <p className="text-gray-600 text-sm">Redirecting to login page...</p>
      </div>
    );
  }

  if (!token && !isSubmitting) {
    return (
      <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
        <FontAwesomeIcon
          icon="exclamation-triangle"
          className="text-4xl text-red-500 mb-3"
        />
        <h3 className="text-xl font-semibold text-red-700 mb-2">
          Invalid Link
        </h3>
        <p className="text-gray-600 text-sm">
          {submitError || "This password reset link is invalid or has expired."}
        </p>
        <Button
          onClick={() => navigate("/forgot-password")}
          variant="outline-primary"
          className="mt-4"
        >
          Request New Link
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div
          className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm"
          role="alert"
        >
          {submitError}
        </div>
      )}
      <Input
        label="New Password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
        placeholder="Enter your new password"
        iconRight={showPassword ? "eye-slash" : "eye"}
        onIconRightClick={toggleShowPassword}
      />
      <Input
        label="Confirm New Password"
        name="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        required
        placeholder="Confirm your new password"
        iconRight={showConfirmPassword ? "eye-slash" : "eye"}
        onIconRightClick={toggleShowConfirmPassword}
      />
      <p className="text-xs text-gray-500">
        Password must be at least 8 characters long and include a mix of
        letters, numbers, and symbols.
      </p>
      <Button
        type="submit"
        fullWidth
        isLoading={isSubmitting}
        disabled={isSubmitting || !token}
        variant="primary"
      >
        {isSubmitting ? "Resetting Password..." : "Reset Password"}
      </Button>
    </form>
  );
};

ResetPasswordForm.propTypes = {
  onFormSubmitSuccess: PropTypes.func,
};

export default ResetPasswordForm;
