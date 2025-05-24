// src/components/auth/ForgotPasswordForm.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext"; // Assuming AuthContext provides resetPassword
import { validateForgotPasswordForm } from "../../utils/validators"; // Assuming this validator exists
import Button from "../common/Button"; // Using the updated Button component
import Input from "../common/Input"; // Using the updated Input component
import LoadingSpinner from "../common/LoadingSpinner";

const ForgotPasswordForm = ({ onFormSubmitSuccess }) => {
  const { resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // For API errors
  const [validationError, setValidationError] = useState(""); // For form validation errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (validationError) setValidationError("");
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const formErrors = validateForgotPasswordForm({ email });
    if (formErrors.email) {
      setValidationError(formErrors.email);
      return;
    }
    setValidationError("");

    setIsSubmitting(true);
    try {
      const result = await resetPassword(email); // Call context function
      if (result.success) {
        setSubmitSuccess(true);
        if (onFormSubmitSuccess) {
          onFormSubmitSuccess(email); // Callback for parent page
        } else {
          // Default behavior: navigate to a confirmation page
          navigate("/check-email", {
            state: {
              email: email,
              message:
                "If an account with that email exists, we've sent instructions to reset your password.",
              purpose: "passwordReset",
            },
          });
        }
      } else {
        setError(
          result.error ||
            "Failed to send password reset email. Please check the email and try again."
        );
      }
    } catch (err) {
      console.error("Forgot password submission error:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess && !onFormSubmitSuccess) {
    // Only show this if parent doesn't handle success
    return (
      <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm">
        <FontAwesomeIcon
          icon="check-circle"
          className="text-4xl text-green-500 mb-3"
        />
        <h3 className="text-xl font-semibold text-green-700 mb-2">
          Reset Link Sent
        </h3>
        <p className="text-gray-600 text-sm">
          Please check your email{" "}
          <strong className="font-medium">{email}</strong> for instructions.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-block text-sm text-blue-600 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm"
          role="alert"
        >
          {error}
        </div>
      )}
      <Input
        label="Email Address"
        name="email"
        type="email"
        value={email}
        onChange={handleChange}
        error={validationError}
        required
        placeholder="Enter your registered email"
        iconLeft="envelope"
      />
      <Button
        type="submit"
        fullWidth
        isLoading={isSubmitting}
        disabled={isSubmitting}
        variant="primary"
      >
        {isSubmitting ? "Sending Link..." : "Send Password Reset Link"}
      </Button>
    </form>
  );
};

ForgotPasswordForm.propTypes = {
  onFormSubmitSuccess: PropTypes.func, // Optional callback for parent page to handle success
};

export default ForgotPasswordForm;
