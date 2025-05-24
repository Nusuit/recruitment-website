// src/components/about/MissionVision.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MissionVision = () => {
  const coreValues = [
    {
      icon: "lightbulb",
      title: "Creativity & Innovation",
      description:
        "We foster bold thinking and originality in every design and process.",
    },
    {
      icon: "leaf",
      title: "Sustainability Focus",
      description:
        "Committed to ethical sourcing, responsible production, and a greener future.",
    },
    {
      icon: "users",
      title: "Inclusivity & Diversity",
      description:
        "Celebrating all identities and creating fashion that empowers everyone.",
    },
    {
      icon: "award",
      title: "Excellence in Craft",
      description:
        "Striving for the highest quality in our products and customer experiences.",
    },
  ];

  return (
    <section className="mission-vision-section py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Mission Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 md:p-10 rounded-xl shadow-xl border border-blue-200 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center mb-6">
              <FontAwesomeIcon
                icon="bullseye"
                className="text-5xl text-blue-600 mr-5"
              />
              <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-md">
              To inspire and empower individuals worldwide to confidently
              express their unique style through accessible, high-quality
              fashion that combines creativity, sustainability, and exceptional
              value.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 md:p-10 rounded-xl shadow-xl border border-purple-200 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center mb-6">
              <FontAwesomeIcon
                icon="eye"
                className="text-5xl text-purple-600 mr-5"
              />
              <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-md">
              To be a global leader in progressive retail, setting new standards
              for sustainable practices, digital innovation, and inclusive
              fashion, creating a more connected and beautiful world for all.
            </p>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The principles that guide our actions and define who we are as a
            company.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((value, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-t-4 border-green-500"
            >
              <FontAwesomeIcon
                icon={value.icon}
                className="text-4xl text-green-600 mb-5"
              />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                {value.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
