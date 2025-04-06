import React from 'react';

const WhyJoinUs = () => {
  const benefits = [
    {
      id: 1,
      icon: 'collaborative-icon',
      title: 'Collaborative Culture',
      description: 'Work with talented professionals in a creative and positive environment.'
    },
    {
      id: 2,
      icon: 'growth-icon',
      title: 'Professional Growth',
      description: 'Develop your skills through training and advancement opportunities.'
    },
    {
      id: 3,
      icon: 'innovation-icon',
      title: 'Innovation at Scale',
      description: 'Be part of a forward-thinking company that embraces new technologies and ideas.'
    },
    {
      id: 4,
      icon: 'benefits-icon',
      title: 'Competitive Benefits',
      description: 'Enjoy comprehensive benefits, retirement plans, and generous vacation time.'
    }
  ];

  return (
    <div className="benefits-grid">
      {benefits.map(benefit => (
        <div key={benefit.id} className="benefit-card">
          <div className={`benefit-icon ${benefit.icon}`}></div>
          <h3>{benefit.title}</h3>
          <p>{benefit.description}</p>
        </div>
      ))}
    </div>
  );
};

export default WhyJoinUs;