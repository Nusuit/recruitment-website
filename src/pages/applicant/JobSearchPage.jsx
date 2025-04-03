import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobList from '../../components/jobs/JobList';
import JobFilters from '../../components/jobs/JobFilters';

const JobSearchPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    category: '',
    experience: [],
    salary: [],
    jobType: [],
    education: [],
    jobLevel: []
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sample job data (in a real app, this would come from an API)
  const sampleJobs = [
    {
      id: 1,
      title: 'Sales Manager',
      company: 'MyaCorp',
      location: 'HCM, Vietnam',
      type: 'Full Time',
      salary: '$2500 - $3000',
      experience: '3-5 Years',
      education: 'Bachelor Degree',
      postedDate: '2025-03-15',
      deadline: '2025-04-15',
      daysRemaining: 4
    },
    {
      id: 2,
      title: 'Sales Coordinator',
      company: 'MyaCorp',
      location: 'Hanoi, Vietnam',
      type: 'Full Time',
      salary: '$1800 - $2200',
      experience: '1-3 Years',
      education: 'Bachelor Degree',
      postedDate: '2025-03-20',
      deadline: '2025-04-20',
      daysRemaining: 9
    },
    {
      id: 3,
      title: 'Sales Manager',
      company: 'MyaCorp',
      location: 'HCM, Vietnam',
      type: 'Remote',
      salary: '$2000 - $2800',
      experience: '2-4 Years',
      education: 'Bachelor Degree',
      postedDate: '2025-03-25',
      deadline: '2025-04-25',
      daysRemaining: 14
    },
    {
      id: 4,
      title: 'Sales Coordinator',
      company: 'MyaCorp',
      location: 'HCM, Vietnam',
      type: 'Contract Based',
      salary: '$1500 - $2000',
      experience: '1-2 Years',
      education: 'High School',
      postedDate: '2025-03-10',
      deadline: '2025-04-10',
      daysRemaining: 2
    },
  ];

  // Fetch jobs (simulate API fetch)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // In a real app, this would be an API call with filters
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter jobs based on current filters
        const filteredJobs = filterJobs(sampleJobs, filters);
        
        setJobs(filteredJobs);
        setTotalPages(Math.ceil(filteredJobs.length / 10));
        setError(null);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters, page]);

  // Filter jobs based on selected filters
  const filterJobs = (jobList, filterCriteria) => {
    return jobList.filter(job => {
      // Keyword search (title, company)
      if (filterCriteria.keyword && 
          !job.title.toLowerCase().includes(filterCriteria.keyword.toLowerCase()) &&
          !job.company.toLowerCase().includes(filterCriteria.keyword.toLowerCase())) {
        return false;
      }
      
      // Location filter
      if (filterCriteria.location && 
          !job.location.toLowerCase().includes(filterCriteria.location.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filterCriteria.category && job.category !== filterCriteria.category) {
        return false;
      }
      
      // Experience filter
      if (filterCriteria.experience.length > 0) {
        // This is simplified - in a real app you'd parse the experience range
        const matchesExperience = filterCriteria.experience.some(exp => 
          job.experience.includes(exp.replace('_', '-')));
        if (!matchesExperience) return false;
      }
      
      // Salary filter
      if (filterCriteria.salary.length > 0) {
        // This is simplified - in a real app you'd parse the salary range
        const jobSalaryMin = parseInt(job.salary.split('-')[0].replace(/\$|,/g, '').trim());
        const matchesSalary = filterCriteria.salary.some(sal => {
          const [min, max] = sal.split('-').map(s => parseInt(s.replace(/\$|,|\+/g, '').trim()));
          return jobSalaryMin >= min && (!max || jobSalaryMin <= max);
        });
        if (!matchesSalary) return false;
      }
      
      // Job type filter
      if (filterCriteria.jobType.length > 0 && 
          !filterCriteria.jobType.includes(job.type)) {
        return false;
      }
      
      // Education filter
      if (filterCriteria.education.length > 0 && 
          !filterCriteria.education.includes(job.education)) {
        return false;
      }
      
      // Job level filter
      if (filterCriteria.jobLevel.length > 0) {
        // This is simplified - you'd need to map job titles to levels
        const level = job.title.includes('Manager') ? 'Expert Level' : 
                     job.title.includes('Coordinator') ? 'Entry Level' : 'Mid Level';
        if (!filterCriteria.jobLevel.includes(level)) return false;
      }
      
      return true;
    });
  };

  // Update filters
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      category: '',
      experience: [],
      salary: [],
      jobType: [],
      education: [],
      jobLevel: []
    });
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
  };

  return (
    <div className="job-search-page">
      <div className="page-header">
        <h1>Explore Our Job Openings</h1>
        <p>Browse our job listings and take the first step towards an exciting career with us</p>
      </div>
      
      <div className="search-bar">
        <div className="search-inputs">
          <div className="search-input">
            <input 
              type="text" 
              placeholder="Job title, Keywords..." 
              value={filters.keyword}
              onChange={(e) => setFilters({...filters, keyword: e.target.value})}
            />
          </div>
          <div className="search-input">
            <input 
              type="text" 
              placeholder="Location" 
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
          </div>
          <div className="search-input">
            <select 
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="">Select Category</option>
              <option value="design">Fashion Design</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="production">Production</option>
            </select>
          </div>
        </div>
        <button className="advanced-filter-btn">Advanced Filter</button>
        <button className="search-btn">Find Job</button>
      </div>
      
      <div className="job-search-content">
        <JobFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        
        <div className="job-results">
          {loading ? (
            <div className="loading-indicator">Loading jobs...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="no-results">
              <p>No jobs match your search criteria. Try adjusting your filters.</p>
              <button onClick={handleClearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <JobList jobs={jobs} />
              
              <div className="pagination">
                <button 
                  onClick={handlePrevPage} 
                  disabled={page === 1}
                  className="pagination-btn prev"
                >
                  &lt;
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageClick(i + 1)}
                    className={`pagination-btn ${page === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  onClick={handleNextPage} 
                  disabled={page === totalPages}
                  className="pagination-btn next"
                >
                  &gt;
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;