// src/pages/guest/HomePage.jsx
import React from "react";
import HeroBanner from "../../components/home/HeroBanner";
import LatestJobs from "../../components/home/LatestJobs";
import WhyJoinUs from "../../components/home/WhyJoinUs";
import StepsToGetJob from "../../components/home/StepsToGetJob";
import EmployeeReviews from "../../components/home/EmployeeReviews";

// Component HomePage chính
const HomePage = () => {
  return (
    <div className="home-page">
      {/* Phần Hero Banner - Ảnh 2 */}
      <HeroBanner />

      {/* P hần Latest Job Openings - Ảnh 2 */}
      <LatestJobs />

      {/* Phần Why Join SiuuuCorp? - Ảnh 3 */}
      <WhyJoinUs />

      {/* Phần Only 3 Steps to Get Your Dream Job! - Ảnh 3 */}
      <StepsToGetJob />

      {/* Phần Employee Reviews - Ảnh 3 */}
      <EmployeeReviews />
    </div>
  );
};

export default HomePage;
