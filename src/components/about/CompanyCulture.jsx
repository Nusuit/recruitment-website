// src/components/about/CompanyCulture.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CompanyCulture = () => {
  const culturePoints = [
    {
      icon: "users",
      title: "Collaboration First",
      description:
        "We believe teamwork and open communication lead to the best outcomes.",
    },
    {
      icon: "lightbulb",
      title: "Continuous Innovation",
      description:
        "Encouraging creative thinking and embracing new ideas to stay ahead.",
    },
    {
      icon: "seedling",
      title: "Sustainability Driven",
      description:
        "Committed to ethical practices and reducing our environmental footprint.",
    },
    {
      icon: "hands-helping",
      title: "Supportive Environment",
      description:
        "Fostering a space where everyone feels valued, respected, and empowered.",
    },
    {
      icon: "chart-growth",
      title: "Growth Mindset",
      description:
        "Dedicated to learning, development, and personal & professional growth for all.",
    },
    {
      icon: "smile-beam",
      title: "Positive & Fun",
      description:
        "We work hard, but also believe in enjoying the journey and celebrating successes.",
    },
  ];

  const teamImages = [
    "/assets/images/company/team-1.jpg",
    "/assets/images/company/team-2.jpg",
    "/assets/images/company/team-3.jpg",
    "/assets/images/company/team-4.jpg",
  ];

  return (
    <section className="company-culture-section py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Vibrant Company Culture
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            At MyaCorp, we cultivate an environment where creativity,
            collaboration, and individual growth are at the forefront.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {culturePoints.map((point, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-l-4 border-blue-500"
            >
              <FontAwesomeIcon
                icon={point.icon}
                className="text-3xl text-blue-600 mb-5"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {point.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mb-12 md:mb-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Life at MyaCorp
          </h3>
          <p className="text-gray-600 max-w-xl mx-auto">
            Glimpses into our dynamic workspace and team events that foster
            connection and creativity.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {teamImages.map((image, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow-md aspect-w-1 aspect-h-1 group"
            >
              <img
                src={image}
                alt={`MyaCorp Team ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyCulture;
