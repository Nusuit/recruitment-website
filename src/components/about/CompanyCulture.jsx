// src/components/about/CompanyCulture.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CompanyCulture = () => {
  // Nội dung và icon có thể được tùy chỉnh thêm cho phù hợp
  const culturePoints = [
    {
      icon: "users-cog", // Icon tượng trưng cho sự hợp tác và cấu trúc
      title: "Collaborative & Inclusive",
      description:
        "We foster a collaborative and inclusive work environment where every team member's ideas are valued.",
    },
    {
      icon: "brain", // Icon tượng trưng cho sự sáng tạo
      title: "Creativity & Respect",
      description:
        "We believe in creativity, respect, and empowering our team to innovate.",
    },
    {
      icon: "chart-line", // Icon tượng trưng cho sự phát triển
      title: "Continuous Growth",
      description:
        "Dedicated to fostering an environment of continuous learning and professional development for all.",
    },
  ];

  return (
    <section className="company-culture-section py-16 md:py-24 bg-gray-50">
      {" "}
      {/* Nền xám nhạt */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Phần text bên trái */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Company Culture
            </h2>
            <p className="text-gray-600 text-md md:text-lg leading-relaxed mb-8">
              At SIUUUcorp, we foster a collaborative and inclusive work
              environment where every team member's ideas are valued. We believe
              in creativity, respect, and continuous growth.
            </p>
            {/* Bạn có thể thêm các điểm nhấn văn hóa ở đây nếu muốn, tương tự như WhyJoinUs */}
            {/* <div className="space-y-4">
              {culturePoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center mt-1">
                    <FontAwesomeIcon icon={point.icon} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">{point.title}</h4>
                    <p className="text-gray-500 text-sm">{point.description}</p>
                  </div>
                </div>
              ))}
            </div> */}
          </div>

          {/* Phần hình ảnh bên phải */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-md rounded-lg shadow-xl overflow-hidden group">
              <img
                src="/assets/images/company/company-culture-team.jpg" // Đảm bảo bạn có ảnh này
                alt="Company Culture - Team Collaboration"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              {/* <div className="absolute bottom-4 left-4 text-white">
                <h4 className="font-semibold text-lg">Team Spirit</h4>
                <p className="text-xs">Working together towards success.</p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyCulture;
