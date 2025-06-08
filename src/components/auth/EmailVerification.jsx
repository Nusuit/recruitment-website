// src/components/auth/EmailVerification.jsx
// This is the component, not the page. The page `src/pages/guest/EmailVerificationPage.jsx` wraps this.
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import authAPI from "../../api/auth";
import LoadingSpinner from "../common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EmailVerificationComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const emailToVerify = location.state?.email || "your email address";

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  useEffect(() => {
    inputRefs.current[0]?.current?.focus();
  }, []);

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^[0-9]$/.test(value) && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
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
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
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
          result.error || result.message || "Invalid or expired OTP."
        );
        setOtp(new Array(6).fill(""));
        inputRefs.current[0]?.current?.focus();
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setIsSubmitting(true);
    setSubmitError("");
    setResendMessage("");
    try {
      const result = await authAPI.resendOTP(emailToVerify);
      if (result.success) {
        setResendMessage("A new verification code has been sent.");
        setTimer(60);
        setCanResend(false);
      } else {
        setSubmitError(
          result.error || result.message || "Failed to resend code."
        );
      }
    } catch (error) {
      setSubmitError("An error occurred while resending the code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center p-6">
        <FontAwesomeIcon
          icon="check-circle"
          className="text-5xl text-green-500 mb-4"
        />
        <h3 className="text-xl font-semibold text-green-700 mb-2">
          Email Verified!
        </h3>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="verification-form-section w-full p-8 flex flex-col justify-center">
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
          A 6-digit code was sent to{" "}
          <strong className="text-gray-700">{emailToVerify}</strong>.
        </p>
      </div>
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
          {submitError}
        </div>
      )}
      {resendMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md text-sm mb-4">
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
              type="text"
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
          Didn't receive code?{" "}
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
  );
};

export default EmailVerificationComponent;
