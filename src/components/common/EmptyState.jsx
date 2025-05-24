// src/components/common/EmptyState.jsx
import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Ensure you have these icons in your fontawesome.js setup
// Possible icons: 'folder-open', 'search', 'file-alt', 'user-slash', 'exclamation-triangle', etc.

const EmptyState = ({ icon, title, description, action, className = "" }) => {
  return (
    <div
      className={`empty-state text-center py-12 px-6 bg-white rounded-lg shadow-sm border border-gray-100 ${className}`}
    >
      {icon && (
        <div className="mb-6">
          <FontAwesomeIcon
            icon={icon}
            className="text-5xl text-gray-300" // Adjusted for better visibility
          />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">{description}</p>
      {action && <div className="empty-state-action mt-6">{action}</div>}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.string, // FontAwesome icon name (without 'fa-' prefix if using string directly)
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.node,
  className: PropTypes.string,
};

export default EmptyState;
