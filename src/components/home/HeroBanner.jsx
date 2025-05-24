// src/components/home/HeroBanner.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../common/Button"; // Assuming Button component is updated

const HeroBanner = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    location: "",
    category: "",
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
    if (searchParams.location)
      query.append("location", searchParams.location.trim());
    if (searchParams.category) query.append("category", searchParams.category);
    navigate(`/jobs?${query.toString()}`);
  };

  return (
    <section className="hero-section bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20 md:py-32 relative overflow-hidden">
      {/* Background elements for visual appeal */}
      <div className="absolute inset-0 opacity-10">
        {/* Example: Repeating pattern or abstract shapes */}
        {/* <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#smallGrid)" /></svg> */}
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          Find Your Next <span className="text-yellow-300">Fashion Career</span>
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Discover exciting opportunities from leading fashion houses and
          innovative brands. Your journey to a stylish career begins now.
        </p>

        <form
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg p-6 md:p-8 rounded-xl shadow-2xl border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {/* Keyword Input */}
            <div className="relative">
              <FontAwesomeIcon
                icon="search"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                name="keyword"
                placeholder="Job title, keywords..."
                value={searchParams.keyword}
                onChange={handleInputChange}
                className="w-full p-3.5 pl-12 border-0 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 placeholder-gray-500 bg-white/90 shadow-sm"
              />
            </div>
            {/* Location Input */}
            <div className="relative">
              <FontAwesomeIcon
                icon="location-dot"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                name="location"
                placeholder="City or 'Remote'"
                value={searchParams.location}
                onChange={handleInputChange}
                className="w-full p-3.5 pl-12 border-0 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 placeholder-gray-500 bg-white/90 shadow-sm"
              />
            </div>
            {/* Category Select */}
            <div className="relative">
              <FontAwesomeIcon
                icon="briefcase"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <select
                name="category"
                value={searchParams.category}
                onChange={handleInputChange}
                className="w-full p-3.5 pl-12 pr-10 border-0 rounded-lg appearance-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 bg-white/90 shadow-sm"
              >
                <option value="">All Categories</option>
                <option value="design">Fashion Design</option>
                <option value="marketing">Marketing & PR</option>
                <option value="sales">Sales & Retail</option>
                <option value="production">Production & Sourcing</option>
                <option value="merchandising">Merchandising</option>
                <option value="tech">Fashion Tech</option>
              </select>
              <FontAwesomeIcon
                icon="chevron-down"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full md:w-auto bg-yellow-400 hover:bg-yellow-500 text-gray-900 !border-transparent shadow-lg"
          >
            Search Jobs
          </Button>
        </form>
        <p className="text-xs text-blue-200 mt-6">
          Popular searches: Designer, Merchandiser, Marketing, Remote
        </p>
      </div>
    </section>
  );
};

export default HeroBanner;
