// src/components/home/StepsToGetJob.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StepsToGetJob = () => {
  const steps = [
    {
      number: 1,
      icon: "search", // FontAwesome icon name (solid)
      title: "Search for Your Dream Job",
      description:
        "Explore our diverse range of fashion industry positions. Use filters to narrow down your perfect match.",
    },
    {
      number: 2,
      icon: "file-signature", // FontAwesome icon name
      title: "Apply with Your CV",
      description:
        "Our streamlined application process makes it easy to submit your resume and cover letter in minutes.",
    },
    {
      number: 3,
      icon: "handshake", // FontAwesome icon name
      title: "Interview & Get Hired",
      description:
        "Connect with top employers, showcase your skills, and embark on your exciting new career path.",
    },
  ];

  return (
    <section className="steps-section py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Your Journey to a Fashion Career
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to land your dream job in the vibrant
            world of fashion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 relative">
          {/* Dashed line connector for larger screens - improved */}
          <div
            className="hidden md:block absolute top-1/2 left-0 right-0 h-px -mt-4"
            style={{ zIndex: 0 }}
          >
            <svg width="100%" height="8px" className="overflow-visible">
              <line
                x1="12%"
                y1="4"
                x2="88%"
                y2="4"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeDasharray="8, 8"
              />
            </svg>
          </div>

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="step-card bg-white p-8 rounded-xl shadow-xl text-center border border-gray-100 relative z-10 flex flex-col items-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                  {step.number}
                </div>
                <div className="absolute -top-3 -right-3 bg-yellow-400 p-3 rounded-full shadow-md">
                  <FontAwesomeIcon
                    icon={step.icon}
                    className="text-xl text-gray-800"
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 md:mt-16">
          <Link
            to="/jobs"
            className="px-10 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg text-lg inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon="briefcase" />
            Browse All Open Positions
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StepsToGetJob;
