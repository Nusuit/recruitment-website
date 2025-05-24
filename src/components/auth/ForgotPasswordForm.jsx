// src/pages/guest/ForgotPasswordPage.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { validateForgotPasswordForm } from "../../utils/validators";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
// import "../../styles/AuthForms.scss"; // SCSS chung cho các form auth đã được import ở AuthLayoutWrapper hoặc App.js

const ForgotPasswordPage = () => {
  const { forgotPassword, loading: authLoading } = useContext(AuthContext); // Giả sử có hàm forgotPassword trong context
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // Lỗi từ API
  const [validationError, setValidationError] = useState(""); // Lỗi từ client-side validation
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
      const result = await forgotPassword(email);
      if (result.success) {
        setSubmitSuccess(true);
        // Chuyển hướng đến trang thông báo kiểm tra email, truyền email và thông điệp
        navigate("/check-email", {
          state: {
            email: email,
            message:
              "If an account with that email exists, we've sent instructions to reset your password.",
            purpose: "passwordReset", // Để CheckEmailPage biết mục đích
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

  // Layout này sẽ được render bên trong AuthLayoutWrapper (phần single-column)
  return (
    <>
      <div className="text-left mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Forget Password
        </h2>
        <p className="text-gray-500 text-sm">
          Go back to{" "}
          <Link
            to="/login"
            className="text-teal-500 font-semibold hover:underline"
          >
            Log in
          </Link>
          . Don't have account?{" "}
          <Link
            to="/signup"
            className="text-teal-500 font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>

      {submitSuccess ? (
        <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm">
          {/* Thông báo thành công sẽ hiển thị trên trang CheckEmailPage */}
          <p className="text-gray-700">
            Redirecting you to check your email...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2.5 rounded text-xs">
              {error}
            </div>
          )}
          <Input
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            error={validationError}
            required
            placeholder="Email address"
            inputClassName="p-3 text-sm"
          />
          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting || authLoading}
            disabled={isSubmitting || authLoading}
            className="bg-teal-500 hover:bg-teal-600 text-white py-3 text-sm font-semibold"
            iconRight="arrow-right"
          >
            Reset Password
          </Button>
        </form>
      )}

      {!submitSuccess && (
        <>
          <div className="relative my-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-xs text-gray-400">or</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              type="button"
              // onClick={handleGoogleLogin} // Không phù hợp ở đây
              disabled={true} // Tạm disable
              variant="outline-primary"
              className="border-gray-300 text-gray-600 hover:bg-gray-50 py-2.5 text-xs font-medium"
              iconLeft={["fab", "google"]}
            >
              Sign in with Google
            </Button>
            <Button
              type="button"
              // onClick={handleFacebookLogin} // Không phù hợp ở đây
              disabled={true} // Tạm disable
              variant="outline-primary"
              className="border-gray-300 text-gray-600 hover:bg-gray-50 py-2.5 text-xs font-medium"
              iconLeft={["fab", "facebook-f"]}
            >
              Sign in with Facebook
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default ForgotPasswordPage;
