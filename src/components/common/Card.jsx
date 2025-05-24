// src/components/common/Card.jsx
import React from "react";
import PropTypes from "prop-types";

const Card = ({
  children,
  title,
  subtitle,
  headerActions, // Slot for buttons or other elements in header
  footer,
  className = "",
  titleClassName = "",
  bodyClassName = "",
  footerClassName = "",
  noPadding = false, // Option to remove body padding
  hoverEffect = true, // Enable hover effect by default
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${
        hoverEffect
          ? "transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
          : ""
      } ${className}`}
      {...props}
    >
      {(title || subtitle || headerActions) && (
        <div className="card-header px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            {title && (
              <h3
                className={`text-lg font-semibold text-gray-800 ${titleClassName}`}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                className={`text-sm text-gray-500 mt-0.5 ${
                  titleClassName ? "" : "text-gray-500"
                }`}
              >
                {" "}
                {/* Adjust subtitle class if needed */}
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="card-header-actions ml-4">{headerActions}</div>
          )}
        </div>
      )}

      <div className={`card-body ${noPadding ? "" : "p-6"} ${bodyClassName}`}>
        {children}
      </div>

      {footer && (
        <div
          className={`card-footer px-6 py-4 border-t border-gray-200 bg-gray-50 ${footerClassName}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  headerActions: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  noPadding: PropTypes.bool,
  hoverEffect: PropTypes.bool,
};

export default Card;
