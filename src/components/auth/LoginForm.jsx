// src/components/auth/LoginForm.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { validateLoginForm } from "../../utils/validators";
import Button from "../common/Button";
import Input from "../common/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// SVG cho Google Logo
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
    role: "candidate", 
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
    console.log("[LoginForm] Form submitted. Current values:", values);
    if (!validateForm()) {
      console.log("[LoginForm] Validation failed.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const { email, password, role } = values; 
      console.log("[LoginForm] Calling login context with:", { email, password, role });
      const result = await login(email, password, role); 
      console.log("[LoginForm] Result from login context:", result);


      if (result && result.success && result.user) {
        console.log("[LoginForm] Login success. User role:", result.user.role);
        const userRole = result.user.role?.toLowerCase();
        const { from } = location.state || { from: { pathname: "/" } };
        const intendedPath =
          from.pathname === "/login" || from.pathname === "/"
            ? userRole === "admin"
              ? "/admin/dashboard"
              : userRole === "candidate"
              ? "/applicant/dashboard"
              : userRole === "recruiter"
              ? "/recruiter/dashboard" 
              : "/"
            : from.pathname;
        console.log("[LoginForm] Navigating to:", intendedPath);
        navigate(intendedPath, { replace: true });
      } else {
          const errorMessage = result ? (result.error || "Email or password invalid.") : "Login failed due to an unknown error.";
          console.log("[LoginForm] Login failed, setting submitError:", errorMessage);
          setSubmitError(errorMessage);
      }
    } catch (error) {
      console.error("[LoginForm] Login submission error (catch block):", error);
      setSubmitError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
      console.log("[LoginForm] Submission process finished.");
    }
  };
  
  const handleGoogleLogin = () => {
    if (loginWithGoogle) {
      console.log("[LoginForm] Initiating Google login for role:", values.role);
      loginWithGoogle(values.role); 
    } else {
      setSubmitError("Google login is currently unavailable.");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8 text-left">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Log In</h2>
        <p className="text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#16C0B0] font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
      {submitError && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2.5 rounded-md text-xs mb-4">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="role"
            className="block text-xs font-medium text-gray-600 mb-1"
          >
            I am a...
          </label>
          <select
            id="role"
            name="role"
            value={values.role}
            onChange={handleChange}
            className="w-full p-3 text-sm border rounded-md border-gray-300 focus:border-[#16C0B0] focus:ring-1 focus:ring-[#16C0B0]"
          >
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
            {/* <option value="admin">Admin</option> */}
          </select>
        </div>

        <Input
          label="Email address*"
          name="email"
          type="email"
          value={values.email}
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
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          required
          placeholder="Enter your password"
          iconRight={showPassword ? "eye-slash" : "eye"}
          onIconRightClick={toggleShowPassword}
          inputClassName="p-3 text-sm"
          labelClassName="text-xs"
        />

        <div className="flex justify-between items-center text-xs">
          <label
            htmlFor="rememberMe"
            className="flex items-center cursor-pointer text-gray-600"
          >
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={values.rememberMe}
              onChange={handleChange}
              className="h-3.5 w-3.5 text-[#16C0B0] border-gray-300 rounded focus:ring-[#16C0B0]"
            />
            <span className="ml-2">Remember Me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-[#16C0B0] font-medium hover:underline"
          >
            Forget password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting || authLoading}
          disabled={isSubmitting || authLoading}
          className="bg-[#16C0B0] hover:bg-[#12a79a] text-white py-3 text-sm font-semibold"
          iconRight="arrow-right"
        >
          Log In
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
            // onClick={handleFacebookLogin}
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
            onClick={handleGoogleLogin}
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

export default LoginForm;
