import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom"; // Import withRouter
import useForm from "../../hooks/useForm"; // Keep useForm if it's a functional hook
import { validateForgotPasswordForm } from "../../utils/validators";
import authAPI from "../../api/auth"; // Import authAPI default export

class ForgotPasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        email: "",
      },
      errors: {},
      isSubmitting: false,
      submitSuccess: false,
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
    const errors = validateForgotPasswordForm(this.state.values);
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
      // Access forgotPassword through authAPI object
      const result = await authAPI.forgotPassword(this.state.values.email);

      if (result.success) {
        this.setState({ submitSuccess: true });
      } else {
        this.setState({ submitError: result.error });
      }
    } catch (error) {
      console.error("Lỗi quên mật khẩu:", error);
      this.setState({
        submitError: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
      });
    } finally {
      this.setState({ isSubmitting: false });
    }
  }

  render() {
    const { values, errors, isSubmitting, submitSuccess, submitError } =
      this.state;

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
            Quên mật khẩu
          </h2>
          <p className="text-gray-600">
            Nhập email của bạn để đặt lại mật khẩu
          </p>
        </div>

        {submitSuccess ? (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-4 text-center">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="text-xl font-semibold mb-2">
              Email đặt lại đã được gửi
            </h3>
            <p className="text-gray-700 mb-4">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến{" "}
              <span className="font-semibold">{values.email}</span>
            </p>
            <p className="text-gray-600 text-sm mb-4">
              Vui lòng kiểm tra email của bạn và nhấp vào liên kết để đặt lại
              mật khẩu. Nếu bạn không thấy email, hãy kiểm tra thư mục spam của
              bạn.
            </p>
            <div className="flex flex-col space-y-2">
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Về trang đăng nhập
              </Link>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={this.handleSubmit} // Allow resend by calling handleSubmit again
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi lại..." : "Gửi lại Email"}
              </button>
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
                  placeholder="Nhập địa chỉ email của bạn"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                {errors.email && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.email}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white border-none rounded text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi..." : "Đặt lại mật khẩu"}
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

ForgotPasswordForm.propTypes = {
  history: PropTypes.object.isRequired, // Injected by withRouter
};

export default withRouter(ForgotPasswordForm);
