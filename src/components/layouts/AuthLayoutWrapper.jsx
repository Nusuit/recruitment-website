// src/components/layouts/AuthLayoutWrapper.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayoutWrapper = () => {
  return (
    <div className="auth-page-wrapper min-h-screen flex flex-col items-center justify-center bg-white p-4 py-12">
      <Outlet />
    </div>
  );
};

export default AuthLayoutWrapper;
