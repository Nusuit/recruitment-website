// src/components/client/Home/SearchBar.js
import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
      <div className="flex-grow flex items-center md:border-r border-gray-300 mb-3 md:mb-0">
        <div className="bg-gray-100 p-2 rounded-full mr-2">
          <FaSearch className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm theo chức danh, từ khóa hoặc công ty"
          className="w-full border-0 focus:ring-0 focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex-grow flex items-center md:pl-4 mb-3 md:mb-0">
        <div className="bg-gray-100 p-2 rounded-full mr-2">
          <FaMapMarkerAlt className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Địa điểm"
          className="w-full border-0 focus:ring-0 focus:outline-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md flex-shrink-0"
      >
        Tìm kiếm
      </button>
    </form>
  );
};

export default SearchBar;

