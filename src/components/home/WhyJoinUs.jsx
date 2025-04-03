import React from 'react';

const WhyJoinUs = () => {
  const benefits = [
    {
      id: 1,
      icon: 'collaborative-icon',
      title: 'Collaborative Culture',
      description: 'Work with a diverse team in an environment that values creativity and teamwork.'
    },
    {
      id: 2,
      icon: 'growth-icon',
      title: 'Professional Growth',
      description: 'Develop your skills through ongoing training and advancement opportunities.'
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
      description: 'Enjoy comprehensive health insurance, retirement plans, and generous vacation time.'
    }
  ];

  return (
    <div className="why-join-grid">
      {benefits.map(benefit => (
        <div key={benefit.id} className="why-join-item">
          <div className={`why-join-icon ${benefit.icon}`}></div>
          <h3 className="why-join-title">{benefit.title}</h3>
          <p className="why-join-description">{benefit.description}</p>
        </div>
      ))}
    </div>
  );
};

export default WhyJoinUs;