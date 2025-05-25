// src/components/auth/AuthImageSection.jsx
import React from "react";

const AuthImageSection = () => {
  return (
    // Class hidden md:flex đảm bảo nó chỉ hiển thị trên màn hình md trở lên
    <div className="login-image-section hidden md:flex w-full md:w-1/2 flex-col justify-center items-center p-12 text-center relative bg-white">
      {/* Image */}
      <img
        src="/assets/images/login.png" // Đường dẫn đến ảnh minh họa thời trang
        alt="Login Illustration"
        className="max-w-xs sm:max-w-sm lg:max-w-md mx-auto mb-10"
      />

      {/* Quote */}
      <div className="quote-section text-gray-800">
        <p className="text-xl lg:text-2xl italic mb-3 leading-relaxed">
          “Style is a way to say who you are without having to speak.”
        </p>
        <cite className="text-base font-medium text-gray-600">
          - Rachel Zoe
        </cite>
      </div>
    </div>
  );
};

export default AuthImageSection;
