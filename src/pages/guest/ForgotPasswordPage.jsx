// src/pages/guest/ForgotPasswordPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import AuthImageSection from "../../components/auth/AuthImageSection";

const ForgotPasswordPage = () => {
  const forgotPasswordImage = "/assets/images/forgot_password.png";
  const forgotPasswordQuote = "In fashion, one day you're in and the next you're out.";
  const forgotPasswordAuthor = "Heidi Klum";

  return (
    <div className="forgot-password-page-wrapper bg-white min-h-screen w-full flex flex-col items-center p-4 sm:p-5 lg:p-6">
      <div className="w-full max-w-5xl flex flex-col flex-grow justify-center">
        <header className="absolute top-0 left-0 w-full py-4 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <Link to="/" className="flex items-center">
              <img
                src="/assets/images/logo.png"
                alt="MyaCorp Logo"
                className="h-8 w-auto mr-2"
              />
              <span className="text-xl font-bold text-gray-800">MyaCorp</span>
            </Link>
          </div>
        </header>
        <div className="flex flex-col md:flex-row items-center w-full flex-grow justify-center mt-12 md:mt-10">
          <main className="flex flex-col md:flex-row bg-white rounded-xl md:shadow-xl overflow-hidden w-full max-w-5xl min-h-[550px] md:min-h-[auto]">
            <div className="w-full md:w-2/5 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
              <ForgotPasswordForm />
            </div>
            <div className="w-full md:w-3/5 hidden md:flex flex-col justify-center items-center p-8 lg:p-10 bg-white">
              <AuthImageSection
                imageSrc={forgotPasswordImage}
                imageAlt="Forgot Password Illustration"
                quoteText={forgotPasswordQuote}
                quoteAuthor={forgotPasswordAuthor}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
