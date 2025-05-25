// src/components/layouts/AuthLayoutWrapper.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayoutWrapper = () => {
  // Layout này sẽ áp dụng cho TẤT CẢ các trang auth: login, signup, forgot-password, etc.
  // Nó chỉ đơn giản là cung cấp nền trắng và căn giữa cho form.
  return (
    <div className="auth-page-wrapper min-h-screen flex flex-col items-center justify-center bg-white p-4 py-12">
      {/*
        Logo và các yếu tố header khác sẽ được xử lý bên trong từng component form
        (ví dụ: LoginForm, SignUpForm) để linh hoạt hơn.
      */}
      <Outlet />{" "}
      {/* Các form như LoginForm, SignUpForm, ForgotPasswordForm sẽ render ở đây */}
    </div>
  );
};

export default AuthLayoutWrapper;
