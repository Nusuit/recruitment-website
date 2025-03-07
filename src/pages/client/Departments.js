// src/pages/client/Departments.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaBriefcase, FaUsers, FaChartLine, FaLaptopCode, FaPaintBrush, FaHeadset, FaFileInvoiceDollar } from 'react-icons/fa';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from API
    setTimeout(() => {
      const mockDepartments = [
        {
          id: 1,
          name: "Engineering",
          description: "Build innovative solutions that power our products and shape the future of technology.",
          jobCount: 14,
          icon: <FaLaptopCode className="h-8 w-8 text-blue-500" />,
          color: "blue",
          teams: ["Frontend", "Backend", "DevOps", "Mobile", "QA"]
        },
        {
          id: 2,
          name: "Product Management",
          description: "Drive product strategy and execution across the entire product lifecycle.",
          jobCount: 5,
          icon: <FaChartLine className="h-8 w-8 text-green-500" />,
          color: "green",
          teams: ["Product Strategy", "User Experience", "Market Analysis"]
        },
        {
          id: 3,
          name: "Design",
          description: "Create engaging and innovative designs that inspire and connect with our users.",
          jobCount: 4,
          icon: <FaPaintBrush className="h-8 w-8 text-purple-500" />,
          color: "purple",
          teams: ["UX Design", "UI Design", "Brand Design"]
        },
        {
          id: 4,
          name: "Customer Support",
          description: "Provide exceptional customer service and support to our users.",
          jobCount: 6,
          icon: <FaHeadset className="h-8 w-8 text-orange-500" />,
          color: "orange",
          teams: ["Technical Support", "Customer Success", "Customer Education"]
        },
        {
          id: 5,
          name: "Marketing",
          description: "Build and execute marketing strategies to drive growth and build brand awareness.",
          jobCount: 3,
          icon: <FaUsers className="h-8 w-8 text-red-500" />,
          color: "red",
          teams: ["Content Marketing", "Growth Marketing", "Social Media"]
        },
        {
          id: 6,
          name: "Finance",
          description: "Manage our financial operations and ensure sustainable business growth.",
          jobCount: 2,
          icon: <FaFileInvoiceDollar className="h-8 w-8 text-indigo-500" />,
          color: "indigo",
          teams: ["Accounting", "Financial Planning", "Payroll"]
        },
        {
          id: 7,
          name: "Human Resources",
          description: "Support our company's growth by building and nurturing an exceptional team.",
          jobCount: 3,
          icon: <FaUsers className="h-8 w-8 text-teal-500" />,
          color: "teal",
          teams: ["Talent Acquisition", "Employee Experience", "People Operations"]
        },
        {
          id: 8,
          name: "Operations",
          description: "Ensure smooth and efficient operation of all business functions.",
          jobCount: 2,
          icon: <FaBuilding className="h-8 w-8 text-gray-500" />,
          color: "gray",
          teams: ["Business Operations", "Facilities", "IT"]
        }
      ];
      
      setDepartments(mockDepartments);
      setLoading(false);
    }, 500);
  }, []);

  const getBgColor = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-100';
      case 'green': return 'bg-green-100';
      case 'purple': return 'bg-purple-100';
      case 'orange': return 'bg-orange-100';
      case 'red': return 'bg-red-100';
      case 'indigo': return 'bg-indigo-100';
      case 'teal': return 'bg-teal-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Departments</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover the diverse teams that make our company successful. 
            Each department plays a crucial role in driving innovation and excellence.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className={`${getBgColor(dept.color)} p-6`}>
                  <div className="flex justify-between items-center mb-4">
                    <div className="bg-white rounded-full p-3 inline-flex">
                      {dept.icon}
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-blue-800">
                      <FaBriefcase className="mr-1" /> {dept.jobCount} open positions
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{dept.name}</h2>
                  <p className="text-gray-700">{dept.description}</p>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Teams</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dept.teams.map((team, idx) => (
                      <span key={idx} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                        {team}
                      </span>
                    ))}
                  </div>
                  
                  <Link 
                    to={`/jobs?department=${dept.name}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Open Positions
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;