// src/pages/guest/EmailVerificationPage.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext"; // Assuming AuthContext handles OTP logic
import authAPI from "../../api/auth"; // Or directly use authAPI if preferred
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/AuthForms.scss"; // Ensure this path is correct

const EmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { verifyOtp, resendOtp } = useContext(AuthContext); // Get functions from context if available

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const inputRefs = useRef([]);
  inputRefs.current = otp.map(
    (_, i) => inputRefs.current[i] ?? React.createRef()
  );

  const emailToVerify = location.state?.email || "your email address"; // Get email from navigation state

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  useEffect(() => {
    // Focus the first input on mount
    inputRefs.current[0]?.current?.focus();
  }, []);

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^[0-9]$/.test(value) && value !== "") return; // Allow only single digit or empty

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input if current has value and it's not the last input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // Prevent default backspace behavior (like navigating back)
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) {
        inputRefs.current[index - 1].current.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].current.focus();
    } else if (e.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, ""); // Remove non-digits
    if (paste.length === otp.length) {
      setOtp(paste.split(""));
      inputRefs.current[otp.length - 1].current.focus();
    } else if (paste.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < Math.min(paste.length, otp.length); i++) {
        newOtp[i] = paste[i];
      }
      setOtp(newOtp);
      const focusIndex = Math.min(paste.length, otp.length - 1);
      inputRefs.current[focusIndex].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setResendMessage("");
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setSubmitError("Please enter the complete 6-digit code.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Use authAPI directly or context function
      const result = await authAPI.verifyOTP(emailToVerify, enteredOtp);
      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate("/login", {
            state: {
              successMessage:
                "Email verified successfully! You can now log in.",
            },
          });
        }, 3000);
      } else {
        setSubmitError(
          result.error ||
            result.message ||
            "Invalid or expired OTP. Please try again."
        );
        setOtp(new Array(6).fill("")); // Clear OTP fields on error
        inputRefs.current[0]?.current?.focus();
      }
    } catch (error) {
      console.error("Verification error:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsSubmitting(true); // Use isSubmitting to disable resend button too
    setSubmitError("");
    setResendMessage("");
    try {
      const result = await authAPI.resendOTP(emailToVerify);
      if (result.success) {
        setResendMessage("A new verification code has been sent.");
        setTimer(60); // Reset timer
        setCanResend(false);
      } else {
        setSubmitError(
          result.error ||
            result.message ||
            "Failed to resend code. Please try again."
        );
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setSubmitError("An error occurred while resending the code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="email-verification-page">
        <div className="verification-container items-center justify-center text-center p-10">
          <FontAwesomeIcon
            icon="check-circle"
            className="text-6xl text-green-500 mb-6"
          />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Email Verified!
          </h2>
          <p className="text-gray-600 mb-6">
            Your email address has been successfully verified.
          </p>
          <p className="text-gray-500 text-sm">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="email-verification-page">
      <div className="verification-container flex-col md:flex-row">
        {" "}
        {/* Ensure flex-col for mobile stacking */}
        {/* Form Section */}
        <div className="verification-form-section w-full md:w-1/2 lg:w-2/5 p-8 flex flex-col justify-center">
          <div className="brand-logo mb-8 text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-2">
              <img
                src="/assets/images/logo.png"
                alt="MyaCorp Logo"
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold text-blue-600">MyaCorp</span>
            </Link>
          </div>

          <div className="mb-6 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600">
              A 6-digit verification code has been sent to{" "}
              <strong className="text-gray-700">{emailToVerify}</strong>.
            </p>
          </div>

          {submitError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm mb-4"
              role="alert"
            >
              {submitError}
            </div>
          )}
          {resendMessage && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md text-sm mb-4"
              role="alert"
            >
              {resendMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              className="flex justify-center space-x-2 sm:space-x-3"
              onPaste={handlePaste}
            >
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text" // Use text to allow easier pasting and single char input
                  name="otp"
                  maxLength="1"
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={inputRefs.current[index]}
                  autoComplete="off"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:bg-gray-400"
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : "Verify Email"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Didn't receive the code?{" "}
              {canResend ? (
                <button
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                  className="font-medium text-blue-600 hover:underline disabled:text-gray-400"
                >
                  Resend Code
                </button>
              ) : (
                <span className="text-gray-500">Resend in {timer}s</span>
              )}
            </p>
            <p className="mt-2">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
        {/* Image Section - Hidden on small screens, shown on md+ */}
        <div className="hidden md:flex verification-image-section w-full md:w-1/2 lg:w-3/5 bg-gradient-to-br from-blue-500 to-indigo-600 flex-col justify-center items-center p-8 relative">
          <div className="text-center text-white max-w-md">
            <FontAwesomeIcon
              icon="envelope-open-text"
              className="text-6xl mb-8 opacity-80"
            />
            <h3 className="text-3xl font-bold mb-4">Almost There!</h3>
            <p className="text-lg opacity-90">
              Just one more step to secure your account and unlock all features.
              Enter the code from your email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
