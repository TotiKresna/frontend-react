import React from 'react';
import { Box, Flex, Heading, Button, Input, Spacer,  InputGroup, InputLeftElement, useColorModeValue } from '@chakra-ui/react';
import { FaPlus, FaTrash, FaFileExcel, FaFilePdf, FaSync, FaSearch } from 'react-icons/fa';
import useStudents from '../hooks/StudentsHook';
import StudentTable from '../components/StudentTable';
import Pagination from '../components/Pagination';
import EditStudentModal from '../modals/EditStudentModal';
import { exportToPDF, exportToExcel } from '../utils/StudentExport';
import Loader from '../components/Loader';

const Students: React.FC = () => {
  const {
    allStudents,
    currentStudents,
    indexOfFirstStudent,
    loading,
    selectedStudents,
    searchTerm,
    currentPage,
    totalPages,
    isModalOpen,
    editingStudentId,
    userRole,
    handleRefresh,
    handleOpenModal,
    handleCloseModal,
    handleStudentUpdate,
    handleDeleteMultiple,
    handleSearch,
    handlePageChange,
    handleSelectStudent,
    handleSelectAllStudents,
    handleSort,
    sortKey,
    sortOrder,
  } = useStudents();

  const headingBgGradient = useColorModeValue('linear(to-r, blue.100, teal.100)','linear(to-r, blue.600, teal.700)');
  const tableBgColor = useColorModeValue('gray.50', 'gray.700');
  const tableBorderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBorderColor = useColorModeValue('blue.300', 'blue.500');
  const inputHoverBorderColor = useColorModeValue('blue.400', 'blue.600');

  const isSuperAdminOrAdmin = userRole === 'superadmin' || userRole === 'admin';

  if (loading) return <Loader />;

  return (
    <Box p={{ base: "4", md: "5", lg: "6" }}>
      <Box bg={tableBgColor} borderWidth="1px" boxShadow="md" borderColor={tableBorderColor} borderRadius="md" overflowX="auto">
        <Flex mb="0" alignItems="center" bgGradient={headingBgGradient} p="4" borderRadius="xs">
          <Heading size="lg">Data Siswa</Heading>
          <Button aria-label="Sync" ml="3" borderRadius="10" size="xs" colorScheme="teal" onClick={handleRefresh}>
            <FaSync />
          </Button>
          <Spacer />
          {isSuperAdminOrAdmin && (
            <Flex>
              <Button aria-label="create-student" size="sm" colorScheme="blue" onClick={() => handleOpenModal()} mr="3" leftIcon={<FaPlus />}>
                Create
              </Button>
              <Button aria-label="delete-student" size="sm" colorScheme="red" onClick={handleDeleteMultiple} leftIcon={<FaTrash />}>
                Delete
              </Button>
            </Flex>
          )}
        </Flex>
        <Box p={4} borderRadius="xs" boxShadow="sm">
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
              <Button size="sm" colorScheme="green" onClick={() => exportToExcel(allStudents)} mr="2" leftIcon={<FaFileExcel />}>
                Export Excel
              </Button>
              <Button size="sm" colorScheme="red" onClick={() => exportToPDF(allStudents)} leftIcon={<FaFilePdf />}>
                Export PDF
              </Button>
            </Flex>
          </Flex>
        </Box>
        <StudentTable 
          currentStudents={currentStudents}
          allStudents={allStudents}
          indexOfFirstStudent={indexOfFirstStudent}
          selectedStudents={selectedStudents}
          isSuperAdminOrAdmin={isSuperAdminOrAdmin}
          onOpenModal={handleOpenModal}
          onSelectStudent={handleSelectStudent}
          onSelectAllStudents={handleSelectAllStudents}
          onSort={handleSort}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />
      </Box>
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <EditStudentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        studentId={editingStudentId}
        onStudentUpdate={handleStudentUpdate}
      />
    </Box>
  );
};

export default Students;