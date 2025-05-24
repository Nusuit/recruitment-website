// src/components/common/Input.jsx
import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Input = ({
  type = "text",
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = "",
  inputClassName = "", // Specific class for the input element itself
  labelClassName = "",
  errorClassName = "",
  iconLeft, // FontAwesome icon prop
  iconRight,
  onIconRightClick, // Function for right icon click
  wrapperClassName = "", // Class for the div wrapping label and input
  ...props
}) => {
  const hasIconLeft = Boolean(iconLeft);
  const hasIconRight = Boolean(iconRight);

  return (
    <div className={`form-group ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName} ${
            required
              ? 'after:content-["*"] after:ml-0.5 after:text-red-500'
              : ""
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {hasIconLeft && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon
              icon={iconLeft}
              className="h-5 w-5 text-gray-400"
            />
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value || ""} // Ensure value is not undefined for controlled components
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled || props.readOnly}
          required={required}
          className={`w-full p-2.5 border rounded-md focus:ring-2 transition-colors duration-150
            ${hasIconLeft ? "pl-10" : ""}
            ${hasIconRight ? "pr-10" : ""}
            ${
              error
                ? "border-red-500 ring-red-200 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            }
            ${
              disabled || props.readOnly
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white"
            }
            ${inputClassName}`}
          {...props}
        />
        {hasIconRight && (
          <div
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
              onIconRightClick ? "cursor-pointer" : "pointer-events-none"
            }`}
            onClick={onIconRightClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onIconRightClick?.();
            }}
            role={onIconRightClick ? "button" : undefined}
            tabIndex={onIconRightClick ? 0 : -1}
            aria-label={
              props["aria-label"] ||
              (onIconRightClick ? "Toggle visibility or action" : undefined)
            }
          >
            <FontAwesomeIcon
              icon={iconRight}
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
            />
          </div>
        )}
      </div>
      {error && (
        <p className={`text-xs text-red-600 mt-1 ${errorClassName}`}>{error}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string, // For the wrapper div if needed, but wrapperClassName is more specific
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  errorClassName: PropTypes.string,
  iconLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  iconRight: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onIconRightClick: PropTypes.func,
  wrapperClassName: PropTypes.string,
};

export default Input;
