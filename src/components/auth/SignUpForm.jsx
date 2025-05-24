// src/components/auth/SignUpForm.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { validateSignUpForm } from "../../utils/validators"; // Assumes this function exists and is updated
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/AuthForms.scss";

const SignUpForm = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate", // Default role
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSubmitError("");
  };

  const handleRoleChange = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const validationErrors = validateSignUpForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signup(formData);
      if (result.success) {
        // Redirect to a confirmation page or login page
        navigate("/check-email", { state: { email: formData.email } }); // Redirect to check email page
      } else {
        setSubmitError(
          result.error || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSubmitError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-form-section w-full md:w-1/2 lg:w-2/5 p-8 flex flex-col justify-center">
      <div className="form-container max-w-md mx-auto w-full">
        <div className="brand-logo mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <img
              src="/assets/images/logo.png"
              alt="MyaCorp Logo"
              className="h-12 w-auto"
            />
            <span className="text-3xl font-bold text-blue-600">MyaCorp</span>
          </Link>
        </div>

        <div className="signup-header mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>

        {submitError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2 text-sm">
              I am a...
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange("candidate")}
                className={`flex-1 p-3 border rounded text-center transition-all duration-200 ${
                  formData.role === "candidate"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                }`}
              >
                <FontAwesomeIcon icon="user-tie" className="mr-2" />
                Candidate
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("recruiter")}
                className={`flex-1 p-3 border rounded text-center transition-all duration-200 ${
                  formData.role === "recruiter"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                }`}
              >
                <FontAwesomeIcon icon="building" className="mr-2" />
                Recruiter
              </button>
            </div>
          </div>

          {/* First Name & Last Name */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label
                htmlFor="firstName"
                className="block text-gray-800 font-medium mb-1 text-sm"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="John"
                className={`w-full p-3 border rounded focus:outline-none ${
                  errors.firstName
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="flex-1">
              <label
                htmlFor="lastName"
                className="block text-gray-800 font-medium mb-1 text-sm"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Doe"
                className={`w-full p-3 border rounded focus:outline-none ${
                  errors.lastName
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-800 font-medium mb-1 text-sm"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              className={`w-full p-3 border rounded focus:outline-none ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-800 font-medium mb-1 text-sm"
            >
              Password
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
                className={`w-full p-3 border rounded focus:outline-none ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                }`}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-800 font-medium mb-1 text-sm"
            >
              Confirm Password
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
                className={`w-full p-3 border rounded focus:outline-none ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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
              <p className="text-red-600 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white border-none rounded text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
