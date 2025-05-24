// src/pages/guest/CheckEmailPage.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CheckEmailPage = () => {
  const location = useLocation();
  const email = location.state?.email || "your email address";
  const message =
    location.state?.message || "We've sent a link to your email address.";
  const purpose = location.state?.purpose || "verification"; // 'verification' or 'passwordReset'

  let title = "Check Your Email";
  let icon = "envelope-open-text";
  let mainMessage = message;
  let note =
    "If you don't see the email in your inbox, please check your spam or junk folder.";

  if (purpose === "passwordReset") {
    title = "Password Reset Link Sent";
    mainMessage = `We've sent password reset instructions to ${email}.`;
    note =
      "Please click the link in the email to create a new password. The link will expire soon.";
  } else if (purpose === "verification") {
    title = "Verify Your Email Address";
    mainMessage = `A verification link has been sent to ${email}.`;
    note = "Please click the link in the email to complete your registration.";
  }

  return (
    <div className="check-email-page min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="check-email-container bg-white p-8 md:p-12 rounded-xl shadow-2xl max-w-lg w-full text-center border-t-4 border-blue-500">
        <FontAwesomeIcon icon={icon} className="text-6xl text-blue-500 mb-8" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">{mainMessage}</p>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm mb-8">
          <p>{note}</p>
        </div>
        <Link
          to="/login"
          className="w-full md:w-auto inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
        >
          Back to Login
        </Link>
        <p className="text-xs text-gray-500 mt-6">
          If you're having trouble, please{" "}
          <Link to="/contact" className="text-blue-600 hover:underline">
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
