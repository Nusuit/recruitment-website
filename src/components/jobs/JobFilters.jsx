import React from 'react';

const JobFilters = ({ filters, onFilterChange, onClearFilters }) => {
  // Handle checkbox filters (experience, salary, etc)
  const handleCheckboxChange = (filterType, value) => {
    const currentValues = [...filters[filterType]];
    
    if (currentValues.includes(value)) {
      // Remove if already selected
      const updatedValues = currentValues.filter(val => val !== value);
      updateFilter(filterType, updatedValues);
    } else {
      // Add if not selected
      updateFilter(filterType, [...currentValues, value]);
    }
  };
  
  // Update a single filter
  const updateFilter = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value
    });
  };
  
  return (
    <div className="job-filters">
      <div className="filter-section">
        <h3>Experience</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.experience.includes('Fresher')}
              onChange={() => handleCheckboxChange('experience', 'Fresher')} 
            />
            <span>Fresher</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.experience.includes('0_1 Years')}
              onChange={() => handleCheckboxChange('experience', '0_1 Years')} 
            />
            <span>0-1 Years</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.experience.includes('1_3 Years')}
              onChange={() => handleCheckboxChange('experience', '1_3 Years')} 
            />
            <span>1-3 Years</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.experience.includes('3_5 Years')}
              onChange={() => handleCheckboxChange('experience', '3_5 Years')} 
            />
            <span>3-5 Years</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.experience.includes('5_8 Years')}
              onChange={() => handleCheckboxChange('experience', '5_8 Years')} 
            />
            <span>5-8 Years</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.experience.includes('8_10 Years')}
              onChange={() => handleCheckboxChange('experience', '8_10 Years')} 
            />
            <span>8-10 Years</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.experience.includes('10_15 Years')}
              onChange={() => handleCheckboxChange('experience', '10_15 Years')} 
            />
            <span>10-15 Years</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.experience.includes('15+ Years')}
              onChange={() => handleCheckboxChange('experience', '15+ Years')} 
            />
            <span>15+ Years</span>
          </label>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Salary</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.salary.includes('$0-$1000')}
              onChange={() => handleCheckboxChange('salary', '$0-$1000')} 
            />
            <span>$0 - $1000</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.salary.includes('$1000-$2000')}
              onChange={() => handleCheckboxChange('salary', '$1000-$2000')} 
            />
            <span>$1000 - $2000</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.salary.includes('$2000-$3000')}
              onChange={() => handleCheckboxChange('salary', '$2000-$3000')} 
            />
            <span>$2000 - $3000</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.salary.includes('$3000-$5000')}
              onChange={() => handleCheckboxChange('salary', '$3000-$5000')} 
            />
            <span>$3000 - $5000</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.salary.includes('$5000-$8000')}
              onChange={() => handleCheckboxChange('salary', '$5000-$8000')} 
            />
            <span>$5000 - $8000</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.salary.includes('$8000-$10000')}
              onChange={() => handleCheckboxChange('salary', '$8000-$10000')} 
            />
            <span>$8000 - $10000</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.salary.includes('$10000-$15000')}
              onChange={() => handleCheckboxChange('salary', '$10000-$15000')} 
            />
            <span>$10000 - $15000</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.salary.includes('$15000+')}
              onChange={() => handleCheckboxChange('salary', '$15000+')} 
            />
            <span>$15000+</span>
          </label>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Job Type</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.jobType.includes('All')}
              onChange={() => handleCheckboxChange('jobType', 'All')} 
            />
            <span>All</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.jobType.includes('Full Time')}
              onChange={() => handleCheckboxChange('jobType', 'Full Time')} 
            />
            <span>Full Time</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.jobType.includes('Part Time')}
              onChange={() => handleCheckboxChange('jobType', 'Part Time')} 
            />
            <span>Part Time</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.jobType.includes('Internship')}
              onChange={() => handleCheckboxChange('jobType', 'Internship')} 
            />
            <span>Internship</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.jobType.includes('Remote')}
              onChange={() => handleCheckboxChange('jobType', 'Remote')} 
            />
            <span>Remote</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.jobType.includes('Temporary')}
              onChange={() => handleCheckboxChange('jobType', 'Temporary')} 
            />
            <span>Temporary</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.jobType.includes('Contract Based')}
              onChange={() => handleCheckboxChange('jobType', 'Contract Based')} 
            />
            <span>Contract Based</span>
          </label>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Education</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.education.includes('All')}
              onChange={() => handleCheckboxChange('education', 'All')} 
            />
            <span>All</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.education.includes('High School')}
              onChange={() => handleCheckboxChange('education', 'High School')} 
            />
            <span>High School</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.education.includes('Intermediate')}
              onChange={() => handleCheckboxChange('education', 'Intermediate')} 
            />
            <span>Intermediate</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.education.includes('Graduate')}
              onChange={() => handleCheckboxChange('education', 'Graduate')} 
            />
            <span>Graduate</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.education.includes('Master Degree')}
              onChange={() => handleCheckboxChange('education', 'Master Degree')} 
            />
            <span>Master Degree</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.education.includes('Bachelor Degree')}
              onChange={() => handleCheckboxChange('education', 'Bachelor Degree')} 
            />
            <span>Bachelor Degree</span>
          </label>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Job Level</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.jobLevel.includes('All')}
              onChange={() => handleCheckboxChange('jobLevel', 'All')} 
            />
            <span>All</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.jobLevel.includes('Entry Level')}
              onChange={() => handleCheckboxChange('jobLevel', 'Entry Level')} 
            />
            <span>Entry Level</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.jobLevel.includes('Mid Level')}
              onChange={() => handleCheckboxChange('jobLevel', 'Mid Level')} 
            />
            <span>Mid Level</span>
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.jobLevel.includes('Expert Level')}
              onChange={() => handleCheckboxChange('jobLevel', 'Expert Level')} 
            />
            <span>Expert Level</span>
          </label>
        </div>
      </div>
      
      <button className="clear-filters-btn" onClick={onClearFilters}>
        Clear All Filters
      </button>
    </div>
  );
};

export default JobFilters;