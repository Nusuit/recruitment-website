import React, { useState } from 'react';
import Modal from '../common/Modal';

const LeadershipTeam = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);
  
  // Leadership team data
  const leaders = [
    {
      id: 1,
      name: 'David Chen',
      role: 'Chief Executive Officer',
      image: '/assets/images/team/ceo.jpg',
      bio: `
        David brings over 20 years of experience in the fashion industry, 
        having previously served as COO at a global fashion brand. His vision 
        and strategic leadership have been instrumental in MyaCorp's growth 
        and innovation.
        
        Under his guidance, the company has expanded into new markets while 
        maintaining its commitment to sustainability and ethical fashion. David 
        holds an MBA from Harvard Business School and is passionate about 
        mentoring the next generation of fashion entrepreneurs.
      `,
      linkedin: 'davidchen'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Chief Creative Officer',
      image: '/assets/images/team/cco.jpg',
      bio: `
        Sarah is an award-winning fashion designer with a background in 
        haute couture. Before joining MyaCorp, she worked with several 
        prestigious fashion houses in Paris and New York.
        
        Her innovative designs and commitment to sustainable materials have 
        helped position MyaCorp as a leader in eco-conscious fashion. Sarah 
        holds a degree from Parsons School of Design and regularly speaks at 
        industry conferences on the future of sustainable fashion.
      `,
      linkedin: 'sarahjohnson'
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      role: 'Chief Operating Officer',
      image: '/assets/images/team/coo.jpg',
      bio: `
        Michael oversees the day-to-day operations at MyaCorp, including 
        supply chain management, production, and logistics. His expertise 
        in operational efficiency has helped streamline processes while 
        maintaining the highest quality standards.
        
        Prior to MyaCorp, Michael spent 15 years in operations management 
        at leading retail companies. He holds an MS in Supply Chain Management 
        from MIT and is dedicated to implementing sustainable practices 
        throughout the production process.
      `,
      linkedin: 'michaelrodriguez'
    },
    {
      id: 4,
      name: 'Emily Zhang',
      role: 'Chief Marketing Officer',
      image: '/assets/images/team/cmo.jpg',
      bio: `
        Emily leads MyaCorp's marketing strategy, brand development, and 
        customer experience initiatives. Her innovative approach to digital 
        marketing has significantly expanded the company's global presence.
        
        Before joining MyaCorp, Emily was a Marketing Director at a major 
        e-commerce platform. She holds an MBA from London Business School 
        and is passionate about creating authentic connections between 
        brands and consumers through storytelling.
      `,
      linkedin: 'emilyzhang'
    },
    {
      id: 5,
      name: 'James Wilson',
      role: 'Chief Financial Officer',
      image: '/assets/images/team/cfo.jpg',
      bio: `
        James oversees all financial operations at MyaCorp, including 
        financial planning, risk management, and investor relations. His 
        strategic financial leadership has been key to the company's 
        sustainable growth and profitability.
        
        With over 15 years of experience in financial management within 
        the retail sector, James brings valuable industry insights to the 
        executive team. He is a CPA and holds an MBA from the Wharton 
        School of Business.
      `,
      linkedin: 'jameswilson'
    }
  ];
  
  // Open leader bio modal
  const openLeaderBio = (leader) => {
    setSelectedLeader(leader);
  };
  
  // Close leader bio modal
  const closeLeaderBio = () => {
    setSelectedLeader(null);
  };
  
  return (
    <div className="leadership-section">
      <div className="container">
        <div className="leadership-header">
          <h2>Leadership Team</h2>
          <p className="leadership-intro">
            Our executive team brings together years of experience in the fashion industry. 
            Together, they're guiding our company toward continuous innovation and growth.
          </p>
        </div>
        
        <div className="leadership-grid">
          {leaders.map(leader => (
            <div key={leader.id} className="leader-card">
              <div className="leader-image">
                <img src={leader.image} alt={leader.name} />
              </div>
              <div className="leader-info">
                <h3>{leader.name}</h3>
                <p className="leader-role">{leader.role}</p>
                <button 
                  className="view-bio-btn"
                  onClick={() => openLeaderBio(leader)}
                >
                  View Bio
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="team-cta">
          <p>Ready to start your journey with us?</p>
          <a href="/jobs" className="team-cta-btn">Check out our current job openings and apply today</a>
        </div>
      </div>
      
      {/* Leader Bio Modal */}
      {selectedLeader && (
        <Modal 
          title={`${selectedLeader.name} - ${selectedLeader.role}`}
          onClose={closeLeaderBio}
        >
          <div className="leader-bio-content">
            <div className="leader-bio-image">
              <img src={selectedLeader.image} alt={selectedLeader.name} />
            </div>
            <div className="leader-bio-text">
              <p>{selectedLeader.bio}</p>
            </div>
            <div className="leader-social">
              <a 
                href={`https://linkedin.com/in/${selectedLeader.linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="linkedin-link"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LeadershipTeam;