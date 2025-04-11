import React from 'react';
import AboutHero from '../../components/about/AboutHero';
import TeamNetwork from '../../components/about/TeamNetwork';
import MissionVision from '../../components/about/MissionVision';
import CompanyCulture from '../../components/about/CompanyCulture';
import LeadershipTeam from '../../components/about/LeadershipTeam';

const AboutPage = () => {
  return (
    <div className="about-page">
      <AboutHero />
      <div className="about-image-section">
        <img src="/assets/images/aboutus1.png" alt="About Us" className="about-image" />
        <img src="/assets/images/about2.png" alt="Our Mission" className="about-image" />
        <img src="/assets/images/about3.png" alt="Our Vision" className="about-image" />
      </div>
      <div className="about-content">
        <section className="team-network-section">
          <TeamNetwork />
        </section>
        
        <section className="mission-vision-section">
          <MissionVision />
        </section>
        
        <section className="company-culture-section">
          <CompanyCulture />
        </section>
        
        <section className="leadership-section">
          <LeadershipTeam />
        </section>
        
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Join Our Team</h2>
              <p>
                Ready to start your journey with us? Check out our current job openings and apply today!
              </p>
              <a href="/jobs" className="cta-button">
                View Open Positions
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;