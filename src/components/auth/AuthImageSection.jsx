// src/components/auth/AuthImageSection.jsx
import React from "react";
import PropTypes from "prop-types";

const AuthImageSection = ({ imageSrc, imageAlt, quoteText, quoteAuthor }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full text-center px-4">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto mb-8 object-contain"
      />
      <div className="text-gray-700 max-w-md">
        <p className="text-xl lg:text-2xl italic mb-3 leading-relaxed">
          “{quoteText}”
        </p>
        {quoteAuthor && (
          <cite className="text-sm font-medium text-gray-500">
            - {quoteAuthor}
          </cite>
        )}
      </div>
    </div>
  );
};

AuthImageSection.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  quoteText: PropTypes.string.isRequired,
  quoteAuthor: PropTypes.string,
};

// Thêm defaultProps để component không bị lỗi nếu thiếu props
AuthImageSection.defaultProps = {
  imageSrc: "/assets/images/login.png", // Ảnh mặc định
  imageAlt: "Fashion Illustration",
  quoteText: "Style is a way to say who you are without having to speak.",
  quoteAuthor: "Rachel Zoe",
};

export default AuthImageSection;
