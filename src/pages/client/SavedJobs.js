// src/pages/client/SavedJobs.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaBriefcase, FaSadTear } from 'react-icons/fa';
import JobCard from '../../components/client/Jobs/JobCard';

const SavedJobs = () => {
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved job IDs from localStorage
  useEffect(() => {
    const savedFromStorage = JSON.parse(localStorage.getItem('savedJobs')) || [];
    setSavedJobIds(savedFromStorage);
    fetchSavedJobs(savedFromStorage);
  }, []);

  // Fetch job details for saved IDs
  const fetchSavedJobs = (ids) => {
    // In a real app, you would fetch these from an API
    // For demo purposes, we'll use mock data
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      const mockJobs = [
        {
          id: 1,
          title: "Senior Frontend Engineer",
          department: "Engineering",
          location: "New York, NY",
          employmentType: "full-time",
          salary: "$120,000 - $150,000",
          experience: "3-5 years",
          published: "2023-06-01",
          expires: "2023-07-01",
          description: "We're looking for an experienced Frontend Engineer to join our team...",
          logo: null,
        },
        {
          id: 2,
          title: "Backend Developer",
          department: "Engineering",
          location: "Remote",
          employmentType: "full-time",
          salary: "$110,000 - $140,000",
          experience: "3-5 years",
          published: "2023-06-02",
          expires: "2023-07-02",
          description: "Join our backend team to build scalable services...",
          logo: null,
        },
        {
          id: 3,
          title: "Product Manager",
          department: "Product Management",
          location: "San Francisco, CA",
          employmentType: "full-time",
          salary: "$130,000 - $160,000",
          experience: "4-6 years",
          published: "2023-06-03",
          expires: "2023-07-03",
          description: "Lead product development initiatives from conception to launch...",
          logo: null,
        },
        {
          id: 4,
          title: "DevOps Engineer",
          department: "Engineering",
          location: "Austin, TX",
          employmentType: "full-time",
          salary: "$115,000 - $145,000",
          experience: "3-5 years",
          published: "2023-06-04",
          expires: "2023-07-04",
          description: "Build and maintain our infrastructure and deployment pipelines...",
          logo: null,
        },
      ];
      
      // Filter to only include jobs that are in savedJobIds
      const filteredJobs = mockJobs.filter(job => ids.includes(job.id));
      setSavedJobs(filteredJobs);
      setLoading(false);
    }, 500);
  };

  // Handle removing a job from saved jobs
  const handleRemoveSavedJob = (jobId) => {
    const updatedSavedJobIds = savedJobIds.filter(id => id !== jobId);
    setSavedJobIds(updatedSavedJobIds);
    setSavedJobs(savedJobs.filter(job => job.id !== jobId));
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobIds));
  };

  // Handle clearing all saved jobs
  const handleClearAllSavedJobs = () => {
    if (window.confirm('Are you sure you want to remove all saved jobs?')) {
      setSavedJobIds([]);
      setSavedJobs([]);
      localStorage.setItem('savedJobs', JSON.stringify([]));
    }
  };

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
            <p className="text-gray-600">
              {savedJobs.length} {savedJobs.length === 1 ? 'position' : 'positions'} saved
            </p>
          </div>
          
          {savedJobs.length > 0 && (
            <button
              onClick={handleClearAllSavedJobs}
              className="text-red-600 hover:text-red-800 flex items-center"
            >
              <FaTrash className="mr-1" /> Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaSadTear className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No saved jobs</h3>
            <p className="mt-1 text-gray-500">
              You haven't saved any jobs yet. Browse our open positions and save the ones you're interested in.
            </p>
            <div className="mt-6">
              <Link
                to="/jobs"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaBriefcase className="mr-2" /> Browse Jobs
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {savedJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={true}
                onSaveToggle={handleRemoveSavedJob}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;