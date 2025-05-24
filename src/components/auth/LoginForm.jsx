// src/components/auth/LoginForm.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { validateLoginForm } from "../../utils/validators";
import "../../styles/AuthForms.scss"; // Đảm bảo SCSS được import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../common/Button"; // Sử dụng Button component
import Input from "../common/Input"; // Sử dụng Input component

const LoginForm = () => {
  const {
    login,
    loginWithGoogle, // Giả sử bạn có hàm này trong AuthContext
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
        setSubmitError(result.error || "Email hoặc mật khẩu không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setSubmitError("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    if (loginWithGoogle) {
      loginWithGoogle();
    } else {
      setSubmitError("Chức năng đăng nhập với Google hiện không khả dụng.");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Phần form chiếm 2/5, phần ảnh chiếm 3/5 trên màn hình lớn
    <div className="login-form-section w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
      <div className="form-container max-w-sm mx-auto w-full">
        <div className="brand-logo mb-8 text-left">
          {" "}
          {/* Căn trái logo */}
          <Link to="/" className="inline-flex items-center gap-2">
            <img
              src="/assets/images/logo-myjob.png" // Thay bằng logo "MyJob"
              alt="MyJob Logo"
              className="h-8 w-auto" // Điều chỉnh kích thước logo
            />
            {/* <span className="text-2xl font-bold text-teal-600">MyJob</span> */}
          </Link>
        </div>

        <div className="login-header mb-6 text-left">
          {" "}
          {/* Căn trái header */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Log In</h2>
          <p className="text-gray-600 text-sm">
            Don't have account?{" "}
            <Link
              to="/signup"
              className="text-teal-500 font-medium hover:underline"
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email address"
            name="email"
            type="email"
            value={values.email}
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
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            required
            placeholder="Enter your password"
            iconRight={showPassword ? "eye-slash" : "eye"}
            onIconRightClick={toggleShowPassword}
            inputClassName="p-3"
          />

          <div className="flex justify-between items-center text-sm">
            <label
              htmlFor="rememberMe"
              className="flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={values.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-400"
              />
              <span className="ml-2 text-gray-700">Remember Me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-teal-500 font-medium hover:underline"
            >
              Forget password?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting || authLoading}
            disabled={isSubmitting || authLoading}
            className="bg-teal-500 hover:bg-teal-600 text-white py-3" // Nút màu teal
            iconRight="arrow-right"
          >
            Log In
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
              onClick={handleGoogleLogin} // Giả sử bạn có hàm này
              disabled={isSubmitting || authLoading}
              variant="outline-primary" // Hoặc một variant khác cho social login
              className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
              iconLeft={["fab", "google"]}
            >
              Sign in with Google
            </Button>
            <Button
              type="button"
              // onClick={handleFacebookLogin} // Giả sử bạn có hàm này
              disabled={isSubmitting || authLoading}
              variant="outline-primary"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
              iconLeft={["fab", "facebook-f"]}
            >
              Sign in with Facebook
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
