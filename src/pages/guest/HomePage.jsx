// src/pages/guest/HomePage.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { JobsContext } from "../../contexts/JobsContext"; // Assuming JobsContext provides latest jobs
import LoadingSpinner from "../../components/common/LoadingSpinner";
import JobCard from "../../components/jobs/JobCard"; // Assuming JobCard is updated
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Mock components if they are not yet refactored or if you want to keep HomePage simple for now
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
    if (searchParams.keyword) query.append("keyword", searchParams.keyword);
    if (searchParams.location) query.append("location", searchParams.location);
    if (searchParams.category) query.append("category", searchParams.category);
    navigate(`/jobs?${query.toString()}`);
  };

  return (
    <section className="hero-section bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Find Your Dream Job in Fashion
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Explore thousands of opportunities from top fashion companies and
          brands. Your next career move starts here.
        </p>
        <form
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <FontAwesomeIcon
                icon="search"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="keyword"
                placeholder="Job title, keywords..."
                value={searchParams.keyword}
                onChange={handleInputChange}
                className="w-full p-3 pl-12 border border-transparent rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent text-gray-800 placeholder-gray-500"
              />
            </div>
            <div className="relative">
              <FontAwesomeIcon
                icon="location-dot"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="location"
                placeholder="Location (e.g., HCM)"
                value={searchParams.location}
                onChange={handleInputChange}
                className="w-full p-3 pl-12 border border-transparent rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent text-gray-800 placeholder-gray-500"
              />
            </div>
            <div className="relative">
              <FontAwesomeIcon
                icon="briefcase"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                name="category"
                value={searchParams.category}
                onChange={handleInputChange}
                className="w-full p-3 pl-12 pr-8 border border-transparent rounded-lg appearance-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-gray-800 bg-white"
              >
                <option value="">All Categories</option>
                <option value="design">Fashion Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="production">Production</option>
              </select>
              <FontAwesomeIcon
                icon="chevron-down"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors duration-200 shadow-md text-lg"
          >
            Search Jobs
          </button>
        </form>
      </div>
    </section>
  );
};

const WhyJoinUs = () => (
  <section className="py-16 md:py-24 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
        Why Join MyaCorp?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            icon: "handshake",
            title: "Collaborative Culture",
            description:
              "Work with talented professionals in a creative and positive environment.",
          },
          {
            icon: "chart-line",
            title: "Professional Growth",
            description:
              "Develop your skills through training and advancement opportunities.",
          },
          {
            icon: "lightbulb",
            title: "Innovation at Scale",
            description:
              "Be part of a forward-thinking company that embraces new ideas.",
          },
          {
            icon: "gift",
            title: "Competitive Benefits",
            description:
              "Enjoy comprehensive benefits and generous vacation time.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300"
          >
            <FontAwesomeIcon
              icon={item.icon}
              className="text-4xl text-blue-600 mb-6"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const StepsToGetJob = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
        Only 3 Steps to Get Your Dream Job!
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Dashed line connector for larger screens */}
        <div
          className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 border-dashed border-gray-400"
          style={{
            transform: "translateY(-50%)",
            zIndex: -1,
            width: "calc(100% - 10rem)",
            margin: "0 5rem",
          }}
        ></div>
        {[
          {
            number: 1,
            icon: "search",
            title: "Search for Job",
            description:
              "Browse our extensive catalog of fashion industry positions.",
          },
          {
            number: 2,
            icon: "file-alt",
            title: "Submit Your CV",
            description:
              "Complete our simple application process and upload your resume.",
          },
          {
            number: 3,
            icon: "check-circle",
            title: "Get Hired",
            description:
              "Interview with our team and start your journey with us.",
          },
        ].map((step) => (
          <div
            key={step.number}
            className="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-100 z-10"
          >
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                {step.number}
              </div>
              <FontAwesomeIcon
                icon={step.icon}
                className="absolute -top-3 -right-3 text-3xl text-yellow-400 bg-white p-1 rounded-full shadow"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {step.title}
            </h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link
          to="/jobs"
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md text-lg"
        >
          Browse Open Positions
        </Link>
      </div>
    </div>
  </section>
);

const EmployeeReviews = () => {
  // Mock reviews
  const reviews = [
    {
      id: 1,
      quote: "MyaCorp has an amazing culture. I've grown so much here!",
      author: "Jane D.",
      position: "Lead Designer",
      avatar: "/assets/images/team/employee-1.jpg",
    },
    {
      id: 2,
      quote: "The opportunities for learning and development are fantastic.",
      author: "John S.",
      position: "Marketing Manager",
      avatar: "/assets/images/team/employee-2.jpg",
    },
    {
      id: 3,
      quote: "A truly supportive and innovative place to work.",
      author: "Alice B.",
      position: "Product Developer",
      avatar: "/assets/images/team/employee-3.jpg",
    },
  ];
  const [currentReview, setCurrentReview] = useState(0);

  const nextReview = () =>
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  const prevReview = () =>
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
          What Our Employees Say
        </h2>
        <div className="relative max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-xl">
          <div className="text-center">
            <img
              src={reviews[currentReview].avatar}
              alt={reviews[currentReview].author}
              className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-blue-200"
            />
            <p className="text-lg italic text-gray-700 mb-6">
              "{reviews[currentReview].quote}"
            </p>
            <h4 className="font-semibold text-gray-800">
              {reviews[currentReview].author}
            </h4>
            <p className="text-sm text-gray-500">
              {reviews[currentReview].position}
            </p>
          </div>
          <button
            onClick={prevReview}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors text-blue-600"
          >
            <FontAwesomeIcon icon="chevron-left" />
          </button>
          <button
            onClick={nextReview}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors text-blue-600"
          >
            <FontAwesomeIcon icon="chevron-right" />
          </button>
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const {
    jobs,
    loading: jobsLoading,
    error: jobsError,
  } = useContext(JobsContext);
  const [latestJobs, setLatestJobs] = useState([]);

  useEffect(() => {
    if (!jobsLoading && jobs && jobs.length > 0) {
      // Get latest 4 active jobs, sorted by postedDate descending
      const sortedActiveJobs = jobs
        .filter((job) => job.status === "ACTIVE" || !job.status) // Assuming active if no status or status is ACTIVE
        .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
        .slice(0, 4);
      setLatestJobs(sortedActiveJobs);
    }
  }, [jobs, jobsLoading]);

  return (
    <div className="home-page">
      <HeroBanner />

      <section className="latest-jobs-section py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Latest Job Openings
            </h2>
            <Link
              to="/jobs"
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              View All <FontAwesomeIcon icon="arrow-right" size="sm" />
            </Link>
          </div>

          {jobsLoading && <LoadingSpinner />}
          {jobsError && <p className="text-red-500 text-center">{jobsError}</p>}
          {!jobsLoading && !jobsError && latestJobs.length === 0 && (
            <p className="text-gray-600 text-center">
              No recent job openings found.
            </p>
          )}
          {!jobsLoading && !jobsError && latestJobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      <WhyJoinUs />
      <StepsToGetJob />
      <EmployeeReviews />
    </div>
  );
};

export default HomePage;
