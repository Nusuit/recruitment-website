import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom"; // Import withRouter
import useForm from "../../hooks/useForm"; // Keep useForm if it's a functional hook
import { validateResetPasswordForm } from "../../utils/validators";
import authAPI from "../../api/auth"; // Import authAPI default export

class ResetPasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        password: "",
        confirmPassword: "",
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
    const { name, value } = e.target;
    this.setState((prevState) => ({
      values: {
        ...prevState.values,
        [name]: value,
      },
      errors: {
        ...prevState.errors,
        [name]: "",
      },
    }));
  }

  validateForm() {
    const errors = validateResetPasswordForm(this.state.values);
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  async handleSubmit(e) {
    e.preventDefault();

    const queryParams = new URLSearchParams(this.props.location.search);
    const token = queryParams.get("token");

    if (!token) {
      this.setState({
        submitError:
          "Mã đặt lại không hợp lệ hoặc bị thiếu. Vui lòng yêu cầu một liên kết đặt lại mật khẩu mới.",
      });
      return;
    }

    if (!this.validateForm()) {
      return;
    }

    this.setState({ isSubmitting: true, submitError: "" });

    try {
      // Access resetPassword through authAPI object
      const result = await authAPI.resetPassword(
        token,
        this.state.values.password
      );

      if (result.success) {
        this.props.history.push("/login", {
          state: {
            success: true,
            message:
              "Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.",
          },
        });
      } else {
        this.setState({ submitError: result.error });
      }
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      this.setState({
        submitError: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
      });
    } finally {
      this.setState({ isSubmitting: false });
    }
  }

  render() {
    const { values, errors, isSubmitting, submitError } = this.state;
    const queryParams = new URLSearchParams(this.props.location.search);
    const token = queryParams.get("token");
    const isTokenMissing = !token;

    return (
      <div className="password-form-section">
        <div className="brand-logo">
          <img
            src="/assets/images/logo.png"
            alt="MyJob"
            className="h-10 w-auto"
          />
          <span className="text-2xl font-bold text-blue-600">MyJob</span>
        </div>

        <div className="password-header">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Đặt lại mật khẩu
          </h2>
          <p className="text-gray-600">Nhập mật khẩu mới của bạn bên dưới</p>
        </div>

        {isTokenMissing ? (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center">
            <div className="text-2xl mb-2">!</div>
            <h3 className="text-xl font-semibold mb-2">
              Liên kết đặt lại không hợp lệ
            </h3>
            <p className="text-gray-700 mb-4">
              Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
            </p>
            <div className="flex flex-col space-y-2">
              <Link
                to="/forgot-password"
                className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Yêu cầu liên kết đặt lại mới
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 transition-colors duration-200"
              >
                Về trang đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <>
            {submitError && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {submitError}
              </div>
            )}

            <form onSubmit={this.handleSubmit} className="flex flex-col">
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-800 font-medium mb-1"
                >
                  Mật khẩu mới
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
                    <i className="fa-solid fa-eye text-lg"></i>
                  </button>
                </div>
                {errors.password && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.password}
                  </div>
                )}
                <div className="text-gray-600 text-xs mt-1 bg-gray-50 p-2 rounded border-l-2 border-blue-600">
                  Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ cái và số
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-800 font-medium mb-1"
                >
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
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
                    <i className="fa-solid fa-eye text-lg"></i>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white border-none rounded text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
              </button>

              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Về trang đăng nhập
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    );
  }
}

ResetPasswordForm.propTypes = {
  location: PropTypes.object.isRequired, // Injected by withRouter
  history: PropTypes.object.isRequired, // Injected by withRouter
};

export default withRouter(ResetPasswordForm);
