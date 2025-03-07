// src/pages/client/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaUsers, FaBuilding, FaArrowRight, FaCalendarAlt, FaUserAlt } from 'react-icons/fa';

const Home = () => {
  // Company details
  const companyName = "MyaCorp";
  const companySlogan = "Building the future, one line of code at a time";
  
  // Mock blog posts about company culture and events
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "Our Annual Hackathon: Innovation at its Best",
      excerpt: "Last month, we held our annual hackathon where over 120 employees collaborated on 30 projects across 48 hours. See the winning projects and how they're being implemented.",
      image: null, // In a real app, this would be an image path
      author: "Sarah Johnson, VP of Engineering",
      date: "2023-05-15",
      category: "Events"
    },
    {
      id: 2,
      title: "Life at TechCorp: Engineering Team Spotlight",
      excerpt: "Our engineering team combines cutting-edge technology with a collaborative culture. Learn about their daily routines, challenges, and what makes working here special.",
      image: null,
      author: "Michael Chen, Engineering Director",
      date: "2023-05-03",
      category: "Team Spotlight"
    },
    {
      id: 3,
      title: "TechCorp Named One of the Best Places to Work in 2023",
      excerpt: "We're proud to announce that TechCorp has been recognized as one of the top tech employers this year. Learn what makes our workplace culture stand out.",
      image: null,
      author: "Emily Rodriguez, HR Director",
      date: "2023-04-28",
      category: "Company News"
    }
  ]);
  
  // Departments/Teams at the company
  const departments = [
    { id: 1, name: "Engineering", jobCount: 12, icon: <FaBuilding className="h-6 w-6 text-blue-600" /> },
    { id: 2, name: "Product Management", jobCount: 5, icon: <FaBriefcase className="h-6 w-6 text-green-600" /> },
    { id: 3, name: "Marketing", jobCount: 4, icon: <FaUsers className="h-6 w-6 text-purple-600" /> },
    { id: 4, name: "Customer Support", jobCount: 6, icon: <FaUsers className="h-6 w-6 text-orange-600" /> }
  ];

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Alert for job finding when component mounts
  useEffect(() => {
    const hasShownAlert = sessionStorage.getItem('jobAlertShown');
    
    if (!hasShownAlert) {
      setTimeout(() => {
        alert("Looking for open positions? Check out our Jobs page to find your next opportunity at " + companyName + "!");
        sessionStorage.setItem('jobAlertShown', 'true');
      }, 3000);
    }
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team at {companyName}</h1>
            <p className="text-xl mb-8">
              {companySlogan}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/jobs" className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium">
                View Open Positions
              </Link>
              <Link to="/about" className="bg-transparent border border-white text-white hover:bg-blue-700 px-6 py-3 rounded-md font-medium">
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Join {companyName}?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're building a workplace where innovative ideas thrive and talented individuals grow professionally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Collaborative Culture</h3>
            <p className="text-gray-600">
              Work alongside talented professionals in a supportive environment that values teamwork and creativity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <FaBriefcase className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Professional Growth</h3>
            <p className="text-gray-600">
              Continuous learning opportunities, mentorship programs, and clear career advancement paths.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <FaBuilding className="text-purple-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Work-Life Balance</h3>
            <p className="text-gray-600">
              Flexible work arrangements, comprehensive benefits, and wellness programs to support your wellbeing.
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/jobs" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            Explore Current Opportunities <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Departments Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Departments</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect fit for your skills and interests in one of our specialized teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((department) => (
              <Link 
                key={department.id} 
                to={`/jobs?department=${department.name}`} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    {department.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 ml-3">{department.name}</h3>
                </div>
                <p className="text-gray-600 mb-3">{department.jobCount} open positions</p>
                <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Jobs →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Blog/Company Culture Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Life at {companyName}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get to know our culture, events, and the people who make our company special.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <FaBuilding className="text-gray-400 text-5xl" />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500 ml-2 flex items-center">
                    <FaCalendarAlt className="mr-1" /> {formatDate(post.date)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FaUserAlt className="mr-1" />
                  <span>{post.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            Read More Articles <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Team?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover exciting opportunities to grow your career and make an impact with us.
          </p>
          <Link to="/jobs" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-md font-bold text-lg inline-block">
            Explore Open Positions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;