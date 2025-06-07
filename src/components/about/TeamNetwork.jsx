// src/components/about/TeamNetwork.jsx
import React from "react";

const TeamNetwork = () => {
  const teamMembers = [
    {
      id: "center",
      name: "Core Team",
      image: "/assets/images/avatars/avatar-4.png", // Center avatar
      size: "w-24 h-24 md:w-32 md:h-32",
      position: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    },
    // Inner Circle - 2 avatars
    {
      id: 3,
      name: "Designer 1",
      image: "/assets/images/avatars/avatar-3.png",
      size: "w-16 h-16 md:w-20 md:h-20",
      position: "absolute top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2",
    },
    {
      id: 5,
      name: "Operations",
      image: "/assets/images/avatars/avatar-5.png",
      size: "w-16 h-16 md:w-20 md:h-20",
      position: "absolute top-1/2 left-[65%] -translate-x-1/2 -translate-y-1/2",
    },
    // Outer Circle - 5 avatars
    {
      id: 1,
      name: "Designer",
      image: "/assets/images/avatars/avatar-1.png",
      size: "w-16 h-16 md:w-20 md:h-20",
      position: "absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2",
    },
    {
      id: 6,
      name: "Market",
      image: "/assets/images/avatars/avatar-6.png",
      size: "w-16 h-16 md:w-20 md:h-20",
      position: "absolute top-[30%] left-[80%] -translate-x-1/2 -translate-y-1/2",
    },
    {
      id: 8,
      name: "Sales Lead",
      image: "/assets/images/avatars/avatar-8.png",
      size: "w-16 h-16 md:w-20 md:h-20",
      position: "absolute top-[75%] left-[70%] -translate-x-1/2 -translate-y-1/2",
    },
    {
      id: 7,
      name: "Developer",
      image: "/assets/images/avatars/avatar-7.png",
      size: "w-16 h-16 md:w-20 md:h-20",
      position: "absolute top-[75%] left-[30%] -translate-x-1/2 -translate-y-1/2",
    },
    {
      id: 2,
      name: "Support",
      image: "/assets/images/avatars/avatar-2.png",
      size: "w-16 h-16 md:w-20 md:h-20",
      position: "absolute top-[30%] left-[20%] -translate-x-1/2 -translate-y-1/2",
    },
  ];

  return (
    <div className="team-network-visualization relative w-full max-w-lg mx-auto aspect-square bg-amber-50 rounded-full flex items-center justify-center">
      {/* Dotted Circles */}
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        {/* Outermost circle */}
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          stroke="#3b82f6" // Blue color
          strokeWidth="2"
          strokeDasharray="8 8"
          fill="none"
        />
        {/* Inner circle */}
        <circle
          cx="50%"
          cy="50%"
          r="25%"
          stroke="#3b82f6" // Blue color
          strokeWidth="2"
          strokeDasharray="8 8"
          fill="none"
        />
      </svg>

      {/* Team Members */}
      {teamMembers.map((member) => (
        <div
          key={member.id}
          className={`member-node ${member.size} ${member.position} rounded-full border-2 border-white flex items-center justify-center group cursor-pointer transition-transform hover:scale-110`}
          title={member.name}
        >
          <img
            src={member.image || "/assets/images/default-avatar.png"}
            alt={member.name}
            className="w-full h-full object-cover rounded-full"
          />
          <span className="absolute -bottom-5 text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-white px-1 rounded">
            {member.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TeamNetwork;
