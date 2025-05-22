import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext"; // Import AuthContext
import { validateLoginForm } from "../../utils/validators";
import "../../styles/AuthForms.scss"; // Use SCSS
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon

class LoginForm extends Component {
  static contextType = AuthContext; // Access context in class component

  constructor(props) {
    super(props);
    this.state = {
      values: {
        email: "",
        password: "",
        rememberMe: false,
      },
      errors: {},
      isSubmitting: false,
      submitError: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  handleChange(e) {
    const { name, value, type, checked } = e.target;
    this.setState((prevState) => ({
      values: {
        ...prevState.values,
        [name]: type === "checkbox" ? checked : value,
      },
      errors: {
        // Clear error when field is updated
        ...prevState.errors,
        [name]: "",
      },
    }));
  }

  validateForm() {
    const { values } = this.state;
    const errors = validateLoginForm(values); // Using the validator utility
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.setState({ isSubmitting: true, submitError: "" });

    try {
      const { email, password } = this.state.values;
      const { login } = this.context; // Get login method from context

      const result = await login(email, password);

      if (result.success && result.user) {
        const role = result.user.role?.toLowerCase();
        if (role === "admin") {
          this.props.history.push("/admin/dashboard"); // Use history for navigation
        } else if (role === "candidate") {
          this.props.history.push("/applicant/dashboard");
        } else {
          this.props.history.push("/");
          console.warn("Vai trò người dùng không xác định:", role);
        }
      } else {
        this.setState({
          submitError: result.error || "Email hoặc mật khẩu không hợp lệ",
        });
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      this.setState({
        submitError: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
      });
    } finally {
      this.setState({ isSubmitting: false });
    }
  }

  handleGoogleLogin() {
    const { loginWithGoogle } = this.context;
    loginWithGoogle(); // Call the OAuth2 initiation method
  }

  render() {
    const { values, errors, isSubmitting, submitError } = this.state;

    return (
      <div className="login-form-section">
        <div className="form-container">
          <div className="brand-logo">
            <img
              src="/assets/images/logo.png"
              alt="MyJob"
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold text-blue-600">MyJob</span>
          </div>

          <div className="login-header">
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
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {submitError}
            </div>
          )}

          <form onSubmit={this.handleSubmit} className="flex flex-col">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-800 font-medium mb-1"
              >
                Địa chỉ Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={this.handleChange}
                required
                placeholder="example@email.com"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              {errors.email && (
                <div className="text-red-600 text-sm mt-1">{errors.email}</div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-800 font-medium mb-1"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={this.handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-gray-500"
                >
                  <FontAwesomeIcon icon="eye" className="text-lg" />{" "}
                  {/* Font Awesome eye icon */}
                </button>
              </div>
              {errors.password && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.password}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={values.rememberMe}
                  onChange={this.handleChange}
                  className="rounded text-blue-600 focus:ring-blue-500"
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-4 relative before:content-[''] before:absolute before:top-1/2 before:w-1/4 before:h-px before:bg-gray-300 before:left-0 after:content-[''] after:absolute after:top-1/2 after:w-1/4 after:h-px after:bg-gray-300 after:right-0">
                hoặc đăng nhập bằng
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={this.handleGoogleLogin}
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded font-medium transition-colors duration-200 border border-gray-300 bg-white text-red-600 hover:bg-gray-100"
                >
                  <FontAwesomeIcon
                    icon={["fab", "google"]}
                    className="text-lg"
                  />{" "}
                  {/* Font Awesome Google icon */}
                  Đăng nhập bằng Google
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="hidden md:flex flex-1 justify-center items-center p-8 bg-blue-600">
          <img
            src="/assets/images/login.png"
            alt="Login illustration"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  history: PropTypes.object.isRequired, // Injected by withRouter
};

export default withRouter(LoginForm);
