import React from 'react';

const TeamNetwork = () => {
  return (
    <div className="team-network">
      <div className="network-visualization">
        {/* The network visualization should be implemented with appropriate
            technology such as D3.js, but here we'll use a static image */}
        <div className="network-image">
          <img src="/assets/images/team/team-network.svg" alt="Team network visualization" />
        </div>
        
        {/* Team Member Nodes - In a real implementation these would be interactive */}
        <div className="team-nodes">
          {/* Node positions would be calculated dynamically */}
          <div className="team-node" style={{ top: '20%', left: '30%' }}>
            <div className="node-avatar">
              <img src="/assets/images/team/member1.jpg" alt="Team member" />
            </div>
          </div>
          <div className="team-node" style={{ top: '40%', left: '60%' }}>
            <div className="node-avatar">
              <img src="/assets/images/team/member2.jpg" alt="Team member" />
            </div>
          </div>
          <div className="team-node" style={{ top: '70%', left: '25%' }}>
            <div className="node-avatar">
              <img src="/assets/images/team/member3.jpg" alt="Team member" />
            </div>
          </div>
          <div className="team-node" style={{ top: '60%', left: '80%' }}>
            <div className="node-avatar">
              <img src="/assets/images/team/member4.jpg" alt="Team member" />
            </div>
          </div>
          <div className="team-node" style={{ top: '30%', left: '75%' }}>
            <div className="node-avatar">
              <img src="/assets/images/team/member5.jpg" alt="Team member" />
            </div>
          </div>
          <div className="team-node" style={{ top: '50%', left: '40%' }}>
            <div className="node-avatar">
              <img src="/assets/images/team/member6.jpg" alt="Team member" />
            </div>
          </div>
          <div className="team-node" style={{ top: '80%', left: '60%' }}>
            <div className="node-avatar">
              <img src="/assets/images/team/member7.jpg" alt="Team member" />
            </div>
          </div>
          <div className="team-node" style={{ top: '10%', left: '50%' }}>
            <div className="node-avatar">
              <img src="/assets/images/team/member8.jpg" alt="Team member" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamNetwork;