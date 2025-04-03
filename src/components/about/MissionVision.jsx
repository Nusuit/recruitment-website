import React from 'react';

const MissionVision = () => {
  return (
    <div className="mission-vision-section">
      <div className="container">
        <div className="mission-vision-content">
          <h2>Mission and Vision</h2>
          
          <div className="mission-vision-card">
            <div className="mission-content">
              <h3>Our Mission</h3>
              <p>
                "Our mission is to inspire and empower individuals worldwide to confidently
                express their unique style through accessible, high-quality fashion that
                combines creativity, sustainability, and exceptional value."
              </p>
            </div>
            
            <div className="vision-content">
              <h3>Our Vision</h3>
              <p>
                "To become a global leader in progressive retail, setting new standards
                for sustainable practices, digital innovation, and inclusive fashion,
                creating a more connected and beautiful world for all."
              </p>
            </div>
          </div>
          
          <div className="values-content">
            <h3>Core Values</h3>
            <div className="values-grid">
              <div className="value-item">
                <div className="value-icon creativity-icon"></div>
                <h4>Creativity</h4>
                <p>We foster innovation and bold thinking in everything we do.</p>
              </div>
              
              <div className="value-item">
                <div className="value-icon sustainability-icon"></div>
                <h4>Sustainability</h4>
                <p>We're committed to ethical practices and environmental responsibility.</p>
              </div>
              
              <div className="value-item">
                <div className="value-icon inclusivity-icon"></div>
                <h4>Inclusivity</h4>
                <p>We celebrate diversity and create fashion for everyone.</p>
              </div>
              
              <div className="value-item">
                <div className="value-icon excellence-icon"></div>
                <h4>Excellence</h4>
                <p>We strive for the highest quality in products and experiences.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;