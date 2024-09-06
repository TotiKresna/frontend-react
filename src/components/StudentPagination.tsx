import React from 'react';
import { Flex, Button } from '@chakra-ui/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Flex justifyContent="center" mt="4">
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          colorScheme={currentPage === i + 1 ? 'blue' : 'gray'}
          mx="1"
          size="sm"
        >
          {i + 1}
        </Button>
      ))}
    </Flex>
  );
};

export default Pagination;