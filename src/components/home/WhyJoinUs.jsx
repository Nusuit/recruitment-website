// src/components/home/WhyJoinUs.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WhyJoinUs = () => {
  const benefits = [
    {
      icon: "users", // Replace with appropriate icon from design, e.g., 'file-alt' or 'clipboard-list'
      title: "Collaborative Culture",
      description:
        "Work with talented professionals in a supportive, creative team.",
    },
    {
      icon: "chart-line",
      title: "Professional Growth",
      description:
        "Ongoing learning, mentorship, and clear career growth paths.",
    },
    {
      icon: "balance-scale", // Replace with appropriate icon, e.g., 'handshake' or 'heart'
      title: "Work-Life Balance",
      description:
        "Flexible work, benefits, and wellness programs for your wellbeing.",
    },
  ];

  return (
    <section className="why-join-us-section py-16 md:py-24 bg-white">
      {" "}
      {/* Nền trắng theo design */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Phần hình ảnh bên trái */}
          <div className="flex justify-center md:justify-start">
            <img
              src="/assets/images/why-join-us-person.png" // Đảm bảo bạn có ảnh này hoặc thay thế
              alt="Professional working on laptop"
              className="rounded-lg shadow-xl max-w-md w-full object-cover"
              // Style để khớp với design hơn nếu cần, ví dụ:
              // style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 80% 100%, 0 100%)" }} // Ví dụ cắt góc
            />
          </div>

          {/* Phần text và các benefits bên phải */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Join SiuuuCorp?
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              We're building a workplace where innovative ideas thrive and
              talented individuals grow professionally.
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="benefit-item bg-blue-50 p-6 rounded-lg shadow-md flex items-start space-x-4 border-l-4 border-teal-500" // Nền xanh nhạt với viền teal
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={benefit.icon} className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyJoinUs;
