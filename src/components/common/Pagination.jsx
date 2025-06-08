// src/components/common/Pagination.jsx
import React from "react";
import PropTypes from "prop-types";
import { Box, Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page or less
  }

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 0) {
      pages.push(
        <Button
          key={0}
          onClick={() => handlePageChange(0)}
          variant={currentPage === 0 ? 'contained' : 'outlined'}
          size="small"
          sx={{ mx: 0.5 }}
        >
          1
        </Button>
      );
      if (startPage > 1) {
        pages.push(
          <Box key="start-ellipsis" component="span" sx={{ mx: 1 }}>
            ...
          </Box>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={currentPage === i ? 'contained' : 'outlined'}
          size="small"
          sx={{ mx: 0.5 }}
        >
          {i + 1}
        </Button>
      );
    }

    // Last page
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(
          <Box key="end-ellipsis" component="span" sx={{ mx: 1 }}>
            ...
          </Box>
        );
      }
      pages.push(
        <Button
          key={totalPages - 1}
          onClick={() => handlePageChange(totalPages - 1)}
          variant={currentPage === totalPages - 1 ? 'contained' : 'outlined'}
          size="small"
          sx={{ mx: 0.5 }}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" my={2}>
      <IconButton
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
        size="small"
      >
        <ChevronLeft />
      </IconButton>
      {renderPageNumbers()}
      <IconButton
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        size="small"
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
