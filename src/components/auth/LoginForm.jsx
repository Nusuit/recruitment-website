// src/components/auth/LoginForm.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { validateLoginForm } from "../../utils/validators";
import "../../styles/AuthForms.scss"; // SCSS này đã có trong Canvas
import Button from "../common/Button";
import Input from "../common/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginForm = () => {
  const {
    login,
    loginWithGoogle,
    loading: authLoading,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(location.state?.error || "");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
    if (submitError) setSubmitError("");
  };

  const validateForm = () => {
    const validationErrors = validateLoginForm(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const { email, password } = values;
      const result = await login(email, password);

      if (result.success && result.user) {
        const role = result.user.role?.toLowerCase();
        const { from } = location.state || { from: { pathname: "/" } };

        if (role === "admin") {
          navigate(
            from.pathname === "/login" || from.pathname === "/"
              ? "/admin/dashboard"
              : from.pathname,
            { replace: true }
          );
        } else if (role === "candidate") {
          navigate(
            from.pathname === "/login" || from.pathname === "/"
              ? "/applicant/dashboard"
              : from.pathname,
            { replace: true }
          );
        } else if (role === "recruiter") {
          navigate(
            from.pathname === "/login" || from.pathname === "/"
              ? "/recruiter/dashboard"
              : from.pathname,
            { replace: true }
          );
        } else {
          navigate(from.pathname, { replace: true });
        }
      } else {
        setSubmitError(result.error || "Email or password invalid.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setSubmitError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    if (loginWithGoogle) {
      loginWithGoogle();
    } else {
      setSubmitError("Google login is currently unavailable.");
    }
  };

  const handleFacebookLogin = () => {
    setSubmitError("Facebook login is currently unavailable.");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Cột form (Trái)
    <div className="login-form-section w-full md:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white">
      <div className="form-container max-w-sm mx-auto w-full">
        <div className="login-header mb-8 text-left">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Log In</h2>
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-teal-500 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>

        {submitError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email address"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="Enter your email"
            inputClassName="p-3 rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            labelClassName="font-medium text-gray-700"
          />
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            required
            placeholder="Enter your password"
            iconRight={showPassword ? "eye-slash" : "eye"}
            onIconRightClick={toggleShowPassword}
            inputClassName="p-3 rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            labelClassName="font-medium text-gray-700"
          />

          <div className="flex justify-between items-center text-sm form-options">
            <label
              htmlFor="rememberMe"
              className="flex items-center cursor-pointer remember-me"
            >
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={values.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="ml-2 text-gray-700">Remember Me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-teal-500 font-semibold hover:underline forgot-password-link"
            >
              Forgot password?
            </Link>
          </div>

          {/* SỬ DỤNG CLASS .btn-login-primary TỪ SCSS CHO NÚT NÀY */}
          <button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="btn-login-primary" // Áp dụng class SCSS
          >
            {isSubmitting || authLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Log In
                <FontAwesomeIcon icon="arrow-right" className="ml-2 h-4 w-4" />
              </span>
            )}
          </button>

          <div className="relative my-6 divider-or">
            <div className="divider-line" aria-hidden="true">
              <div></div> {/* This div is targeted by SCSS for the line */}
            </div>
            <div className="divider-text">
              <span>or</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              type="button"
              onClick={handleFacebookLogin}
              disabled={isSubmitting || authLoading}
              variant="outline" // Hoặc không có variant nếu social-login-button đã đủ
              className="social-login-button" // Class SCSS
              iconLeft={["fab", "facebook-f"]}
            >
              Sign in with Facebook
            </Button>
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting || authLoading}
              variant="outline" // Hoặc không có variant
              className="social-login-button" // Class SCSS
              iconLeft={["fab", "google"]}
            >
              Sign in with Google
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
