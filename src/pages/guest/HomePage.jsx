import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import LatestJobs from '../../components/home/LatestJobs';
import WhyJoinUs from '../../components/home/WhyJoinUs';
import StepsToGetJob from '../../components/home/StepsToGetJob';
import EmployeeReviews from '../../components/home/EmployeeReviews';

const HomePage = () => {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    category: '',
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to search results page with search parameters
    // This would use useNavigate in a real application
    console.log('Search with params:', searchParams);
  };

  return (
    <div className="home-page">
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
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="search-input-group">
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={searchParams.location}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="search-input-group">
                  <select
                    name="category"
                    value={searchParams.category}
                    onChange={handleSearchChange}
                  >
                    <option value="">Select Category</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="production">Production</option>
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

      <section className="latest-jobs-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Job open</h2>
            <Link to="/jobs" className="view-all-link">View all openings</Link>
          </div>
          <LatestJobs />
        </div>
      </section>

      <section className="why-join-section">
        <div className="container">
          <h2>Why Join SiuuuCorp?</h2>
          <WhyJoinUs />
        </div>
      </section>

      <section className="steps-section">
        <div className="container">
          <h2>Only 3 Steps to Get Your Dream Job!</h2>
          <StepsToGetJob />
        </div>
      </section>

      <section className="reviews-section">
        <div className="container">
          <h2>Employee Reviews</h2>
          <EmployeeReviews />
        </div>
      </section>
    </div>
  );
};

export default HomePage;