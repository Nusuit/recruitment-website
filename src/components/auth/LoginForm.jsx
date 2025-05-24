// src/components/auth/LoginForm.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { validateLoginForm } from "../../utils/validators";
import "../../styles/AuthForms.scss"; // Đảm bảo SCSS được import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginForm = () => {
  const {
    login,
    loginWithGoogle,
    loading: authLoading,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // Để lấy state từ redirect (nếu có)

  const [values, setValues] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(location.state?.error || ""); // Lấy lỗi từ redirect (nếu có)
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      // Xóa lỗi khi người dùng bắt đầu nhập lại
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
    if (submitError) setSubmitError(""); // Xóa lỗi submit chung
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
        const { from } = location.state || { from: { pathname: "/" } }; // Lấy đường dẫn redirect

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
      console.error("loginWithGoogle function is not available in AuthContext");
      setSubmitError("Chức năng đăng nhập với Google hiện không khả dụng.");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-form-section w-full md:w-1/2 lg:w-2/5 p-8 flex flex-col justify-center">
      {" "}
      {/* Adjusted width */}
      <div className="form-container max-w-md mx-auto w-full">
        {" "}
        {/* Centered form */}
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
        <div className="login-header mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
          <p className="text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Tạo tài khoản
            </Link>
          </p>
        </div>
        {submitError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-800 font-medium mb-1 text-sm"
            >
              Địa chỉ Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              className={`w-full p-3 border rounded focus:outline-none transition-colors duration-200 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-800 font-medium mb-1 text-sm"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className={`w-full p-3 border rounded focus:outline-none transition-colors duration-200 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                }`}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={values.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="rememberMe" className="text-gray-600 text-sm">
                Ghi nhớ tôi
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-blue-600 font-medium text-sm hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white border-none rounded text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitting || authLoading}
          >
            {isSubmitting || authLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm mb-4 relative before:content-[''] before:absolute before:top-1/2 before:w-[35%] before:h-px before:bg-gray-300 before:left-0 after:content-[''] after:absolute after:top-1/2 after:w-[35%] after:h-px after:bg-gray-300 after:right-0">
              hoặc
            </p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting || authLoading}
              className="w-full flex items-center justify-center gap-2 p-3 rounded font-medium transition-colors duration-200 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-70"
            >
              <FontAwesomeIcon
                icon={["fab", "google"]}
                className="text-red-500"
              />
              Đăng nhập bằng Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
