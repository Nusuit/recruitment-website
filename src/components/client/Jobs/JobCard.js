// src/components/client/Jobs/JobCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaClock, FaHeart, FaRegHeart, FaBriefcase, FaDollarSign } from 'react-icons/fa';

const JobCard = ({ job, isSaved, onSaveToggle }) => {
  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format job type helper
  const formatJobType = (type) => {
    switch (type) {
      case 'full-time':
        return 'Full Time';
      case 'part-time':
        return 'Part Time';
      case 'contract':
        return 'Contract';
      case 'intern':
        return 'Internship';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between">
          <div className="flex-1">
            <div className="flex items-start">
              <div className="mr-4">
                {job.logo ? (
                  <img src={job.logo} alt="Company logo" className="w-12 h-12 object-contain" />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center">
                    <FaBuilding className="text-blue-500 text-xl" />
                  </div>
                )}
              </div>
              <div>
                <Link to={`/jobs/${job.id}`} className="block mb-1">
                  <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800">
                    {job.title}
                  </h2>
                </Link>
                <div className="text-sm text-gray-600">
                  <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-semibold mr-2">
                    {job.department}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center text-sm text-gray-600">
                <FaMapMarkerAlt className="mr-1 text-gray-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaBriefcase className="mr-1 text-gray-400" />
                <span>{formatJobType(job.employmentType)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaClock className="mr-1 text-gray-400" />
                <span>Posted: {formatDate(job.published)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaDollarSign className="mr-1 text-gray-400" />
                <span>{job.salary}</span>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-700">
              <p>{job.description.substring(0, 150)}...</p>
            </div>
          </div>
          
          <div className="ml-4 flex flex-col items-end">
            <button 
              onClick={() => onSaveToggle(job.id)} 
              className="text-gray-400 hover:text-blue-600 focus:outline-none"
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              {isSaved ? (
                <FaHeart className="h-6 w-6 text-blue-500" />
              ) : (
                <FaRegHeart className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Link 
            to={`/jobs/${job.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;