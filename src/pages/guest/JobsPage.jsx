import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import JobsContext from '../../contexts/JobsContext';
import JobList from '../../components/jobs/JobList';
import JobFilters from '../../components/jobs/JobFilters';
import Pagination from '../../components/common/Pagination';

const JobsPage = () => {
  const location = useLocation();
  const { jobs, loading, error, getJobs } = useContext(JobsContext);
  
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    category: '',
    experience: [],
    salary: [],
    jobType: [],
    education: [],
    jobLevel: []
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchError, setSearchError] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Parse query parameters on mount and when location changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    const newSearchParams = { ...searchParams };
    
    // Update search params from query parameters
    if (queryParams.has('keyword')) {
      newSearchParams.keyword = queryParams.get('keyword');
    }
    
    if (queryParams.has('location')) {
      newSearchParams.location = queryParams.get('location');
    }
    
    if (queryParams.has('category')) {
      newSearchParams.category = queryParams.get('category');
    }
    
    // You can add more query parameters handling here
    
    setSearchParams(newSearchParams);
  }, [location.search]);

  // Fetch jobs when search params or page changes
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      
      try {
        // Combine search params and pagination for API call
        const params = {
          ...searchParams,
          page: currentPage,
          limit: 10
        };
        
        // In a real app, you would call the API
        // const response = await getJobs(params);
        
        // For now, we'll filter the jobs from context
        const filteredResults = filterJobs(jobs, searchParams);
        
        // Calculate pagination
        const totalItems = filteredResults.length;
        const totalPages = Math.ceil(totalItems / 10);
        
        // Get jobs for current page
        const startIndex = (currentPage - 1) * 10;
        const pageJobs = filteredResults.slice(startIndex, startIndex + 10);
        
        setFilteredJobs(pageJobs);
        setTotalPages(totalPages);
        setSearchError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setSearchError('Failed to fetch jobs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      fetchJobs();
    }
  }, [searchParams, currentPage, jobs, loading]);

  // Filter jobs based on search parameters
  const filterJobs = (jobsList, filters) => {
    return jobsList.filter(job => {
      // Keyword search
      if (filters.keyword && 
          !job.title.toLowerCase().includes(filters.keyword.toLowerCase()) &&
          !job.company.toLowerCase().includes(filters.keyword.toLowerCase()) &&
          !job.description.toLowerCase().includes(filters.keyword.toLowerCase())) {
        return false;
      }
      
      // Location filter
      if (filters.location && 
          !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filters.category && job.category !== filters.category) {
        return false;
      }
      
      // Experience filter
      if (filters.experience.length > 0) {
        // Simplified experience matching
        const matchesExperience = filters.experience.some(exp => 
          job.experience.includes(exp.replace('_', '-')));
        if (!matchesExperience) return false;
      }
      
      // Salary filter
      if (filters.salary.length > 0) {
        // Simplified salary matching
        const jobSalaryMin = parseInt(job.salary.split('-')[0].replace(/\D/g, '').trim());
        const matchesSalary = filters.salary.some(sal => {
          const [min, max] = sal.split('-').map(s => parseInt(s.replace(/\D/g, '').trim()));
          return jobSalaryMin >= min && (!max || jobSalaryMin <= max);
        });
        if (!matchesSalary) return false;
      }
      
      // Job type filter
      if (filters.jobType.length > 0 && 
          !filters.jobType.includes(job.type)) {
        return false;
      }
      
      // Education filter
      if (filters.education.length > 0 && 
          !filters.education.includes(job.education)) {
        return false;
      }
      
      // Job level filter
      if (filters.jobLevel.length > 0) {
        // Simplified job level matching
        const level = job.title.includes('Manager') ? 'Expert Level' : 
                    job.title.includes('Coordinator') ? 'Entry Level' : 'Mid Level';
        if (!filters.jobLevel.includes(level)) return false;
      }
      
      return true;
    });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setSearchParams(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state from context
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  // Error state from context
  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="jobs-page">
      <div className="page-header">
        <h1>Explore Our Job Openings</h1>
        <p className="page-description">
          Browse our job listings and take the first step towards an exciting career with us
        </p>
      </div>
      
      <div className="search-bar">
        <div className="search-inputs">
          <div className="search-input">
            <input 
              type="text" 
              placeholder="Job title, Keywords..." 
              value={searchParams.keyword}
              onChange={(e) => setSearchParams({...searchParams, keyword: e.target.value})}
            />
          </div>
          <div className="search-input">
            <input 
              type="text" 
              placeholder="Location" 
              value={searchParams.location}
              onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
            />
          </div>
          <div className="search-input">
            <select 
              value={searchParams.category}
              onChange={(e) => setSearchParams({...searchParams, category: e.target.value})}
            >
              <option value="">Select Category</option>
              <option value="design">Fashion Design</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="production">Production</option>
              <option value="management">Management</option>
              <option value="retail">Retail</option>
            </select>
          </div>
        </div>
        <button 
          className="advanced-filter-btn"
          onClick={() => document.querySelector('.job-filters').classList.toggle('show')}
        >
          Advanced Filter
        </button>
        <button 
          className="search-btn"
          onClick={() => setCurrentPage(1)} // Refresh search results
        >
          Find Job
        </button>
      </div>
      
      <div className="job-search-content">
        <JobFilters 
          filters={searchParams}
          onFilterChange={handleFilterChange}
        />
        
        <div className="job-results">
          {isLoading ? (
            <div className="loading-indicator">Loading jobs...</div>
          ) : searchError ? (
            <div className="error-message">{searchError}</div>
          ) : filteredJobs.length === 0 ? (
            <div className="no-results">
              <p>No jobs match your search criteria. Try adjusting your filters.</p>
              <button onClick={() => handleFilterChange(initialFilters)}>Clear Filters</button>
            </div>
          ) : (
            <>
              <JobList jobs={filteredJobs} />
              
              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;