import React, { Component, createRef } from "react";
import { Link, withRouter } from "react-router-dom"; // Import withRouter
import authAPI from "../../api/auth";

class EmailVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verificationCode: ["", "", "", "", "", ""],
      isSubmitting: false,
      submitError: "",
      submitSuccess: false,
      timer: 0,
      canResend: false,
      resendSuccess: false,
    };
    this.inputRefs = Array(6)
      .fill()
      .map(() => createRef()); // Create refs for each input

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResend = this.handleResend.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  componentDidMount() {
    this.startTimer();
    // Focus first input
    if (this.inputRefs[0].current) {
      this.inputRefs[0].current.focus();
    }
  }

  componentWillUnmount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer() {
    this.setState({ timer: 60, canResend: false });
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.timer > 0) {
          return { timer: prevState.timer - 1 };
        } else {
          clearInterval(this.timerInterval);
          return { canResend: true };
        }
      });
    }, 1000);
  }

  handleChange(index, value) {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...this.state.verificationCode];
    newCode[index] = value;
    this.setState({ verificationCode: newCode });

    if (value !== "" && index < 5) {
      this.inputRefs[index + 1].current.focus();
    }
  }

  handleKeyDown(index, e) {
    if (
      e.key === "Backspace" &&
      this.state.verificationCode[index] === "" &&
      index > 0
    ) {
      this.inputRefs[index - 1].current.focus();
    }
  }

  handlePaste(e) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedCode = pastedData.replace(/\D/g, "").slice(0, 6);

    if (pastedCode.length > 0) {
      const newCode = [...this.state.verificationCode];
      for (let i = 0; i < pastedCode.length; i++) {
        if (i < 6) {
          newCode[i] = pastedCode[i];
        }
      }
      this.setState({ verificationCode: newCode });

      if (pastedCode.length < 6 && this.inputRefs[pastedCode.length].current) {
        this.inputRefs[pastedCode.length].current.focus();
      }
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitting: true, submitError: "" });

    const email = this.props.location.state?.email || "your email";
    const code = this.state.verificationCode.join("");

    try {
      const result = await authAPI.verifyOTP(email, code);

      if (result.success) {
        this.setState({ submitSuccess: true });
        setTimeout(() => {
          this.props.history.push("/login", {
            state: {
              success: true,
              message:
                "Email đã được xác minh thành công. Bây giờ bạn có thể đăng nhập.",
            },
          });
        }, 3000);
      } else {
        this.setState({ submitError: result.message || "Xác minh thất bại" });
      }
    } catch (error) {
      console.error("Lỗi xác minh:", error);
      this.setState({
        submitError: "Không thể xác minh email. Vui lòng thử lại.",
      });
    } finally {
      this.setState({ isSubmitting: false });
    }
  }

  async handleResend() {
    if (!this.state.canResend) return;

    this.setState({ submitError: "", canResend: false, resendSuccess: false });
    this.startTimer(); // Reset timer

    const email = this.props.location.state?.email || "your email";

    try {
      const result = await authAPI.resendOTP(email);

      if (result.success) {
        this.setState({ resendSuccess: true });
        setTimeout(() => this.setState({ resendSuccess: false }), 3000);
      } else {
        this.setState({ submitError: result.error });
        this.setState({ canResend: true, timer: 0 }); // Allow resend immediately if API fails
      }
    } catch (error) {
      console.error("Lỗi gửi lại OTP:", error);
      this.setState({ submitError: "Không thể gửi lại mã xác minh" });
      this.setState({ canResend: true, timer: 0 });
    }
  }

  render() {
    const {
      verificationCode,
      isSubmitting,
      submitError,
      submitSuccess,
      timer,
      canResend,
      resendSuccess,
    } = this.state;
    const email = this.props.location.state?.email || "your email";

    return (
      <div className="verification-form-section">
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
            Xác minh Email
          </h2>
          <p className="text-gray-600">
            Chúng tôi đã gửi mã xác minh đến{" "}
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        {submitSuccess ? (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-4 text-center">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="text-xl font-semibold mb-2">
              Email đã được xác minh
            </h3>
            <p className="text-gray-700">
              Email của bạn đã được xác minh thành công!
            </p>
            <p className="text-gray-700">
              Đang chuyển hướng đến trang đăng nhập...
            </p>
          </div>
        ) : (
          <>
            {submitError && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {submitError}
              </div>
            )}
            {resendSuccess && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                Mã xác minh mới đã được gửi đến email của bạn
              </div>
            )}

            <form onSubmit={this.handleSubmit} className="flex flex-col">
              <div className="flex justify-center gap-2 mb-6">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => this.handleChange(index, e.target.value)}
                    onKeyDown={(e) => this.handleKeyDown(index, e)}
                    onPaste={index === 0 ? this.handlePaste : undefined}
                    ref={this.inputRefs[index]}
                    required
                    className="w-12 h-16 text-center text-2xl font-semibold border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white border-none rounded text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xác minh..." : "Xác minh Email"}
              </button>

              <div className="mt-4 text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={this.handleResend}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Gửi lại mã
                  </button>
                ) : (
                  <span className="text-gray-600 text-sm">
                    Gửi lại mã sau{" "}
                    <span className="font-semibold">{timer}</span> giây
                  </span>
                )}
              </div>

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

EmailVerification.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(EmailVerification);
