import React, { useState, useEffect } from 'react';
import './pagination.css';

const Pagination = ({ recordsPerPage, totalRecords, onPageChange, onchangeItemsPerPage }:any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(recordsPerPage);

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  // Handle when totalRecords or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when totalRecords or itemsPerPage changes
  }, [totalRecords, itemsPerPage]);

  const handlePageChange = (page:any) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handleItemsPerPageChange = (e:any) => {
    const selectedItemsPerPage = Number(e.target.value);
    setItemsPerPage(selectedItemsPerPage);
    onchangeItemsPerPage(selectedItemsPerPage); // Call onchangeItemsPerPage with the new value
  };
  const handleClick = (number:any) => {
    handlePageChange(number);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };
  const start = Math.max(1, currentPage - 2);  // Ensures start is at least 1
  const end = Math.min(totalPages, start + 4); // Show 5 pages at a time

  const paginationItems = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="pagination-container justify-content-between">
      <div className="items-per-page">
        Show{' '}
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        &nbsp;
        items per page
      </div>

      <div className="pagination-info">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalRecords)} -{' '}
        {Math.min(currentPage * itemsPerPage, totalRecords)} out of {totalRecords} items
      </div>

        <ul className="pagination-list">
          <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button onClick={handlePrevClick} className="pagination-link">
              &lt;
            </button>
          </li>
          {paginationItems.map((number) => (
            <li key={number} className={`pagination-item ${number === currentPage ? 'active' : ''}`}>
              <button onClick={() => handleClick(number)} className="pagination-link">
                {number}
              </button>
            </li>
          ))}
          <li className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button onClick={handleNextClick} className="pagination-link">
              &gt;
            </button>
          </li>
        </ul>
    </div>
  );
};

export default Pagination;
