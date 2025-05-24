// src/components/auth/SignUpForm.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { validateSignUpForm } from "../../utils/validators"; // Đổi tên hàm validate cho phù hợp
import "../../styles/AuthForms.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../common/Button";
import Input from "../common/Input";

const SignUpForm = () => {
  const { signup, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Thêm firstName, lastName nếu design yêu cầu ở bước này
    // Hoặc chúng có thể được thu thập sau khi xác thực email.
    // Giả sử design hiện tại chỉ yêu cầu email, password, role.
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate", // Mặc định là 'candidate' hoặc 'EMPLOYERS' theo design
    agreeTerms: false, // Thêm trường này
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

  // Design có dropdown "Employers" / "Candidate", nên cần hàm này
  const handleRoleChange = (e) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Cần cập nhật validateSignUpForm để bao gồm cả agreeTerms nếu bắt buộc
    const validationErrors = validateSignUpForm(formData);
    if (!formData.agreeTerms) {
      validationErrors.agreeTerms = "You must agree to the Terms of Services.";
    }
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Truyền đúng cấu trúc dữ liệu mà AuthContext.signup mong đợi
      // Ví dụ: nếu signup cần firstName, lastName, bạn cần thêm chúng vào formData
      // và có thể là thêm các input field cho chúng.
      // Hiện tại, dựa trên design, chỉ có email, password, role.
      const userDataToSubmit = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        // Thêm firstName, lastName nếu API yêu cầu ở bước này
        // firstName: formData.firstName,
        // lastName: formData.lastName,
      };

      const result = await signup(userDataToSubmit);
      if (result.success) {
        navigate("/verify-email", { state: { email: formData.email } });
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
    // Phần form chiếm 2/5, phần ảnh chiếm 3/5 trên màn hình lớn
    <div className="signup-form-section w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
      <div className="form-container max-w-sm mx-auto w-full">
        <div className="brand-logo mb-8 text-left">
          <Link to="/" className="inline-flex items-center gap-2">
            <img
              src="/assets/images/logo.png" // Logo "MyJob"
              alt="MyJob Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <div className="signup-header mb-6 text-left">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            Create account.
          </h2>
          <p className="text-gray-600 text-sm">
            Already have account?{" "}
            <Link
              to="/login"
              className="text-teal-500 font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>

        {submitError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection Dropdown */}
          <div className="relative">
            <label htmlFor="role" className="sr-only">
              Select Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              className="w-full p-3 border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-700 text-sm"
            >
              <option value="candidate">I'm a Candidate</option>
              <option value="recruiter">I'm an Employer/Recruiter</option>
            </select>
            <FontAwesomeIcon
              icon="chevron-down"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
          {/* Thêm input cho First Name và Last Name nếu API yêu cầu */}
          {/*
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} required inputClassName="p-3" />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} required inputClassName="p-3" />
            </div>
           */}

          <Input
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="Enter your email"
            inputClassName="p-3"
          />
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            placeholder="Create a password"
            iconRight={showPassword ? "eye-slash" : "eye"}
            onIconRightClick={toggleShowPassword}
            inputClassName="p-3"
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            placeholder="Confirm your password"
            iconRight={showConfirmPassword ? "eye-slash" : "eye"}
            onIconRightClick={toggleShowConfirmPassword}
            inputClassName="p-3"
          />

          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-400 mt-1"
            />
            <label htmlFor="agreeTerms" className="ml-2 text-xs text-gray-600">
              I've read and agree with your{" "}
              <Link to="/terms" className="text-teal-500 hover:underline">
                Terms of Services
              </Link>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="text-red-600 text-xs -mt-3">{errors.agreeTerms}</p>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting || authLoading}
            disabled={isSubmitting || authLoading || !formData.agreeTerms}
            className="bg-teal-500 hover:bg-teal-600 text-white py-3"
            iconRight="arrow-right"
          >
            Create Account
          </Button>

          <div className="relative my-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-sm text-gray-500">or</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              type="button"
              // onClick={handleGoogleSignup} // Cần hàm riêng cho signup
              disabled={isSubmitting || authLoading}
              variant="outline-primary"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
              iconLeft={["fab", "google"]}
            >
              Sign up with Google
            </Button>
            <Button
              type="button"
              // onClick={handleFacebookSignup} // Cần hàm riêng cho signup
              disabled={isSubmitting || authLoading}
              variant="outline-primary"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
              iconLeft={["fab", "facebook-f"]}
            >
              Sign up with Facebook
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
