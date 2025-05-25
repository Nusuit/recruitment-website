// src/components/auth/ForgotPasswordForm.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { validateForgotPasswordForm } from "../../utils/validators";
import Button from "../common/Button";
import Input from "../common/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // For icon in button

const ForgotPasswordForm = () => {
  const { forgotPassword, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // Lỗi từ API
  const [validationError, setValidationError] = useState(""); // Lỗi từ client-side validation
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const result = await forgotPassword(email); // Hàm này trong AuthContext nên xử lý việc gọi API
      if (result.success) {
        // Điều hướng đến trang /check-email với thông điệp phù hợp
        navigate("/check-email", {
          state: {
            email: email,
            message: `If an account with email ${email} exists, we have sent instructions to reset your password. Please check your inbox (and spam folder).`, // Thông điệp rõ ràng hơn
            purpose: "passwordReset", // Giữ lại purpose để trang CheckEmailPage có thể tùy biến hiển thị nếu cần
          },
        });
      } else {
        setError(
          result.error ||
            "Failed to send password reset email. Please check the email and try again."
        );
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-6 text-left">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">
          Forget Password
        </h2>
        <p className="text-gray-500 text-sm">
          Go back to{" "}
          <Link
            to="/login"
            className="text-[#16C0B0] font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Don't have account?{" "}
          <Link
            to="/signup"
            className="text-[#16C0B0] font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>

      {(error || validationError) && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2.5 rounded-md text-xs mb-4">
          {error || validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
          inputClassName="p-3 text-sm rounded-md border-gray-300 focus:border-[#16C0B0] focus:ring-1 focus:ring-[#16C0B0]"
          labelClassName="text-xs font-medium text-gray-600"
        />

        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting || authLoading}
          disabled={isSubmitting || authLoading}
          className="bg-[#16C0B0] hover:bg-[#12a79a] text-white py-3 text-sm font-semibold shadow-md hover:shadow-lg"
          iconRight="arrow-right"
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
