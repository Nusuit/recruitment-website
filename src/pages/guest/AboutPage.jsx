// src/pages/guest/AboutPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Mock components for About Page sections
const AboutHero = () => (
  <section className="about-hero py-20 md:py-32 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
    <div className="container mx-auto px-4 text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
        About MyaCorp
      </h1>
      <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
        We are a passionate team dedicated to revolutionizing the fashion
        industry through innovation, sustainability, and style.
      </p>
    </div>
  </section>
);

const MissionVision = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
          <FontAwesomeIcon
            icon="bullseye"
            className="text-5xl text-blue-600 mb-6"
          />
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            To inspire and empower individuals worldwide to confidently express
            their unique style through accessible, high-quality fashion that
            combines creativity, sustainability, and exceptional value.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
          <FontAwesomeIcon
            icon="eye"
            className="text-5xl text-purple-600 mb-6"
          />
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            To become a global leader in progressive retail, setting new
            standards for sustainable practices, digital innovation, and
            inclusive fashion, creating a more connected and beautiful world for
            all.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const CompanyCulture = () => (
  <section className="py-16 md:py-24 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Our Culture
        </h2>
        <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
          At MyaCorp, we foster a collaborative and energetic work environment
          where fresh ideas and creativity thrive.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: "users",
            title: "Collaboration",
            description:
              "Teamwork makes the dream work. We believe in supporting each other.",
          },
          {
            icon: "lightbulb",
            title: "Innovation",
            description: "Constantly seeking new ways to improve and create.",
          },
          {
            icon: "heart",
            title: "Inclusivity",
            description:
              "A diverse team brings diverse perspectives. Everyone is welcome.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300"
          >
            <FontAwesomeIcon
              icon={item.icon}
              className="text-4xl text-blue-500 mb-6"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const LeadershipTeam = () => {
  // Mock data
  const leaders = [
    { name: "David Chen", role: "CEO", image: "/assets/images/team/ceo.jpg" },
    {
      name: "Sarah Johnson",
      role: "Chief Creative Officer",
      image: "/assets/images/team/cco.jpg",
    },
    {
      name: "Michael Rodriguez",
      role: "COO",
      image: "/assets/images/team/coo.jpg",
    },
  ];
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
          Meet Our Leadership
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {leaders.map((leader) => (
            <div
              key={leader.name}
              className="bg-white rounded-xl shadow-lg overflow-hidden text-center group"
            >
              <img
                src={leader.image}
                alt={leader.name}
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {leader.name}
                </h3>
                <p className="text-blue-600 font-medium">{leader.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutPage = () => {
  return (
    <div className="about-page">
      <AboutHero />
      <MissionVision />
      <CompanyCulture />
      <LeadershipTeam />

      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Team?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
            We're always looking for passionate and talented individuals to help
            us shape the future of fashion.
          </p>
          <Link
            to="/jobs"
            className="px-10 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors duration-200 text-lg shadow-lg"
          >
            View Open Positions
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
