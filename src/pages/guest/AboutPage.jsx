// src/pages/guest/AboutPage.jsx
import React from "react";
import AboutHero from "../../components/about/AboutHero";
import MissionVision from "../../components/about/MissionVision";
import CompanyCulture from "../../components/about/CompanyCulture";
import LeadershipTeam from "../../components/about/LeadershipTeam";
import TeamNetwork from "../../components/about/TeamNetwork"; // Component mới cho phần network
import { Link } from "react-router-dom"; // Import Link
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Phần Hero của trang About Us - Ảnh 9 */}
      <AboutHero />

      {/* Phần "About SIUUUcorp" và "Team Network" - Ảnh 9 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-6">
                {" "}
                {/* Màu cam cho tiêu đề */}
                About SIUUUcorp
              </h2>
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                We're highly skilled and professionals team.
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We are a leading fashion company that creates innovative
                clothing and accessories for individuals who value style and
                quality. Founded in 2015, we have expanded our reach globally
                and are committed to delivering exceptional designs to our
                customers.
              </p>
            </div>
            <div>
              {/* Component TeamNetwork sẽ được tạo riêng */}
              <TeamNetwork />
            </div>
          </div>
        </div>
      </section>

      {/* Phần Mission and Vision - Ảnh 9 */}
      <MissionVision />

      {/* Phần Company Culture - Ảnh 10 */}
      <CompanyCulture />

      {/* Phần Leadership Team - Ảnh 10 */}
      <LeadershipTeam />

      {/* Phần Call to Action cuối trang - Cập nhật theo image_1991f5.png và image_1a6c0e.png */}
      {/* Section cho text với dấu ngoặc */}
      <section className="cta-text-section bg-stone-100 py-12 md:py-16">
        {" "}
        {/* Nền màu be/kem nhạt */}
        <div className="container mx-auto px-4 text-center">
          <div className="relative inline-block max-w-3xl py-8">
            {" "}
            {/* Thêm padding cho div này để dấu ngoặc không quá sát */}
            {/* Dấu ngoặc trên bên trái */}
            <span
              className="absolute -top-2 -left-4 md:-top-0 md:-left-8 text-6xl md:text-7xl text-gray-300 font-serif opacity-70"
              aria-hidden="true"
            >
              Γ
            </span>
            <p className="text-xl md:text-2xl font-medium text-gray-700 leading-relaxed px-6 md:px-10">
              Ready to start your journey with us? Check out our current job
              openings and apply today!
            </p>
            {/* Dấu ngoặc dưới bên phải */}
            <span
              className="absolute -bottom-2 -right-4 md:-bottom-0 md:-right-8 text-6xl md:text-7xl text-gray-300 font-serif opacity-70"
              aria-hidden="true"
            >
              ⌟
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
