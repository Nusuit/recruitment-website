import React from 'react';

const LoadingSpinner = ({ size = 'medium', fullPage = false }) => {
  const sizeClass = size === 'small' ? 'spinner-sm' : 
                    size === 'large' ? 'spinner-lg' : '';
  
  const spinner = (
    <div className={`spinner ${sizeClass}`}></div>
  );
  
  if (fullPage) {
    return (
      <div className="spinner-fullpage">
        {spinner}
      </div>
    );
  }
  
  return (
    <div className="loading-container">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;