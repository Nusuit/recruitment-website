// src/components/common/Pagination.jsx
import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page or less
  }

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Max number of page links to show
    const halfPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfPages);
    let endPage = Math.min(totalPages, currentPage + halfPages);

    // Adjust start/end if near the beginning or end
    if (currentPage - halfPages < 1) {
      endPage = Math.min(totalPages, maxPagesToShow);
    }
    if (currentPage + halfPages > totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          className="px-4 py-2 mx-1 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="start-ellipsis" className="px-4 py-2 mx-1 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-4 py-2 mx-1 border border-gray-300 rounded transition-colors duration-150 ${
            i === currentPage
              ? "bg-blue-600 text-white border-blue-600"
              : "text-gray-700 bg-white hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="end-ellipsis" className="px-4 py-2 mx-1 text-gray-500">
            ...
          </span>
        );
      }
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className="px-4 py-2 mx-1 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <nav
      className="flex justify-center items-center mt-8 py-4"
      aria-label="Pagination"
    >
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <FontAwesomeIcon icon="chevron-left" />
        <span>Previous</span>
      </button>

      <div className="hidden sm:flex">{renderPageNumbers()}</div>
      <div className="flex sm:hidden">
        <span className="px-4 py-2 mx-1 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <span>Next</span>
        <FontAwesomeIcon icon="chevron-right" />
      </button>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
