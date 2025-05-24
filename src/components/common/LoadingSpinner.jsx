// src/components/common/LoadingSpinner.jsx
import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons"; // Using a specific spinner icon

const LoadingSpinner = ({
  size = "md",
  fullPage = false,
  message = "",
  className = "",
}) => {
  const sizeClasses = {
    sm: "text-xl", // Tailwind: text-xl
    md: "text-3xl", // Tailwind: text-3xl
    lg: "text-5xl", // Tailwind: text-5xl
  };

  const spinnerColor = "text-blue-600"; // Tailwind: text-blue-600

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <FontAwesomeIcon
        icon={faSpinner}
        className={`animate-spin ${
          sizeClasses[size] || sizeClasses.md
        } ${spinnerColor}`}
      />
      {message && (
        <p className={`mt-3 text-sm text-gray-600 ${spinnerColor}`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-[100]">
        {spinner}
      </div>
    );
  }

  return spinner; // Render directly if not fullPage
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  fullPage: PropTypes.bool,
  message: PropTypes.string,
  className: PropTypes.string,
};

export default LoadingSpinner;
