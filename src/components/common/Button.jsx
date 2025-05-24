// src/components/common/Button.jsx
import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingSpinner from "./LoadingSpinner"; // Assuming LoadingSpinner is available

const Button = ({
  children,
  variant = "primary", // primary, secondary, danger, outline-primary, text
  size = "md", // sm, md, lg
  type = "button",
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
  isLoading = false,
  iconLeft,
  iconRight,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-transparent",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 border border-transparent",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent",
    "outline-primary":
      "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    "outline-danger":
      "bg-transparent text-red-600 border border-red-600 hover:bg-red-50 focus:ring-red-500",
    text: "bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500 shadow-none hover:shadow-none",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      className={`${baseClasses} ${
        variantClasses[variant] || variantClasses.primary
      } ${sizeClasses[size] || sizeClasses.md} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner size="sm" className="text-current" /> // Spinner inherits button text color
      ) : (
        <>
          {iconLeft && (
            <FontAwesomeIcon
              icon={iconLeft}
              className={children ? "mr-2" : ""}
            />
          )}
          {children}
          {iconRight && (
            <FontAwesomeIcon
              icon={iconRight}
              className={children ? "ml-2" : ""}
            />
          )}
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "outline-primary",
    "outline-danger",
    "text",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  iconLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // For FontAwesome icon prop
  iconRight: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

export default Button;
