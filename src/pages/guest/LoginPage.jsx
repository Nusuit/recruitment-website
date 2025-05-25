// src/pages/guest/LoginPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import AuthImageSection from "../../components/auth/AuthImageSection";

const LoginPage = () => {
  const loginImage = "/assets/images/login.png"; // Ảnh cho trang Login
  const loginQuote =
    "Style is a way to say who you are without having to speak.";
  const loginAuthor = "Rachel Zoe";

  return (
    <div className="login-page-wrapper-v3 bg-white min-h-screen w-full flex flex-col items-center p-4 sm:p-6 lg:p-8">
      {/* Container cha vẫn giữ max-w-5xl */}
      <div className="w-full max-w-5xl flex flex-col flex-grow justify-center">
        <header className="absolute top-0 left-0 w-full py-4 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            {" "}
            {/* Đảm bảo container header cũng là max-w-5xl */}
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
          {/* Tăng max-w của main container để cho phép các cột con mở rộng */}
          <main className="flex flex-col md:flex-row bg-white rounded-xl md:shadow-xl overflow-hidden w-full max-w-5xl min-h-[550px] md:min-h-[auto]">
            {" "}
            {/* Đổi max-w-4xl thành max-w-5xl */}
            {/* Left Column: Login Form - Đặt lại thành md:w-1/2 */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
              <LoginForm />
            </div>
            {/* Right Column: Image and Quote - Đặt lại thành md:w-1/2 */}
            <div className="w-full md:w-1/2 hidden md:flex flex-col justify-center items-center p-8 lg:p-10 bg-white">
              <AuthImageSection
                imageSrc={loginImage}
                imageAlt="Login Fashion Illustration"
                quoteText={loginQuote}
                quoteAuthor={loginAuthor}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
