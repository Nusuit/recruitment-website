// src/components/home/HeroBanner.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Đảm bảo Button component của bạn đã được cập nhật và có thể nhận các props như variant, size, etc.
// import Button from "../common/Button";

const HeroBanner = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    location: "", // Trong design không có location, nhưng giữ lại nếu bạn muốn thêm sau
    department: "", // Thay category bằng department theo design
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.keyword)
      query.append("keyword", searchParams.keyword.trim());
    if (searchParams.department)
      query.append("department", searchParams.department);
    // if (searchParams.location) query.append("location", searchParams.location.trim()); // Nếu muốn thêm location
    navigate(`/jobs?${query.toString()}`);
  };

  // Danh sách các department mẫu, bạn có thể lấy từ API hoặc config
  const departments = [
    "All Departments",
    "Sales",
    "Fashion Design",
    "Store Management",
    "Marketing",
    "UI/UX",
    "Production",
    // Thêm các department khác nếu cần
  ];

  const mostSearchedJobs = [
    "Sales Associate",
    "Fashion Designer",
    "Store Manager",
    "Fashion Marketing Specialist",
  ];

  return (
    <section className="hero-section bg-gradient-to-r from-white via-gray-50 to-gray-100 py-12 md:py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 leading-tight">
              <span className="text-teal-500">SIUUUcorp</span>{" "}
              {/* Tên công ty theo design */}
            </h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              Step into the Fashion World
              <br />
              Join Our Creative Team
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto md:mx-0">
              Here you can find your best job. Explore jobs with our company.
              Ready for your next adventure?
            </p>

            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 mb-6"
            >
              <div className="flex-grow relative">
                <FontAwesomeIcon
                  icon="search" // Sử dụng icon search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="keyword"
                  placeholder="Job Title or Keyword"
                  value={searchParams.keyword}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                />
              </div>
              <div className="relative sm:w-auto">
                <select
                  name="department"
                  value={searchParams.department}
                  onChange={handleInputChange}
                  className="w-full sm:w-auto p-3 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm bg-white"
                >
                  {departments.map((dept) => (
                    <option
                      key={dept}
                      value={dept === "All Departments" ? "" : dept}
                    >
                      {dept}
                    </option>
                  ))}
                </select>
                <FontAwesomeIcon
                  icon="chevron-down"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors duration-200 shadow-md"
              >
                Search
              </button>
            </form>

            <div>
              <p className="text-sm text-gray-500 mb-2">Most Searched Jobs:</p>
              <div className="flex flex-wrap gap-2">
                {mostSearchedJobs.map((job, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                    onClick={() => {
                      setSearchParams((prev) => ({ ...prev, keyword: job }));
                      // Optionally trigger search immediately:
                      // navigate(`/jobs?keyword=${encodeURIComponent(job)}`);
                    }}
                  >
                    {job}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="hidden md:flex justify-center items-center">
            {/* Thay thế bằng hình ảnh từ design của bạn */}
            {/* Ví dụ: <img src="/path/to/your/hero-image.png" alt="Fashion Professional" className="max-w-md lg:max-w-lg rounded-lg" /> */}
            {/* Dùng placeholder nếu chưa có ảnh */}
            <div className="w-full max-w-md lg:max-w-lg h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              {/* <span className="text-gray-500">Hero Image Placeholder</span> */}
              <img
                src="/assets/images/hero-banner-placeholder.png" // Đảm bảo bạn có ảnh này hoặc thay thế
                alt="Fashion Professional pointing"
                className="object-contain h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
