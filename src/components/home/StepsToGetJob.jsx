// src/components/home/StepsToGetJob.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StepsToGetJob = () => {
  const steps = [
    {
      number: 1,
      icon: "user-plus", // Icon cho đăng ký tài khoản
      title: "Register for an account",
      description:
        "Create your profile with us to start your journey. It's quick and easy!",
    },
    {
      number: 2,
      icon: "file-arrow-up", // Icon cho upload CV
      title: "Upload Your CV",
      description:
        "Showcase your skills and experience by uploading your most up-to-date CV.",
    },
    {
      number: 3,
      icon: "paper-plane", // Icon cho apply job
      title: "Apply For Job!",
      description:
        "Browse through numerous job openings and apply for the one that fits you best.",
    },
  ];

  return (
    <section className="steps-section py-16 md:py-24 bg-white">
      {" "}
      {/* Nền trắng theo design */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Only 3 Steps to Get Your Dream Job!
          </h2>
          {/* Optional: Add a subtitle if needed based on your overall content strategy */}
          {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to kickstart your career with SiuuuCorp.
          </p> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="step-card bg-teal-500 text-white p-8 rounded-xl shadow-xl text-center flex flex-col items-center transform hover:scale-105 transition-transform duration-300"
            >
              <div className="flex-shrink-0 w-16 h-16 mb-6 bg-white text-teal-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-md">
                {step.number}
              </div>
              <div className="mb-4">
                <FontAwesomeIcon
                  icon={step.icon}
                  className="text-4xl text-white" // Icon màu trắng trên nền teal
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-teal-100 leading-relaxed flex-grow">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Optional: Add a call to action button if it makes sense here */}
        {/* <div className="text-center mt-12 md:mt-16">
          <Link
            to="/signup" // Hoặc /jobs
            className="px-10 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-lg text-lg"
          >
            Get Started Now
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default StepsToGetJob;
