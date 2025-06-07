import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";

const JobSearch = ({ onSearch, initialQuery = "" }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Handle search form submission
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSearch({
        query: searchQuery,
        location,
      });
    },
    [searchQuery, location, onSearch]
  );

  // Handle search query changes
  const handleQueryChange = useCallback(
    (e) => {
      const newQuery = e.target.value;
      setSearchQuery(newQuery);
      if (newQuery.length >= 2) {
        onSearch({
          query: newQuery,
          location,
        });
      }
    },
    [location, onSearch]
  );

  // Handle location changes
  const handleLocationChange = useCallback(
    (e) => {
      const newLocation = e.target.value;
      setLocation(newLocation);
      if (newLocation.length >= 2) {
        onSearch({
          query: searchQuery,
          location: newLocation,
        });
      }
    },
    [searchQuery, onSearch]
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon="search"
                className="h-5 w-5 text-gray-400"
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleQueryChange}
              placeholder="Search jobs, keywords, or company"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Location Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon="map-marker-alt"
                className="h-5 w-5 text-gray-400"
              />
            </div>
            <input
              type="text"
              value={location}
              onChange={handleLocationChange}
              placeholder="City, state, or remote"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FontAwesomeIcon icon="search" className="mr-2" />
            Search Jobs
          </button>
        </div>
      </form>

      {/* Popular Searches */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Popular Searches:
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack"].map(
            (term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  onSearch({ query: term, location });
                }}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {term}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

JobSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  initialQuery: PropTypes.string,
};

export default JobSearch; 