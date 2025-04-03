import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroBanner = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    category: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build query string from search params
    const query = new URLSearchParams();
    
    if (searchParams.keyword) {
      query.append('keyword', searchParams.keyword);
    }
    
    if (searchParams.location) {
      query.append('location', searchParams.location);
    }
    
    if (searchParams.category) {
      query.append('category', searchParams.category);
    }
    
    // Navigate to jobs page with search params
    const queryString = query.toString();
    navigate(`/jobs${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Step into the Fashion World<br />
            Join Our Creative Team
          </h1>
          <p className="hero-subtitle">
            Find your dream job in the fashion industry. We offer a diverse range of opportunities
            that fit your skills and passion.
          </p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-inputs">
              <div className="search-input-group">
                <input
                  type="text"
                  name="keyword"
                  placeholder="Job title, Keywords..."
                  value={searchParams.keyword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="search-input-group">
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={searchParams.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="search-input-group">
                <select
                  name="category"
                  value={searchParams.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="production">Production</option>
                  <option value="management">Management</option>
                  <option value="retail">Retail</option>
                </select>
              </div>
            </div>
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>
        <div className="hero-image">
          <img 
            src="/assets/images/illustrations/fashion-professional.png" 
            alt="Fashion professional" 
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;