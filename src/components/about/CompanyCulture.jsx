import React from 'react';

const CompanyCulture = () => {
  return (
    <div className="company-culture-section">
      <div className="container">
        <div className="culture-content">
          <div className="culture-text">
            <h2>Company Culture</h2>
            <p className="culture-lead">
              At MyaCorp, we foster a collaborative and energetic work 
              environment where fresh ideas and creativity thrive.
            </p>
            <p>
              Our workspace is designed to inspire innovation, with open floor plans, 
              collaborative zones, and quiet spaces for focused work. We encourage 
              continuous learning through regular workshops, industry events, and 
              access to educational resources.
            </p>
            <p>
              We celebrate diversity and believe that different perspectives lead 
              to better solutions. Our inclusive culture empowers team members to 
              share ideas freely and take ownership of their projects, fostering 
              a sense of belonging and purpose.
            </p>
          </div>
          
          <div className="culture-image">
            <img 
              src="/assets/images/company/culture-collage.jpg" 
              alt="MyaCorp team members collaborating" 
            />
          </div>
        </div>
        
        <div className="culture-benefits">
          <h3>Life at MyaCorp</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon work-life-icon"></div>
              <h4>Work-Life Balance</h4>
              <p>Flexible scheduling, remote work options, and generous time off.</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon growth-icon"></div>
              <h4>Career Growth</h4>
              <p>Clear advancement paths and personalized development plans.</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon health-icon"></div>
              <h4>Health & Wellness</h4>
              <p>Comprehensive benefits and wellness programs.</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon social-icon"></div>
              <h4>Social Impact</h4>
              <p>Community involvement and sustainability initiatives.</p>
            </div>
          </div>
        </div>
        
        <div className="team-photos">
          <div className="photo-grid">
            <div className="photo-item">
              <img src="/assets/images/company/team-1.jpg" alt="Team event" />
            </div>
            <div className="photo-item">
              <img src="/assets/images/company/team-2.jpg" alt="Office space" />
            </div>
            <div className="photo-item">
              <img src="/assets/images/company/team-3.jpg" alt="Team collaboration" />
            </div>
            <div className="photo-item">
              <img src="/assets/images/company/team-4.jpg" alt="Company event" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCulture;