import React from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxDisplayedPages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
  let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);

  if (endPage - startPage + 1 < maxDisplayedPages) {
    startPage = Math.max(1, endPage - maxDisplayedPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Flex justifyContent="center" alignItems="center" mt="4">
      <Button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        size="sm"
        mr="2"
      >
        <ChevronLeftIcon />
      </Button>

      {startPage > 1 && (
        <>
          <Button onClick={() => onPageChange(1)} size="sm" mx="1">
            1
          </Button>
          {startPage > 2 && <Text mx="1">...</Text>}
        </>
      )}

      {pageNumbers.map((number) => (
        <Button
          key={number}
          onClick={() => onPageChange(number)}
          colorScheme={currentPage === number ? 'teal' : 'gray'}
          size="sm"
          mx="1"
        >
          {number}
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <Text mx="1">...</Text>}
          <Button onClick={() => onPageChange(totalPages)} size="sm" mx="1">
            {totalPages}
          </Button>
        </>
      )}

      <Button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        size="sm"
        ml="2"
      >
        <ChevronRightIcon />
      </Button>
    </Flex>
  );
};

export default Pagination;