// src/pages/client/Jobs.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBriefcase, FaHeart, FaRegHeart, FaBuilding, FaMapMarkerAlt, FaFilter, FaSearch } from 'react-icons/fa';

const Jobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const departmentParam = queryParams.get('department');
  
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(departmentParam || 'All Departments');
  const [filters, setFilters] = useState({
    experience: '',
    jobType: '',
  });
  const [savedJobs, setSavedJobs] = useState([]);

  // Company departments
  const departments = [
    "All Departments",
    "Engineering",
    "Product Management",
    "Marketing",
    "Customer Support",
    "Human Resources",
    "Finance",
    "Operations"
  ];

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
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
      {
        id: 5,
        title: "Marketing Specialist",
        department: "Marketing",
        location: "Chicago, IL",
        employmentType: "full-time",
        salary: "$80,000 - $100,000",
        experience: "2-4 years",
        published: "2023-06-05",
        expires: "2023-07-05",
        description: "Drive digital marketing campaigns and strategies...",
        logo: null,
      },
      {
        id: 6,
        title: "Customer Success Manager",
        department: "Customer Support",
        location: "Remote",
        employmentType: "full-time",
        salary: "$85,000 - $105,000",
        experience: "3-5 years",
        published: "2023-06-06",
        expires: "2023-07-06",
        description: "Ensure customer satisfaction and drive retention...",
        logo: null,
      },
      {
        id: 7,
        title: "Mobile App Developer",
        department: "Engineering",
        location: "Seattle, WA",
        employmentType: "full-time",
        salary: "$110,000 - $140,000",
        experience: "2-4 years",
        published: "2023-06-07",
        expires: "2023-07-07",
        description: "Build mobile applications for iOS and Android platforms...",
        logo: null,
      },
      {
        id: 8,
        title: "HR Manager",
        department: "Human Resources",
        location: "Boston, MA",
        employmentType: "full-time",
        salary: "$90,000 - $120,000",
        experience: "5+ years",
        published: "2023-06-08",
        expires: "2023-07-08",
        description: "Oversee HR functions including recruitment and employee relations...",
        logo: null,
      },
    ];
    
    setJobs(mockJobs);
    
    // Get saved jobs from localStorage
    const savedJobsFromStorage = JSON.parse(localStorage.getItem('savedJobs')) || [];
    setSavedJobs(savedJobsFromStorage);
    
    // Apply initial filtering
    filterJobs(mockJobs, searchQuery, selectedDepartment, filters);
  }, []);

  // Update URL when department changes
  useEffect(() => {
    if (selectedDepartment && selectedDepartment !== 'All Departments') {
      navigate(`/jobs?department=${selectedDepartment}`);
    } else if (location.search && selectedDepartment === 'All Departments') {
      navigate('/jobs');
    }
    
    // Apply filtering when department changes
    filterJobs(jobs, searchQuery, selectedDepartment, filters);
  }, [selectedDepartment, navigate]);

  // Filter jobs based on search query, department, and other filters
  const filterJobs = (jobsList, query, department, filterCriteria) => {
    let results = [...jobsList];

    // Filter by search query
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(lowerCaseQuery) ||
          job.department.toLowerCase().includes(lowerCaseQuery) ||
          job.description.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Filter by department
    if (department && department !== 'All Departments') {
      results = results.filter((job) => job.department === department);
    }

    // Filter by experience
    if (filterCriteria.experience) {
      results = results.filter((job) => job.experience.includes(filterCriteria.experience));
    }

    // Filter by job type
    if (filterCriteria.jobType) {
      results = results.filter((job) => job.employmentType === filterCriteria.jobType);
    }

    setFilteredJobs(results);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterJobs(jobs, query, selectedDepartment, filters);
  };

  // Handle department selection
  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    filterJobs(jobs, searchQuery, selectedDepartment, newFilters);
  };

  // Handle job saving/unsaving
  const toggleSaveJob = (jobId) => {
    let updatedSavedJobs;
    
    if (savedJobs.includes(jobId)) {
      updatedSavedJobs = savedJobs.filter(id => id !== jobId);
    } else {
      updatedSavedJobs = [...savedJobs, jobId];
    }
    
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h1>
          <p className="text-gray-600">
            Discover opportunities to join our team and make an impact.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Positions</h2>
              
              {/* Department Filter */}
              <div className="mb-6">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Experience Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="exp-all"
                      name="experience"
                      type="radio"
                      checked={filters.experience === ''}
                      onChange={() => handleFilterChange('experience', '')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="exp-all" className="ml-2 block text-sm text-gray-700">
                      All Levels
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="exp-entry"
                      name="experience"
                      type="radio"
                      checked={filters.experience === '0-2'}
                      onChange={() => handleFilterChange('experience', '0-2')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="exp-entry" className="ml-2 block text-sm text-gray-700">
                      Entry Level (0-2 years)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="exp-mid"
                      name="experience"
                      type="radio"
                      checked={filters.experience === '3-5'}
                      onChange={() => handleFilterChange('experience', '3-5')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="exp-mid" className="ml-2 block text-sm text-gray-700">
                      Mid Level (3-5 years)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="exp-senior"
                      name="experience"
                      type="radio"
                      checked={filters.experience === '5+'}
                      onChange={() => handleFilterChange('experience', '5+')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="exp-senior" className="ml-2 block text-sm text-gray-700">
                      Senior Level (5+ years)
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Job Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="type-all"
                      name="jobType"
                      type="radio"
                      checked={filters.jobType === ''}
                      onChange={() => handleFilterChange('jobType', '')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="type-all" className="ml-2 block text-sm text-gray-700">
                      All Types
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="type-full"
                      name="jobType"
                      type="radio"
                      checked={filters.jobType === 'full-time'}
                      onChange={() => handleFilterChange('jobType', 'full-time')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="type-full" className="ml-2 block text-sm text-gray-700">
                      Full Time
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="type-part"
                      name="jobType"
                      type="radio"
                      checked={filters.jobType === 'part-time'}
                      onChange={() => handleFilterChange('jobType', 'part-time')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="type-part" className="ml-2 block text-sm text-gray-700">
                      Part Time
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="type-contract"
                      name="jobType"
                      type="radio"
                      checked={filters.jobType === 'contract'}
                      onChange={() => handleFilterChange('jobType', 'contract')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="type-contract" className="ml-2 block text-sm text-gray-700">
                      Contract
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSelectedDepartment('All Departments');
                  setSearchQuery('');
                  setFilters({ experience: '', jobType: '' });
                  filterJobs(jobs, '', 'All Departments', { experience: '', jobType: '' });
                }}
                className="w-full py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          {/* Job Listings */}
          <div className="lg:w-3/4">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search positions, departments, or keywords"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            {/* Results Count */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'Position' : 'Positions'} Found
                </h2>
                <div className="text-sm text-gray-500">
                  {selectedDepartment !== 'All Departments' && `Filtered by: ${selectedDepartment}`}
                </div>
              </div>
            </div>
            
            {/* Job List */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FaBriefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No positions found</h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search or filter criteria to find more opportunities.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <div className="flex items-start">
                            <div className="mr-4">
                              {job.logo ? (
                                <img src={job.logo} alt={job.company} className="w-12 h-12 object-contain" />
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
                              <span>
                                {job.employmentType === 'full-time'
                                  ? 'Full Time'
                                  : job.employmentType === 'part-time'
                                  ? 'Part Time'
                                  : job.employmentType === 'contract'
                                  ? 'Contract'
                                  : job.employmentType}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FaCalendarAlt className="mr-1 text-gray-400" />
                              <span>Posted:
                              {formatDate(job.published)}</span>
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
                            onClick={() => toggleSaveJob(job.id)} 
                            className="text-gray-400 hover:text-blue-600 focus:outline-none"
                            aria-label={savedJobs.includes(job.id) ? "Unsave job" : "Save job"}
                          >
                            {savedJobs.includes(job.id) ? (
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;