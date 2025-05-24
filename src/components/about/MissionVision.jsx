// src/components/about/MissionVision.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MissionVision = () => {
  // Giả sử CEO là Cristiano Ronaldo theo design
  const ceo = {
    name: "Cristiano", // Hoặc tên đầy đủ nếu có
    role: "Chief Executive Officer",
    image: "/assets/images/team/ceo-cristiano.png", // Đảm bảo bạn có ảnh này
    quote:
      "Our mission is to inspire self-expression and confidence through our innovative fashion designs, while promoting sustainable practices. We envision becoming a global leader in the fashion industry, recognized for creativity, quality, and a commitment to sustainability.",
  };

  // State để quản lý slide (nếu có nhiều CEO hoặc trích dẫn muốn hiển thị)
  // Hiện tại design chỉ có 1 CEO, nên không cần slider phức tạp
  // const [activeIndex, setActiveIndex] = useState(0);

  // const handlePrev = () => { /* Logic cho slider */ };
  // const handleNext = () => { /* Logic cho slider */ };

  return (
    <section className="mission-vision-section py-16 md:py-24 bg-gray-100">
      {" "}
      {/* Nền xám nhạt */}
      <div className="container mx-auto px-4">
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Phần ảnh CEO */}
            <div className="ceo-image-container relative">
              <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                <img
                  src={ceo.image}
                  alt={ceo.name}
                  className="w-full h-full object-cover"
                />
                {/* Lớp phủ màu teal theo design */}
                <div className="absolute inset-0 bg-teal-500 opacity-20 mix-blend-multiply"></div>
                {/* Đường viền teal bên trái và dưới */}
                <div className="absolute -left-3 -bottom-3 w-full h-full border-l-8 border-b-8 border-teal-500 rounded-lg z-[-1]"></div>
              </div>
            </div>

            {/* Phần Mission & Vision text */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Mission and Vision
              </h2>
              <blockquote className="mb-6">
                <p className="text-gray-600 text-md md:text-lg leading-relaxed italic">
                  "{ceo.quote}"
                </p>
              </blockquote>
              <div className="mt-4">
                <p className="font-semibold text-gray-800 text-lg">
                  {ceo.name}
                </p>
                <p className="text-sm text-teal-600">{ceo.role}</p>
              </div>

              {/* Các nút điều hướng slider (nếu có nhiều trích dẫn) - Hiện tại ẩn đi */}
              {/* <div className="flex justify-center md:justify-start space-x-3 mt-8">
                <button 
                  onClick={handlePrev} 
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition"
                  aria-label="Previous quote"
                >
                  <FontAwesomeIcon icon="arrow-left" />
                </button>
                <button 
                  onClick={handleNext} 
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition"
                  aria-label="Next quote"
                >
                  <FontAwesomeIcon icon="arrow-right" />
                </button>
              </div>
              */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
