// src/components/about/TeamNetwork.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// This component is highly visual and would typically require a dedicated library (like D3.js, VisNetwork, React Flow)
// or complex SVG/Canvas rendering for an actual interactive network.
// For this refactor, I'll provide a conceptual static representation using Tailwind CSS.

const TeamNetwork = () => {
  // Mock data for team members/nodes. In a real scenario, positions would be calculated.
  const teamNodes = [
    {
      id: 1,
      name: "CEO",
      image: "/assets/images/team/ceo.jpg",
      position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      size: "w-24 h-24 md:w-32 md:h-32",
      isCenter: true,
    },
    {
      id: 2,
      name: "Creative",
      image: "/assets/images/team/cco.jpg",
      position: "top-1/4 left-1/4",
      size: "w-16 h-16 md:w-20 md:h-20",
    },
    {
      id: 3,
      name: "Operations",
      image: "/assets/images/team/coo.jpg",
      position: "top-1/4 right-1/4",
      size: "w-16 h-16 md:w-20 md:h-20",
    },
    {
      id: 4,
      name: "Marketing",
      image: "/assets/images/team/cmo.jpg",
      position: "bottom-1/4 left-1/4",
      size: "w-16 h-16 md:w-20 md:h-20",
    },
    {
      id: 5,
      name: "Finance",
      image: "/assets/images/team/cfo.jpg",
      position: "bottom-1/4 right-1/4",
      size: "w-16 h-16 md:w-20 md:h-20",
    },
    {
      id: 6,
      name: "Tech Lead",
      image: "/assets/images/team/member1.jpg",
      position: "top-1/2 left-1/4 -translate-y-1/2",
      size: "w-12 h-12 md:w-16 md:h-16",
    },
    {
      id: 7,
      name: "HR Manager",
      image: "/assets/images/team/member2.jpg",
      position: "top-1/2 right-1/4 -translate-y-1/2",
      size: "w-12 h-12 md:w-16 md:h-16",
    },
  ];

  return (
    <section className="team-network-section py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Interconnected Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            MyaCorp thrives on collaboration. Our diverse teams work in synergy,
            connecting various expertise to drive innovation and success in the
            fashion world.
          </p>
        </div>

        {/* Conceptual Network Visualization */}
        {/* This is a simplified static representation. A real network graph is complex. */}
        <div className="relative w-full max-w-3xl mx-auto aspect-square bg-white rounded-full shadow-2xl border-8 border-blue-100">
          {/* Lines (Conceptual - would be dynamic in a real graph) */}
          {/* Example line from center to one node */}
          <svg
            className="absolute inset-0 w-full h-full opacity-30"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {teamNodes
              .filter((n) => !n.isCenter)
              .map((node) => (
                <line
                  key={`line-${node.id}`}
                  x1="50"
                  y1="50"
                  x2={parseFloat(
                    node.position
                      .match(/left-([0-9\/]+)/)?.[1]
                      .split("/")
                      .reduce((a, b) => a / b) * 100 || 50
                  )}
                  y2={parseFloat(
                    node.position
                      .match(/top-([0-9\/]+)/)?.[1]
                      .split("/")
                      .reduce((a, b) => a / b) * 100 || 50
                  )}
                  stroke="#93c5fd"
                  strokeWidth="0.5"
                />
              ))}
          </svg>

          {teamNodes.map((node) => (
            <div
              key={node.id}
              className={`absolute rounded-full shadow-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 group ${
                node.position
              } ${node.size} ${
                node.isCenter
                  ? "border-4 border-blue-500 z-10"
                  : "border-2 border-blue-300"
              }`}
              style={{
                // For a real graph, top/left would be calculated dynamically
                // This static positioning is very basic.
                transform: node.isCenter
                  ? "translate(-50%, -50%)"
                  : node.position.includes("translate")
                  ? node.position
                      .split(" ")
                      .find((s) => s.startsWith("translate"))
                  : "",
              }}
            >
              <img
                src={node.image}
                alt={node.name}
                className="w-full h-full rounded-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-300">
                <span className="text-white text-xs md:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 bg-black/30 rounded">
                  {node.name}
                </span>
              </div>
            </div>
          ))}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <FontAwesomeIcon
              icon="users"
              className="text-6xl md:text-8xl text-blue-200 opacity-50"
            />
          </div>
        </div>
        <p className="text-center text-gray-500 mt-10 text-sm">
          This is a conceptual representation of our collaborative network.
        </p>
      </div>
    </section>
  );
};

export default TeamNetwork;
