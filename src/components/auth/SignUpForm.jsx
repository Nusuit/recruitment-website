import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom"; // Import withRouter
import AuthContext from "../../contexts/AuthContext";
import { validateSignupForm } from "../../utils/validators";
import "../../styles/AuthForms.scss"; // Use SCSS
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon

class SignUpForm extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      values: {
        email: "",
        password: "",
        confirmPassword: "",
        role: "candidate",
        agreeTerms: false,
      },
      errors: {},
      isSubmitting: false,
      submitError: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        ...prevState.errors,
        [name]: "",
      },
    }));
  }

  validateForm() {
    const errors = validateSignupForm(this.state.values);
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
      const userData = {
        email: this.state.values.email,
        password: this.state.values.password,
        role: this.state.values.role,
      };

      const result = await this.context.signup(userData); // Use signup from context

      if (result.success) {
        this.props.history.push("/verify-email", {
          state: {
            email: this.state.values.email,
            message: "Vui lòng kiểm tra email của bạn để xác minh tài khoản",
          },
        });
      } else {
        this.setState({ submitError: result.error || "Đăng ký thất bại" });
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      this.setState({
        submitError: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
      });
    } finally {
      this.setState({ isSubmitting: false });
    }
  }

  render() {
    const { values, errors, isSubmitting, submitError } = this.state;

    return (
      <div className="signup-form-section">
        <div className="form-container">
          <div className="brand-logo">
            <img
              src="/assets/images/logo.png"
              alt="MyJob"
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold text-blue-600">MyJob</span>
          </div>

          <div className="signup-header">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Tạo tài khoản
              </h2>
              <p className="text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>

            <div className="role-select">
              <select
                id="role"
                name="role"
                value={values.role}
                onChange={this.handleChange}
                required
                className="w-36 p-2 border border-gray-300 rounded text-sm bg-white cursor-pointer"
              >
                <option value="candidate">Tìm việc</option>
                <option value="recruiter">Đăng tuyển</option>
              </select>
            </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-gray-800 font-medium mb-1"
                >
                  Mật khẩu
                </label>
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
                  <FontAwesomeIcon icon="eye" className="text-lg" />
                </button>
                {errors.password && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.password}
                  </div>
                )}
                <div className="text-gray-600 text-xs mt-1 bg-gray-50 p-2 rounded border-l-2 border-blue-600">
                  Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ cái và số
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-800 font-medium mb-1"
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={this.handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-gray-500"
                >
                  <FontAwesomeIcon icon="eye" className="text-lg" />
                </button>
                {errors.confirmPassword && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4 flex items-center space-x-2">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={values.agreeTerms}
                onChange={this.handleChange}
                required
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="agreeTerms" className="text-gray-600 text-sm">
                Tôi đồng ý với{" "}
                <a
                  href="/terms"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Điều khoản dịch vụ
                </a>{" "}
                và{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Chính sách bảo mật
                </a>
              </label>
              {errors.agreeTerms && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.agreeTerms}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white border-none rounded text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-4 relative before:content-[''] before:absolute before:top-1/2 before:w-1/4 before:h-px before:bg-gray-300 before:left-0 after:content-[''] after:absolute after:top-1/2 after:w-1/4 after:h-px after:bg-gray-300 after:right-0">
                hoặc đăng ký bằng
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded font-medium transition-colors duration-200 border border-gray-300 bg-white text-blue-700 hover:bg-gray-100"
                >
                  <FontAwesomeIcon
                    icon={["fab", "facebook"]}
                    className="text-lg"
                  />
                  Đăng ký bằng Facebook
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded font-medium transition-colors duration-200 border border-gray-300 bg-white text-red-600 hover:bg-gray-100"
                >
                  <FontAwesomeIcon
                    icon={["fab", "google"]}
                    className="text-lg"
                  />
                  Đăng ký bằng Google
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="hidden md:flex flex-1 justify-center items-center p-8 bg-blue-600">
          <img
            src="/assets/images/register.png"
            alt="Register illustration"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    );
  }
}

SignUpForm.propTypes = {
  history: PropTypes.object.isRequired, // Injected by withRouter
};

export default withRouter(SignUpForm);
