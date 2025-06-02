// src/components/auth/AuthImageSection.jsx
import React from "react";
import PropTypes from "prop-types";

// Sử dụng JavaScript default parameters thay vì defaultProps
const AuthImageSection = ({
  imageSrc = "/assets/images/login.png", // Ảnh mặc định
  imageAlt = "Fashion Illustration",   // Alt text mặc định
  quoteText = "Style is a way to say who you are without having to speak.", // Trích dẫn mặc định
  quoteAuthor = "Rachel Zoe"             // Tác giả mặc định
}) => {
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
  // Không còn .isRequired vì đã có giá trị mặc định
  imageSrc: PropTypes.string,
  imageAlt: PropTypes.string,
  quoteText: PropTypes.string,
  quoteAuthor: PropTypes.string,
};

// Bỏ hoàn toàn khối AuthImageSection.defaultProps

export default AuthImageSection;
