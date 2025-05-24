// src/components/about/LeadershipTeam.jsx
import React, { useState } from "react";
import Modal from "../common/Modal"; // Assuming Modal is refactored
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLinkedin } from '@fortawesome/free-brands-svg-icons'; // Ensure this is in fontawesome.js

const LeadershipTeam = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);

  const leaders = [
    {
      id: 1,
      name: "David Chen",
      role: "Chief Executive Officer",
      image: "/assets/images/team/ceo.jpg",
      bio: "David brings over 20 years of experience in the fashion industry, driving MyaCorp's vision and growth with strategic leadership and a passion for innovation.",
      linkedin: "davidchen-myacorp",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Chief Creative Officer",
      image: "/assets/images/team/cco.jpg",
      bio: "An award-winning designer, Sarah leads MyaCorp's creative direction, focusing on sustainable materials and groundbreaking fashion concepts.",
      linkedin: "sarahjohnson-myacorp",
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      role: "Chief Operating Officer",
      image: "/assets/images/team/coo.jpg",
      bio: "Michael oversees MyaCorp's global operations, ensuring efficiency and quality from supply chain to customer delivery.",
      linkedin: "michaelrodriguez-myacorp",
    },
    {
      id: 4,
      name: "Emily Zhang",
      role: "Chief Marketing Officer",
      image: "/assets/images/team/cmo.jpg",
      bio: "Emily crafts MyaCorp's brand narrative and customer engagement strategies, leveraging digital innovation to expand our global reach.",
      linkedin: "emilyzhang-myacorp",
    },
  ];

  const openLeaderBioModal = (leader) => setSelectedLeader(leader);
  const closeLeaderBioModal = () => setSelectedLeader(null);

  return (
    <section className="leadership-team-section py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Meet Our Visionary Leadership
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our experienced executive team is dedicated to guiding MyaCorp
            towards a future of innovation, sustainability, and global impact in
            the fashion world.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {leaders.map((leader) => (
            <div
              key={leader.id}
              className="leader-card bg-gray-50 rounded-xl shadow-lg overflow-hidden group text-center p-6 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-md group-hover:border-blue-400 transition-colors"
                />
                <div className="absolute inset-0 rounded-full ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {leader.name}
              </h3>
              <p className="text-blue-600 font-medium text-sm mb-4">
                {leader.role}
              </p>
              <button
                onClick={() => openLeaderBioModal(leader)}
                className="text-xs text-gray-500 hover:text-blue-600 font-medium transition-colors group-hover:underline"
              >
                View Bio{" "}
                <FontAwesomeIcon
                  icon="arrow-right"
                  size="xs"
                  className="ml-1"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedLeader && (
        <Modal
          title={`${selectedLeader.name} - ${selectedLeader.role}`}
          isOpen={!!selectedLeader}
          onClose={closeLeaderBioModal}
          size="lg" // Or 'xl' for more content
        >
          <div className="leader-bio-modal-content p-2 md:p-4 text-sm">
            <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
              <img
                src={selectedLeader.image}
                alt={selectedLeader.name}
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
              />
              <p className="text-gray-600 leading-relaxed italic sm:text-left text-center">
                "{selectedLeader.bio.substring(0, 150)}
                {selectedLeader.bio.length > 150 ? "..." : ""}"{" "}
                {/* Short bio preview */}
              </p>
            </div>
            <h4 className="font-semibold text-gray-700 mb-1">Full Bio:</h4>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-6 text-xs">
              {selectedLeader.bio}
            </p>
            <a
              href={`https://linkedin.com/in/${selectedLeader.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-colors"
            >
              <FontAwesomeIcon icon={["fab", "linkedin-in"]} /> Connect on
              LinkedIn
            </a>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default LeadershipTeam;
