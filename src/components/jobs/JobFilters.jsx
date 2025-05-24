// src/components/jobs/JobFilters.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Define filter options (can be fetched from API later)
const filterOptions = {
  experience: [
    { value: "0_1_Years", label: "0-1 Years" },
    { value: "1_3_Years", label: "1-3 Years" },
    { value: "3_5_Years", label: "3-5 Years" },
    { value: "5_Plus_Years", label: "5+ Years" },
  ],
  salary: [
    { value: "0-1000", label: "Up to $1000" },
    { value: "1000-2000", label: "$1000 - $2000" },
    { value: "2000-3000", label: "$2000 - $3000" },
    { value: "3000-5000", label: "$3000 - $5000" },
    { value: "5000+", label: "$5000+" },
  ],
  jobType: [
    { value: "Full Time", label: "Full Time" },
    { value: "Part Time", label: "Part Time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
  ],
  education: [
    { value: "High School", label: "High School" },
    { value: "Associate Degree", label: "Associate Degree" },
    { value: "Bachelor Degree", label: "Bachelor Degree" },
    { value: "Master Degree", label: "Master Degree" },
    { value: "PhD", label: "PhD" },
  ],
  jobLevel: [
    { value: "Intern", label: "Intern Level" },
    { value: "Junior", label: "Junior Level" },
    { value: "Mid", label: "Mid Level" },
    { value: "Senior", label: "Senior Level" },
    { value: "Manager", label: "Manager" },
    { value: "Director", label: "Director" },
  ],
};

const FilterSection = ({
  title,
  options,
  filterKey,
  selectedValues,
  onCheckboxChange,
}) => {
  const [isOpen, setIsOpen] = useState(true); // Default to open

  return (
    <div className="border-b border-gray-200 py-5">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-base font-semibold text-gray-800">{title}</h4>
        <FontAwesomeIcon
          icon={isOpen ? "chevron-up" : "chevron-down"}
          className="text-gray-500"
        />
      </button>
      {isOpen && (
        <div className="mt-4 space-y-3">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={`${filterKey}-${option.value}`}
                name={filterKey}
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={(e) =>
                  onCheckboxChange(filterKey, option.value, e.target.checked)
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`${filterKey}-${option.value}`}
                className="ml-3 text-sm text-gray-600 cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

FilterSection.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  filterKey: PropTypes.string.isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
};

const JobFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const handleCheckboxChange = (key, value, isChecked) => {
    const currentValues = filters[key] || [];
    let newValues;
    if (isChecked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((item) => item !== value);
    }
    onFilterChange({ [key]: newValues }); // Pass an object with the changed filter
  };

  return (
    <aside className="job-filters bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-1">
        <h3 className="text-xl font-bold text-gray-900">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Clear All
        </button>
      </div>

      {Object.keys(filterOptions).map((key) => (
        <FilterSection
          key={key}
          title={key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())} // Capitalize title
          options={filterOptions[key]}
          filterKey={key}
          selectedValues={filters[key] || []}
          onCheckboxChange={handleCheckboxChange}
        />
      ))}
    </aside>
  );
};

JobFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

export default JobFilters;
