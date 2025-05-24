// src/components/home/WhyJoinUs.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WhyJoinUs = () => {
  const benefits = [
    {
      icon: "users", // FontAwesome icon name
      title: "Collaborative Culture",
      description:
        "Work alongside talented professionals in a creative, supportive, and positive team environment where your ideas are valued.",
    },
    {
      icon: "chart-line", // FontAwesome icon name
      title: "Career Growth & Development",
      description:
        "We invest in your future with ongoing training, mentorship programs, and clear pathways for advancement.",
    },
    {
      icon: "lightbulb", // FontAwesome icon name
      title: "Innovation & Impact",
      description:
        "Be part of a forward-thinking company that embraces cutting-edge technologies and sustainable practices in fashion.",
    },
    {
      icon: "gift", // FontAwesome icon name
      title: "Competitive Benefits Package",
      description:
        "Enjoy comprehensive health insurance, retirement plans, generous paid time off, and exclusive employee discounts.",
    },
  ];

  return (
    <section className="why-join-us-section py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Build Your Career with MyaCorp?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're more than just a fashion company. We're a community dedicated
            to growth, innovation, and making a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="benefit-card bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-blue-500"
            >
              <div className="mb-6">
                <FontAwesomeIcon
                  icon={benefit.icon}
                  className="text-5xl text-blue-600 p-4 bg-blue-100 rounded-full inline-block"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoinUs;
