import React from 'react';
import PropTypes from 'prop-types';

const EmptyState = ({ icon, title, description, action }) => {
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'applications':
        return '📝';
      case 'bookmark':
        return '🔖'; 
      case 'search':
        return '🔍';
      case 'profile':
        return '👤';
      default:
        return '📋';
    }
  };

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {getIconComponent(icon)}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.oneOf(['applications', 'bookmark', 'search', 'profile']),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.node
};

export default EmptyState;