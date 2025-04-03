import React from 'react';
import { Link } from 'react-router-dom';

const StepsToGetJob = () => {
  const steps = [
    {
      id: 1,
      icon: 'search-icon',
      title: 'Search for Job',
      description: 'Browse our extensive catalog of fashion industry positions to find your perfect match.'
    },
    {
      id: 2,
      icon: 'apply-icon',
      title: 'Submit Your CV',
      description: 'Complete our simple application process and upload your resume in just a few clicks.'
    },
    {
      id: 3,
      icon: 'interview-icon',
      title: 'Get Hired',
      description: 'Interview with our team and start your journey with a global fashion leader.'
    }
  ];

  return (
    <div className="steps-container">
      <div className="steps-grid">
        {steps.map(step => (
          <div key={step.id} className="step-item">
            <div className="step-number">{step.id}</div>
            <div className={`step-icon ${step.icon}`}></div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-description">{step.description}</p>
          </div>
        ))}
      </div>
      
      <div className="steps-cta">
        <Link to="/jobs" className="browse-jobs-btn">
          Browse Open Positions
        </Link>
      </div>
    </div>
  );
};

export default StepsToGetJob;