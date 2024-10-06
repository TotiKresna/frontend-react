import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Input,
  Spacer,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaPlus, FaTrash, FaFileExcel, FaFilePdf, FaSync, FaSearch } from "react-icons/fa";
import Pagination from '../components/Pagination';
import Loader from "../components/Loader";
import { ExportPDF, ExportExcel } from "../utils/TestResultExport";
import { useTestResults } from '../hooks/TestResultsHook';
import { TestResultsTable } from '../components/TestResultsTable';

const TestResults: React.FC = () => {
  const {
    testResults,
    selectedResults,
    loading,
    searchTerm,
    handleSelectResult,
    handleDeleteMultiple,
    handleSearch,
    handleSort,
    fetchData,
  } = useTestResults();

  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const [userRole, setUserRole] = useState('');

  const headingBgGradient = useColorModeValue('linear(to-r, blue.100, teal.100)', 'linear(to-r, blue.600, teal.700)');
  const tableBgColor = useColorModeValue('gray.50', 'gray.700');
  const tableBorderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBorderColor = useColorModeValue('blue.300', 'blue.500');
  const inputHoverBorderColor = useColorModeValue('blue.400', 'blue.600');

  const isSuperAdminOrAdmin = (userRole === 'superadmin' || userRole === 'admin');

  useEffect(() => {
    const storedUserRole = localStorage.getItem('role');
    if (storedUserRole) setUserRole(storedUserRole);
  }, []);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = testResults.slice(indexOfFirstResult, indexOfLastResult);

  const totalPages = Math.ceil(testResults.length / resultsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <Loader />;

  return (
    <Box p={{ base: "4", md: "5", lg: "6" }}>
      <Box bg={tableBgColor} borderWidth="1px" boxShadow="md" borderColor={tableBorderColor} borderRadius="md" overflowX="auto">
        <Flex mb="0" alignItems="center" bgGradient={headingBgGradient} p="4" borderRadius="xs">
          <Heading size="lg">Data Nilai</Heading>
          <Button aria-label="Sync" ml="3" borderRadius="10" size="xs" colorScheme="teal" onClick={fetchData}>
            <FaSync />
          </Button>
          <Spacer />
          {isSuperAdminOrAdmin && (
            <Flex>
              <Button aria-label="create-test-result" size="sm" colorScheme="blue" as={Link} to="/test-results/create" mr="3" leftIcon={<FaPlus />}>
                Create
              </Button>
              <Button aria-label="delete-test-result" size="sm" colorScheme="red" onClick={handleDeleteMultiple} leftIcon={<FaTrash />}>
                Delete
              </Button>
            </Flex>
          )}
        </Flex>
        <Box p={4} borderRadius="md" boxShadow="sm">
          <Flex mb="1" justifyContent="space-between" alignItems="center">
            <InputGroup width="300px">
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search by name"
                mr="1"
                value={searchTerm}
                onChange={handleSearch}
                borderColor={inputBorderColor}
                _hover={{ borderColor: inputHoverBorderColor }}
                _focus={{ borderColor: inputHoverBorderColor, boxShadow: 'outline' }}
              />
            </InputGroup>
            <Flex>
              <Button size="sm" colorScheme="green" onClick={() => ExportExcel(testResults)} mr="2" leftIcon={<FaFileExcel />}>
                Export Excel
              </Button>
              <Button size="sm" colorScheme="red" onClick={() => ExportPDF(testResults)} leftIcon={<FaFilePdf />}>
                Export PDF
              </Button>
            </Flex>
          </Flex>
        </Box>
        <TestResultsTable
          results={currentResults}
          selectedResults={selectedResults}
          isSuperAdminOrAdmin={isSuperAdminOrAdmin}
          onSelectResult={handleSelectResult}
          onSelectAll={(checked) => 
            checked ? testResults.map(result => result._id) : []
          }
          onSort={handleSort}
          startIndex={indexOfFirstResult}
        />
      </Box>
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Box>
  );
};

export default TestResults;