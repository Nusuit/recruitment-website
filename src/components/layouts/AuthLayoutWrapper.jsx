// src/components/layouts/AuthLayoutWrapper.jsx (Hoặc tên tương tự bạn dùng trong App.js)
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Cần cho layout single-column
import { Link } from "react-router-dom"; // Cần cho layout single-column

const AuthLayoutWrapper = () => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const showTwoColumnLayout =
    currentPath === "/login" || currentPath === "/signup";

  let imageSrc = "";
  let quoteText = "";
  let quoteAuthor = "";

  if (currentPath === "/login") {
    imageSrc = "/assets/images/login.png"; // Đảm bảo file này tồn tại trong public/assets/images/
    quoteText = "Style is a way to say who you are without having to speak.";
    quoteAuthor = "Rachel Zoe";
  } else if (currentPath === "/signup") {
    imageSrc = "/assets/images/register.png"; // Đảm bảo file này tồn tại trong public/assets/images/
    quoteText = "Fashion is the armor to survive the reality of everyday life.";
    quoteAuthor = "Bill Cunningham";
  }

  if (showTwoColumnLayout) {
    return (
      <div className="auth-page-full-container min-h-screen flex items-center justify-center bg-gray-900 p-4 py-8 md:py-12">
        <div className="auth-card flex flex-col md:flex-row w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl bg-white shadow-2xl rounded-xl overflow-hidden">
          {" "}
          {/* Tăng max-width nếu cần */}
          {/* Cột trái cho Form (LoginForm hoặc SignUpForm sẽ được Outlet render ở đây) */}
          {/* Component con (LoginForm/SignUpForm) sẽ tự định nghĩa width của nó là md:w-2/5 */}
          <Outlet />
          {/* Cột phải cho ảnh và trích dẫn */}
          <div className="hidden md:flex md:w-3/5 bg-gray-800 p-10 lg:p-16 flex-col justify-center items-center text-white text-center relative">
            <img
              src={imageSrc}
              alt="Fashion Illustration"
              className="max-w-sm lg:max-w-md xl:max-w-lg mb-8 object-contain" // Điều chỉnh max-w cho ảnh
            />
            <blockquote className="relative z-10">
              <p className="text-xl lg:text-2xl italic mb-4 leading-relaxed">
                "{quoteText}"
              </p>
              <footer className="text-sm text-gray-300">- {quoteAuthor}</footer>
            </blockquote>
          </div>
        </div>
      </div>
    );
  }

  // Layout mặc định cho các trang auth khác (ví dụ: Forgot Password, Reset Password, Email Verification)
  return (
    <div className="auth-page-single-column min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 py-8 md:py-12">
      <div className="brand-logo mb-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <img
            src="/assets/images/logo-myjob.png" // Logo chung cho các trang auth
            alt="MyJob Logo"
            className="h-10 w-auto"
          />
        </Link>
      </div>
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-xl shadow-2xl">
        <Outlet /> {/* Các form như ForgotPasswordForm sẽ render ở đây */}
      </div>
    </div>
  );
};

export default AuthLayoutWrapper;
