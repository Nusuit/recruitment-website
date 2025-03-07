// src/pages/client/About.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaLightbulb, FaRocket, FaHandshake, FaBriefcase, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const About = () => {
  // Company details - replace with your company's information
  const companyName = "MyaCorp";
  const foundedYear = 2010;
  const employeeCount = "500+";
  const headquarters = "San Francisco, CA";
  const mission = "To create innovative technology solutions that empower people and organizations to achieve more.";
  
  // Company values
  const companyValues = [
    {
      icon: <FaUsers className="h-8 w-8 text-blue-500" />,
      title: "Customer Focus",
      description: "We put our customers at the center of everything we do, constantly seeking to understand their needs and exceed their expectations."
    },
    {
      icon: <FaLightbulb className="h-8 w-8 text-blue-500" />,
      title: "Innovation",
      description: "We foster a culture of creativity and continuous learning, encouraging bold ideas and thoughtful risk-taking."
    },
    {
      icon: <FaRocket className="h-8 w-8 text-blue-500" />,
      title: "Excellence",
      description: "We strive for excellence in all aspects of our work, maintaining high standards and delivering quality in everything we do."
    },
    {
      icon: <FaHandshake className="h-8 w-8 text-blue-500" />,
      title: "Integrity",
      description: "We act with honesty, transparency, and ethical behavior in all our interactions and business practices."
    }
  ];

  // Leadership team data
  const leadershipTeam = [
    {
      name: "John Smith",
      title: "Chief Executive Officer",
      bio: "With over 20 years of experience in the tech industry, John has led TechCorp through significant growth and innovation.",
      image: "/images/leadership/john-smith.jpg"
    },
    {
      name: "Sarah Johnson",
      title: "Chief Technology Officer",
      bio: "Sarah brings extensive expertise in software development and technology strategy to drive our product innovation.",
      image: "/images/leadership/sarah-johnson.jpg"
    },
    {
      name: "Michael Chen",
      title: "Chief Operations Officer",
      bio: "Michael oversees our global operations, ensuring efficiency and excellence in all we do.",
      image: "/images/leadership/michael-chen.jpg"
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About {companyName}</h1>
            <p className="text-xl mb-6">
              {mission}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
                <p className="text-sm uppercase tracking-wider">Founded</p>
                <p className="text-2xl font-bold">{foundedYear}</p>
              </div>
              <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
                <p className="text-sm uppercase tracking-wider">Employees</p>
                <p className="text-2xl font-bold">{employeeCount}</p>
              </div>
              <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
                <p className="text-sm uppercase tracking-wider">Headquarters</p>
                <p className="text-2xl font-bold">{headquarters}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Story */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="prose prose-lg">
            <p>
              Founded in {foundedYear}, {companyName} began with a simple idea: technology should make life better for everyone, everywhere. What started as a small team of passionate innovators has grown into a global company dedicated to creating solutions that empower people and organizations.
            </p>
            <p>
              Over the years, we've expanded our product offerings, but our core mission remains the same. We believe in building technology that adapts to how people work and live, helping them be more creative, productive, and connected.
            </p>
            <p>
              Today, with offices around the world and a team of {employeeCount} talented employees, we continue to push the boundaries of what's possible, always guided by our commitment to our customers and our core values.
            </p>
          </div>
        </div>
      </div>

      {/* Company Values */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide our decisions, shape our culture, and define who we are as a company.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {companyValues.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="mr-4">{value.icon}</div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                </div>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Leadership</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the talented executives who drive our vision forward and lead our teams to success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {leadershipTeam.map((leader, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-300">
                {leader.image ? (
                  <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100">
                    <span className="text-6xl font-bold text-blue-300">{leader.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{leader.name}</h3>
                <p className="text-blue-600 mb-3">{leader.title}</p>
                <p className="text-gray-600">{leader.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Careers Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="max-w-2xl mx-auto mb-8">
            We're always looking for talented individuals who share our values and passion for innovation. 
            Explore our open positions and find your place at {companyName}.
          </p>
          <Link to="/careers" className="inline-block bg-white text-blue-600 font-bold py-3 px-6 rounded-md hover:bg-gray-100 transition duration-300">
            <FaBriefcase className="inline mr-2" /> View Open Positions
          </Link>
        </div>
      </div>

      {/* Contact Information */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FaMapMarkerAlt className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Visit Us</h3>
              <p className="text-gray-600">
                123 Tech Boulevard<br />
                {headquarters}<br />
                94103
              </p>
            </div>
            <div className="text-center">
              <FaEnvelope className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Email Us</h3>
              <p className="text-gray-600">
                <a href="mailto:info@techcorp.com" className="text-blue-600 hover:underline">info@techcorp.com</a><br />
                <a href="mailto:careers@techcorp.com" className="text-blue-600 hover:underline">careers@techcorp.com</a>
              </p>
            </div>
            <div className="text-center">
              <FaPhone className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Call Us</h3>
              <p className="text-gray-600">
                +1 (800) 123-4567<br />
                Monday - Friday, 9am - 5pm PST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;