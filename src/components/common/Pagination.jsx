import React from 'react';
import { Pagination as MuiPagination } from '@mui/material';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  const handleChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <div className="pagination-container">
      <MuiPagination 
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
        siblingCount={siblingCount}
      />
    </div>
  );
};

export default Pagination;