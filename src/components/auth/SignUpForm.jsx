// src/components/auth/SignUpForm.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { validateSignupForm } from "../../utils/validators"; 
import Button from "../common/Button";
import Input from "../common/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// SVG for Google Logo
const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18"
    xmlns="http://www.w3.org/2000/svg"
    className="mr-2"
  >
    <path
      d="M17.64 9.20455C17.64 8.56636 17.5832 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.9705 13.0014 12.9232 12.045 13.5218V15.8195H14.9564C16.6582 14.2527 17.64 11.9459 17.64 9.20455Z"
      fill="#4285F4"
    />
    <path
      d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.045 13.5218C11.2805 14.0086 10.2295 14.3195 9 14.3195C6.65591 14.3195 4.67182 12.8077 3.96409 10.71H0.957272V13.0886C2.43818 15.9832 5.48182 18 9 18Z"
      fill="#34A853"
    />
    <path
      d="M3.96409 10.71C3.78409 10.1718 3.68045 9.59364 3.68045 9C3.68045 8.40636 3.78409 7.82818 3.96409 7.29V4.91136H0.957272C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957272 13.0886L3.96409 10.71Z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.68045C10.3977 3.68045 11.5268 4.17182 12.4795 5.08136L15.0218 2.54727C13.4632 0.972727 11.43 0 9 0C5.48182 0 2.43818 2.01682 0.957272 4.91136L3.96409 7.29C4.67182 5.19227 6.65591 3.68045 9 3.68045Z"
      fill="#EA4335"
    />
  </svg>
);

const SignUpForm = () => {
  const {
    signup,
    loginWithGoogle,
    loading: authLoading,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "", 
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSubmitError("");
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const validationData = {
        email: formData.email, 
        password: formData.password,
        confirmPassword: formData.confirmPassword,
    };

    const validationErrors = validateSignupForm(validationData); 

    if (!formData.agreeTerms) {
      validationErrors.agreeTerms = "You must agree to the Terms of Services.";
    }
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; 
    }

    setIsSubmitting(true);
    try {
      const payload = {
        email: formData.email, 
        password: formData.password,
      };
      
      const result = await signup(payload);

      if (result && result.success) {
        navigate("/verify-email", { state: { email: formData.email } });
      } else {
        const errorMessage = result ? (result.error || "Registration failed. Please try again.") : "Registration failed due to an unknown error.";
        setSubmitError(errorMessage);
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleSignup = () => {
    loginWithGoogle();
  };


  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-2 flex justify-between items-baseline">
        <h2 className="text-3xl font-bold text-gray-900">Register</h2>
      </div>
      <p className="text-gray-500 text-sm mb-6 text-left flex items-baseline">
        Already have account?&nbsp;
        <Link
          to="/login"
          className="text-[#16C0B0] font-semibold hover:underline"
        >
          Log In
        </Link>
      </p>

      {submitError && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2.5 rounded-md text-xs mb-4">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address*"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          placeholder="Enter your email"
          inputClassName="p-3 text-sm"
          labelClassName="text-xs"
        />

        <Input
          label="Password*"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          placeholder="Create a password"
          iconRight={showPassword ? "eye-slash" : "eye"}
          onIconRightClick={toggleShowPassword}
          inputClassName="p-3 text-sm"
          labelClassName="text-xs"
        />
        <Input
          label="Confirm Password*"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
          placeholder="Confirm your password"
          iconRight={showConfirmPassword ? "eye-slash" : "eye"}
          onIconRightClick={toggleShowConfirmPassword}
          inputClassName="p-3 text-sm"
          labelClassName="text-xs"
        />
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="h-3.5 w-3.5 text-[#16C0B0] border-gray-300 rounded focus:ring-[#16C0B0] mt-0.5"
          />
          <label htmlFor="agreeTerms" className="ml-2 text-xs text-gray-500">
            I've read and agree with your{" "}
            <Link to="/terms" className="text-[#16C0B0] hover:underline">
              Terms of Services
            </Link>
          </label>
        </div>
        {errors.agreeTerms && (
          <p className="text-red-500 text-xs -mt-3">{errors.agreeTerms}</p>
        )}

        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting || authLoading}
          disabled={isSubmitting || authLoading || !formData.agreeTerms}
          className="bg-[#16C0B0] hover:bg-[#12a79a] text-white py-3 text-sm font-semibold"
          iconRight="arrow-right"
        >
          Create Account
        </Button>

        <div className="relative my-5">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-400">or</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isSubmitting || authLoading}
            style={{
              backgroundColor: "#3b5998",
              color: "white",
              borderColor: "transparent",
            }}
            className="w-full hover:opacity-90 shadow-sm flex items-center justify-center text-xs font-medium px-3 py-2.5 rounded-md"
          >
            <FontAwesomeIcon icon={["fab", "facebook-f"]} className="mr-2" />
            <span className="whitespace-nowrap leading-tight">
              Sign up with Facebook
            </span>
          </button>
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isSubmitting || authLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-300 shadow-sm flex items-center justify-center text-xs font-medium px-3 py-2.5 rounded-md"
          >
            <GoogleIcon />
            <span className="whitespace-nowrap leading-tight">
              Sign up with Google
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
