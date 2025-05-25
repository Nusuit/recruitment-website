// src/pages/guest/LoginPage.jsx
import React from "react";
import LoginForm from "../../components/auth/LoginForm";
import AuthImageSection from "../../components/auth/AuthImageSection";
import { Link } from "react-router-dom";
import "../../styles/AuthForms.scss"; // SCSS này đã có trong Canvas

const LoginPage = () => {
  return (
    <div className="login-page-wrapper">
      {" "}
      {/* Nền tối cho toàn trang */}
      {/* Header tối */}
      <div className="login-header-bar">
        <div className="container mx-auto flex justify-between items-center py-4 px-6 sm:px-8">
          <h1 className="text-xl font-semibold text-white">Login</h1>
          <Link to="/">
            <img
              src="/assets/images/logo-myjob-white.png"
              alt="MyJob Logo"
              className="h-7 w-auto"
            />
          </Link>
        </div>
      </div>
      {/* Nội dung trang (Căn giữa container) */}
      <div className="login-page-content">
        {/* Container trắng */}
        <div className="login-container">
          {/* Cột Form (Trái) */}
          <LoginForm />
          {/* Cột Ảnh (Phải) - Sẽ tự động ẩn trên mobile nhờ class Tailwind trong AuthImageSection và SCSS */}
          <AuthImageSection />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
